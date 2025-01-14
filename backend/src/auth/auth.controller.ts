import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  ParseUUIDPipe,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { AuthGuard } from './auth.guard';
import { Session } from './decorators/session.decorator';
import { UserSession } from './types/user-session.type';
import { GrantRoleDto } from './dto/grant-role.dto';
import { UserRole } from 'src/users/enums/user-role.enum';
import { GrantStatusDto } from './dto/grant-status.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Crear una cuenta' })
  @ApiResponse({ status: HttpStatus.CREATED })
  signUp(@Body() createAccountDto: CreateAccountDto) {
    return this.authService.signUp(createAccountDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: HttpStatus.OK, type: Object })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  signIn(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signIn(authCredentialsDto);
  }

  @UseGuards(AuthGuard)
  @Post('grant/:id/role')
  @ApiOperation({ summary: 'Conceder un rol' })
  @ApiResponse({ status: HttpStatus.OK, type: UpdateResult })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  grantRole(
    @Session() session: UserSession,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() grantRoleDto: GrantRoleDto
  ) {
    if (session.role != UserRole.SUPERADMIN && session.role != UserRole.ADMIN)
      throw new UnauthorizedException('insufficient permissions');

    if (grantRoleDto.role == UserRole.SUPERADMIN)
      throw new UnauthorizedException('insufficient permissions');

    return this.authService.grantRole(id, grantRoleDto);
  }

  @UseGuards(AuthGuard)
  @Post('grant/:id/status')
  @ApiOperation({ summary: 'Conceder un estado' })
  @ApiResponse({ status: HttpStatus.OK, type: UpdateResult })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  grantStatus(
    @Session() session: UserSession,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() grantStatusDto: GrantStatusDto
  ) {
    if (session.role == UserRole.CUSTOMER)
      throw new UnauthorizedException('insufficient permissions');

    return this.authService.grantStatus(id, grantStatusDto);
  }

  @UseGuards(AuthGuard)
  @Post('reset/:id')
  @ApiOperation({ summary: 'Restablecer la contraseña' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  resetPasswords(
    @Session() session: UserSession,
    @Param('id', new ParseUUIDPipe()) id: string
  ) {
    if (session.role != UserRole.SUPERADMIN && session.role != UserRole.ADMIN)
      throw new UnauthorizedException('insufficient permissions');

    return this.authService.resetPassword(id);
  }
}
