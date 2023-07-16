import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth/users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @Post('login')
  async login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }
}
