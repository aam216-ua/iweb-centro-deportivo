import { Controller, Post, Body, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  authenticate(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.authenticate(authCredentialsDto);
  }

  @Put()
  reset(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Body() updateCredentialsDto: UpdateCredentialsDto,
  ) {
    return this.authService.reset(authCredentialsDto, updateCredentialsDto);
  }
}
