import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { Password } from './entities/password.entity';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { PaginatedResult } from 'src/common/type/paginated-result.type';
import { hash } from 'argon2';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Password)
    private readonly passwordRepository: Repository<Password>
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    if (
      await this.userRepository.findOne({
        where: [{ email: createUserDto.email }, { phone: createUserDto.phone }],
        withDeleted: true,
      })
    ) {
      throw new ConflictException(
        'email and phone numbers must be unique across users'
      );
    }

    return await this.userRepository.manager.transaction(async (manager) => {
      this.logger.debug('Creating and saving user data');

      const user = await manager.save(
        manager.create(User, {
          ...createUserDto,
          passwords: [],
        })
      );

      if (createUserDto.password) {
        await manager.save(
          manager.create(Password, {
            user,
            password: await hash(createUserDto.password),
          })
        );
      }

      return user;
    });
  }

  public async findMany(
    paginatedQueryDto: PaginatedQueryDto
  ): Promise<PaginatedResult<User>> {
    const { page = 0, size = 10 } = paginatedQueryDto;

    const [data, total] = await this.userRepository
      .createQueryBuilder('user')
      .skip(page * size)
      .take(size)
      .getManyAndCount();

    return {
      data,
      meta: { page, size, total },
    } as PaginatedResult<User>;
  }

  public async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<UpdateResult> {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException('user not found');

    if (user.role == UserRole.SUPERADMIN)
      throw new UnauthorizedException('insufficient permissions');

    return await this.userRepository.update({ id }, updateUserDto);
  }

  public async remove(id: string): Promise<void> {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException('user not found');

    if (user.role == UserRole.SUPERADMIN)
      throw new UnauthorizedException('insufficient permissions');

    await this.userRepository.softDelete({ id });
  }

  public async modifyBalance(
    id: string,
    amount: number
  ): Promise<UpdateResult> {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException('user not found');

    const result = user.balance + amount;

    if (result < 0) throw new BadRequestException('not enough balance');

    return await this.userRepository.update({ id }, { balance: result });
  }
}
