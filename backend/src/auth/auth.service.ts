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
import { UserStatus } from 'src/users/enums/user-status.enum';
import { GrantStatusDto } from './dto/grant-status.dto';

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
      const password = await this.passwordRepository.findOneBy({
        user: { id: user.id },
      });

      if (password) throw new ForbiddenException('this account already exists');
    }

    await this.userRepository.manager.transaction(async (manager) => {
      const params = user
        ? { id: user.id, ...createAccountDto }
        : createAccountDto;

      const created = await manager.save(
        manager.create(User, { ...params, passwords: [] })
      );

      await manager.save(
        manager.create(Password, {
          user: created,
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
    this.logger.debug(`Logging in as '${authCredentialsDto.email}'`);

    const user = await this.userRepository.findOne({
      where: {
        email: authCredentialsDto.email,
      },
    });

    if (!user) throw new UnauthorizedException('invalid credentials');

    if (user.status == UserStatus.BLOCKED)
      throw new UnauthorizedException('blocked user');

    if (user.status == UserStatus.PENDING)
      throw new UnauthorizedException('pending user');

    const password = await this.passwordRepository.findOneBy({
      user: { id: user.id },
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
          status: user.status,
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

  public async grantStatus(
    id: string,
    grantStatusDto: GrantStatusDto
  ): Promise<UpdateResult> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('user not found');

    if (user.role == UserRole.SUPERADMIN)
      throw new UnauthorizedException('insufficient permissions');

    return this.userRepository.update(user, { status: grantStatusDto.status });
  }

  public async resetPassword(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('user not found');

    if (user.role == UserRole.SUPERADMIN)
      throw new UnauthorizedException('insufficient permissions');

    const password = await this.passwordRepository.findOneBy({
      user: { id: user.id },
    });

    if (!password) throw new NotFoundException('password not found');

    this.logger.debug(`Disabling password ${password.id}`);

    await this.passwordRepository.softDelete({ id: password.id });
  }
}
