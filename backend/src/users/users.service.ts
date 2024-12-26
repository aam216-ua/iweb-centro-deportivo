import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { Password } from './entities/password.entity';
import { hash } from 'bcrypt';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { PaginatedResult } from 'src/common/type/paginated-result.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Password)
    private passwordRepository: Repository<Password>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    if (
      await this.userRepository.findOne({
        where: [{ email: createUserDto.email }, { phone: createUserDto.phone }],
      })
    ) {
      throw new ConflictException(
        'email and phone numbers must be unique across users',
      );
    }

    return await this.userRepository.manager.transaction(async (manager) => {
      const user = await manager.save(
        User,
        manager.create(User, {
          email: createUserDto.email,
          name: createUserDto.name,
          surname: createUserDto.surname,
          phone: createUserDto.phone,
          role: createUserDto.role,
        }),
      );

      await manager.save(
        Password,
        manager.create(Password, {
          user,
          password: await hash(createUserDto.password, 10),
        }),
      );

      return user;
    });
  }

  public async findMany(
    paginatedQueryDto: PaginatedQueryDto,
  ): Promise<PaginatedResult<User>> {
    const { page = 1, size = 10 } = paginatedQueryDto;

    const [data, total] = await this.userRepository
      .createQueryBuilder('user')
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();

    return {
      data,
      meta: {
        page,
        size,
        total,
      },
    } as PaginatedResult<User>;
  }

  public async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    if (this.findOne(id)) {
      return await this.userRepository.update({ id }, updateUserDto);
    } else {
      throw new NotFoundException('user not found');
    }
  }

  public async remove(id: string): Promise<void> {
    if (this.findOne(id)) {
      await this.userRepository.update({ id }, { isActive: false });
    } else {
      throw new NotFoundException('user not found');
    }
  }
}
