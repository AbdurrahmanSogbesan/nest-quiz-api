import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { QuizModule } from './quiz/quiz.module';
import { UserModule } from './user/user.module';
import { QuestionModule } from './question/question.module';
import { ParticipantModule } from './participant/participant.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule,
    AuthModule,
    QuizModule,
    QuestionModule,
    ParticipantModule,
  ],
  controllers: [UserController],
  providers: [],
})
export class AppModule {}
