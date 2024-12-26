import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Password } from './entities/password.entity';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Password)
    private passwordRepository: Repository<Password>,
  ) {}

  private async create(createUserDto: CreateUserDto): Promise<User> {
    if (
      await this.userRepository.findOne({
        where: [{ email: createUserDto.email }, { phone: createUserDto.phone }],
      })
    ) {
      throw new ConflictException(
        'email and phone numbers must be unique across users',
      );
    }

    const user = await this.userRepository.save(
      this.userRepository.create({
        email: createUserDto.email,
        name: createUserDto.name,
        surname: createUserDto.surname,
        phone: createUserDto.phone,
        role: createUserDto.role,
      }),
    );

    await this.passwordRepository.save(
      this.passwordRepository.create({
        user,
        password: await hash(createUserDto.password, 10),
      }),
    );

    return user;
  }

  changePassword(id: string, updateCredentialsDto: UpdateCredentialsDto) {
    return;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
