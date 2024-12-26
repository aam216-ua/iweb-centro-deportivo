import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository, UpdateResult } from 'typeorm';
import { Password } from './entities/password.entity';
import { compare, hash } from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Password)
    private passwordRepository: Repository<Password>,
  ) {}

  public async authenticate(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User> {
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

    if (await compare(authCredentialsDto.password, password?.password)) {
      return user;
    }

    throw new ForbiddenException('invalid credentials');
  }

  public async reset(
    authCredentialsDto: AuthCredentialsDto,
    updateCredentialsDto: UpdateCredentialsDto,
    @InjectEntityManager() entityManager: EntityManager,
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

    if (password?.password == (await hash(authCredentialsDto.password, 10))) {
      await entityManager.transaction(async (manager) => {
        await manager.update(Password, password, { isActive: false });

        const [outdated, count] = await manager.findAndCount(Password, {
          where: { user, isActive: false },
          order: { createdAt: 'desc' },
        });

        for (const password of outdated) {
          if (await compare(updateCredentialsDto.password, password.password)) {
            throw new BadRequestException(
              'password matches one of the last five used passwords',
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
            password: await hash(updateCredentialsDto.password, 10),
          }),
        );
      });
    }

    throw new ForbiddenException('invalid credentials');
  }
}
