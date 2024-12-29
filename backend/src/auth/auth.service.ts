import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Password } from '../users/entities/password.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Password)
    private passwordRepository: Repository<Password>,
    private jwtService: JwtService
  ) {}

  public async signIn(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<{ token: string; user: User }> {
    const user = await this.userRepository.findOne({
      where: {
        email: authCredentialsDto.email,
      },
    });

    const password = await this.passwordRepository.findOne({
      where: {
        user: { id: user.id },
        isActive: true,
      },
    });

    this.logger.debug(
      `Found user with email '${user?.email ?? undefined}' and ${password ? 'existing' : 'undefined'} password`
    );

    if (
      password &&
      (await verify(password.password, authCredentialsDto.password))
    ) {
      return {
        token: await this.jwtService.signAsync({
          id: user.id,
          role: user.role,
        }),
        user,
      };
    }

    throw new UnauthorizedException('invalid credentials');
  }

  public async signOut() {}

  public async reset(
    authCredentialsDto: AuthCredentialsDto,
    updateCredentialsDto: UpdateCredentialsDto
  ): Promise<void> {
    const user = await this.userRepository.findOneBy({
      email: authCredentialsDto.email,
    });

    const password = await this.passwordRepository.findOne({
      where: {
        user: { id: user.id },
        isActive: true,
      },
    });

    this.logger.debug(
      `Found user with email '${user?.email ?? undefined}' and ${password != null ? 'existing' : 'undefined'} password`
    );

    if (
      password &&
      (await verify(password.password, authCredentialsDto.password))
    ) {
      await this.userRepository.manager.transaction(async (manager) => {
        const [userPasswords, count] = await manager.findAndCount(Password, {
          where: { user: { id: user.id } },
          order: { createdAt: 'desc' },
        });

        for (const oldPassword of userPasswords) {
          if (
            await verify(oldPassword.password, updateCredentialsDto.newPassword)
          ) {
            throw new BadRequestException(
              'password matches one of the last five used passwords'
            );
          }
        }

        await manager.update(Password, password, { isActive: false });

        if (count >= 5) await manager.delete(Password, userPasswords.pop());

        await manager.save(
          manager.create(Password, {
            user,
            password: await hash(updateCredentialsDto.newPassword),
          })
        );
      });

      return;
    }

    throw new ForbiddenException('invalid credentials');
  }
}
