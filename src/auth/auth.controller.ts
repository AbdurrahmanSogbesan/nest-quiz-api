import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth/users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'Sign Up' })
  async signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log In' })
  async login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }
}
