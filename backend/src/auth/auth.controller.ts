import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  ParseUUIDPipe,
  UnauthorizedException,
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createAccountDto: CreateAccountDto) {
    return this.authService.signUp(createAccountDto);
  }

  @Post('signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signIn(authCredentialsDto);
  }

  @UseGuards(AuthGuard)
  @Post('grant/:id/role')
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
  grantStatus(
    @Session() session: UserSession,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() grantStatusDto: GrantStatusDto
  ) {
    if (session.role != UserRole.SUPERADMIN && session.role != UserRole.ADMIN)
      throw new UnauthorizedException('insufficient permissions');

    return this.authService.grantStatus(id, grantStatusDto);
  }

  @UseGuards(AuthGuard)
  @Post('reset/:id')
  resetPasswords(
    @Session() session: UserSession,
    @Param('id', new ParseUUIDPipe()) id: string
  ) {
    if (session.role != UserRole.SUPERADMIN && session.role != UserRole.ADMIN)
      throw new UnauthorizedException('insufficient permissions');

    return this.authService.resetPassword(id);
  }
}
