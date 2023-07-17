import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from './quesiton.service';
import { JwtGuard } from 'src/auth/guard';
import { CreateQuestionDto, UpdateQuestionDto } from './dto';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtGuard)
@Controller('quizzes')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post(':quiz_id/questions')
  async createQuestion(
    @Param('quiz_id') quizId: string,
    @Body() dto: CreateQuestionDto,
    @GetUser('id') userId: string,
  ) {
    return this.questionService.createQuestion(quizId, dto, userId);
  }

  @Get(':quiz_id/questions')
  async getQuestions(@Param('quiz_id') quizId: string) {
    return this.questionService.getQuestions(quizId);
  }

  @Get(':quiz_id/questions/:question_id')
  async getQuestion(
    @Param('quiz_id') quizId: string,
    @Param('question_id') questionId: string,
  ) {
    return this.questionService.getQuestion(quizId, questionId);
  }

  @Put(':quiz_id/questions/:question_id')
  async updateQuestion(
    @Param('quiz_id') quizId: string,
    @Param('question_id') questionId: string,
    @Body() dto: UpdateQuestionDto,
    @GetUser('id') userId: string,
  ) {
    return this.questionService.updateQuestion(quizId, questionId, dto, userId);
  }

  @Delete(':quiz_id/questions/:question_id')
  async deleteQuestion(
    @Param('quiz_id') quizId: string,
    @Param('question_id') questionId: string,
    @GetUser('id') userId: string,
  ) {
    return this.questionService.deleteQuestion(quizId, questionId, userId);
  }
}
