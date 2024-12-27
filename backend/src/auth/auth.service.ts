import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { Password } from '../users/entities/password.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';

@Injectable()
export class AuthService {
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
        isActive: true,
      },
    });

    const password = await this.passwordRepository.findOne({
      where: {
        user,
        isActive: true,
      },
    });

    if (await verify(password?.password, authCredentialsDto.password)) {
      return {
        token: await this.jwtService.signAsync({
          id: user.id,
          email: user.email,
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
  ): Promise<UpdateResult> {
    const user = await this.userRepository.findOneBy({
      email: authCredentialsDto.email,
    });

    const password = await this.passwordRepository.findOne({
      where: {
        user,
        isActive: true,
      },
    });

    if (password?.password == (await hash(authCredentialsDto.password))) {
      await this.userRepository.manager.transaction(async (manager) => {
        await manager.update(Password, password, { isActive: false });

        const [outdated, count] = await manager.findAndCount(Password, {
          where: { user, isActive: false },
          order: { createdAt: 'desc' },
        });

        for (const password of outdated) {
          if (await verify(password.password, updateCredentialsDto.password)) {
            throw new BadRequestException(
              'password matches one of the last five used passwords'
            );
          }
        }

        if (count == 5) {
          await manager.delete(Password, outdated.pop());
        }

        await manager.save(
          Password,
          this.passwordRepository.create({
            user,
            password: await hash(updateCredentialsDto.password),
          })
        );
      });
    }

    throw new ForbiddenException('invalid credentials');
  }
}
