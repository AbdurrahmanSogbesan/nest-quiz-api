import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.model';
import { UserController } from './user.controller';

const UserFeature = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

@Module({
  imports: [UserFeature],
  controllers: [UserController],
  exports: [UserFeature],
})
export class UserModule {}
