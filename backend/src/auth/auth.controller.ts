import {
  Controller,
  Post,
  Body,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { UpdateCredentialsDto } from '../auth/dto/update-credentials.dto';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() createAccountDto: CreateAccountDto) {
    return this.authService.signUp(createAccountDto);
  }

  @Post('/signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/signout')
  signOut() {
    throw new BadRequestException('unimplemented');
  }

  @Patch('/reset')
  reset(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Body() updateCredentialsDto: UpdateCredentialsDto
  ) {
    return this.authService.reset(authCredentialsDto, updateCredentialsDto);
  }
}
