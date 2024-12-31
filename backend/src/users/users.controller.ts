import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserRole } from './enums/user-role.enum';
import { UserSession } from 'src/auth/types/user-session.type';
import { Session } from 'src/auth/decorators/session.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findMany(
    @Session() session: UserSession,
    @Query() paginatedQueryDto: PaginatedQueryDto
  ) {
    if (session.role == UserRole.CUSTOMER)
      throw new UnauthorizedException('insufficient permissions');

    return this.usersService.findMany(paginatedQueryDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(
    @Session() session: UserSession,
    @Param('id', new ParseUUIDPipe()) id: string
  ) {
    if (session.role == UserRole.CUSTOMER && session.id != id)
      throw new UnauthorizedException('insufficient permissions');

    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Session() session: UserSession,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    if (session.role == UserRole.CUSTOMER)
      throw new UnauthorizedException('insufficient permissions');

    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(
    @Session() session: UserSession,
    @Param('id', new ParseUUIDPipe()) id: string
  ) {
    if (session.role == UserRole.CUSTOMER)
      throw new UnauthorizedException('insufficient permissions');

    return this.usersService.remove(id);
  }
}
