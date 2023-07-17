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
import { QuizService } from './quiz.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { CreateQuizDto, UpdateQuizDto } from './dto';

@UseGuards(JwtGuard)
@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  async createQuiz(@GetUser('_id') userId: string, @Body() dto: CreateQuizDto) {
    return this.quizService.createQuiz(userId, dto);
  }

  @Get()
  async getQuizzes() {
    return this.quizService.getQuizzes();
  }

  @Get(':quiz_id')
  async getQuizById(@Param('quiz_id') quizId: string) {
    return this.quizService.getQuizById(quizId);
  }

  @Put(':quiz_id')
  async updateQuiz(
    @Param('quiz_id') quizId: string,
    @Body() dto: UpdateQuizDto,
    @GetUser('id') userId: string,
  ) {
    return this.quizService.updateQuiz(quizId, userId, dto);
  }

  @Delete(':quiz_id')
  async deleteQuiz(
    @Param('quiz_id') quizId: string,
    @GetUser('id') userId: string,
  ) {
    return this.quizService.deleteQuiz(quizId, userId);
  }

  @Post(':quiz_id/close')
  async closeQuiz(
    @Param('quiz_id') quizId: string,
    @GetUser('id') userId: string,
  ) {
    return this.quizService.closeQuiz(quizId, userId);
  }

  @Post(':quiz_id/attempt')
  async attemptQuiz(
    @Param('quiz_id') quizId: string,
    @GetUser('id') userId: string,
  ) {
    return this.quizService.attemptQuiz(quizId, userId);
  }

  @Get(':quiz_id/participants')
  async getQuizParticipants(
    @Param('quiz_id') quizId: string,
    @GetUser('id') userId: string,
  ) {
    return this.quizService.getQuizParticipants(quizId, userId);
  }
}
