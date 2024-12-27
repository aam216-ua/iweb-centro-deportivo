import { Controller, Post, Body, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { UpdateCredentialsDto } from '../auth/dto/update-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/signout')
  signOut() {
    return;
  }

  @Patch('/reset')
  reset(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Body() updateCredentialsDto: UpdateCredentialsDto
  ) {
    return this.authService.reset(authCredentialsDto, updateCredentialsDto);
  }
}
