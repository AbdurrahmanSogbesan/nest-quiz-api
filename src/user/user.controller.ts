import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  // todo: add update and delete user
  // test
  // @Get('me')
  // async getUser(@GetUser() user) {
  //   return user;
  // }
}
