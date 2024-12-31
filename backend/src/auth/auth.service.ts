import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { Password } from '../users/entities/password.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { CreateAccountDto } from './dto/create-account.dto';
import { GrantRoleDto } from './dto/grant-role.dto';
import { UserRole } from 'src/users/enums/user-role.enum';

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

  public async signUp(
    createAccountDto: CreateAccountDto
  ): Promise<{ token: string; user: User }> {
    const user = await this.userRepository.findOne({
      where: {
        email: createAccountDto.email,
      },
    });

    if (user) {
      const password = await this.passwordRepository.findOne({
        where: {
          user: { id: user.id },
          isActive: true,
        },
      });

      if (password) throw new ForbiddenException('this account already exists');
    }

    await this.userRepository.manager.transaction(async (manager) => {
      this.logger.debug('Creating and saving user data');

      const params = user
        ? { id: user.id, ...createAccountDto }
        : createAccountDto;

      const created = await manager.save(manager.create(User, params));

      await manager.save(
        manager.create(Password, {
          created,
          password: await hash(createAccountDto.password),
        })
      );
    });

    return this.signIn({
      email: createAccountDto.email,
      password: createAccountDto.password,
    });
  }

  public async signIn(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<{ token: string; user: User }> {
    const user = await this.userRepository.findOne({
      where: {
        email: authCredentialsDto.email,
      },
    });

    if (!user) throw new UnauthorizedException('invalid credentials');

    const password = await this.passwordRepository.findOne({
      where: {
        user: { id: user.id },
        isActive: true,
      },
    });

    if (!password) throw new UnauthorizedException('invalid credentials');

    this.logger.debug(
      `Found user with email '${user?.email ?? undefined}' and ${password ? 'existing' : 'undefined'} password`
    );

    if (await verify(password.password, authCredentialsDto.password)) {
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

  public async grantRole(
    id: string,
    grantRoleDto: GrantRoleDto
  ): Promise<UpdateResult> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('user not found');

    if (user.role == UserRole.SUPERADMIN)
      throw new UnauthorizedException('insufficient permissions');

    return this.userRepository.update(user, { role: grantRoleDto.role });
  }

  public async resetPassword(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('user not found');

    if (user.role == UserRole.SUPERADMIN)
      throw new UnauthorizedException('insufficient permissioins');

    const password = await this.passwordRepository.findOneBy({
      user: { id: user.id },
      isActive: true,
    });

    if (!password) return;

    await this.passwordRepository.update(password, { isActive: false });
  }
}
