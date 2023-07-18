import { Module, forwardRef } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './schema/question.model';
import { QuizModule } from 'src/quiz/quiz.module';

const QuestionFeature = MongooseModule.forFeature([
  { name: Question.name, schema: QuestionSchema },
]);

@Module({
  imports: [QuestionFeature, forwardRef(() => QuizModule)],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionFeature],
})
export class QuestionModule {}
