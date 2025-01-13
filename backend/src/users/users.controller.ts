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
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserRole } from './enums/user-role.enum';
import { UserSession } from 'src/auth/types/user-session.type';
import { Session } from 'src/auth/decorators/session.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Crear un usuario' })
  @ApiResponse({ status: HttpStatus.CREATED, type: User })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  create(
    @Session() session: UserSession,
    @Body() createUserDto: CreateUserDto
  ) {
    if (session.role == UserRole.CUSTOMER)
      throw new UnauthorizedException('insufficient permissions');

    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Buscar usuarios' })
  @ApiResponse({ status: HttpStatus.OK, type: [User] })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
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
  @ApiOperation({ summary: 'Buscar un usuario' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
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
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
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
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  remove(
    @Session() session: UserSession,
    @Param('id', new ParseUUIDPipe()) id: string
  ) {
    if (session.role == UserRole.CUSTOMER && id != session.id)
      throw new UnauthorizedException('insufficient permissions');

    return this.usersService.remove(id);
  }
}
