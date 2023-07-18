import { Module, forwardRef } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from './schema/quiz.model';
import { UserModule } from 'src/user/user.module';
import { QuestionModule } from 'src/question/question.module';
import { ParticipantModule } from 'src/participant/participant.module';

const QuizFeature = MongooseModule.forFeature([
  { name: Quiz.name, schema: QuizSchema },
]);
@Module({
  imports: [
    QuizFeature,
    UserModule,
    forwardRef(() => QuestionModule),
    ParticipantModule,
  ],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizFeature],
})
export class QuizModule {}
