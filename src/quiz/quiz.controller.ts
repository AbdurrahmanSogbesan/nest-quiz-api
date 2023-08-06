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
import { AttemptQuizDto, CreateQuizDto, UpdateQuizDto } from './dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Quiz')
@UseGuards(JwtGuard)
@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @ApiOperation({ summary: 'Create Quiz' })
  async createQuiz(@GetUser('_id') userId: string, @Body() dto: CreateQuizDto) {
    return this.quizService.createQuiz(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get Quizzes' })
  async getQuizzes() {
    return this.quizService.getQuizzes();
  }

  @Get(':quiz_id')
  @ApiOperation({ summary: 'Get Quiz Details' })
  async getQuizById(@Param('quiz_id') quizId: string) {
    return this.quizService.getQuizById(quizId);
  }

  @Put(':quiz_id')
  @ApiOperation({ summary: 'Update Quiz Details' })
  async updateQuiz(
    @Param('quiz_id') quizId: string,
    @Body() dto: UpdateQuizDto,
    @GetUser('id') userId: string,
  ) {
    return this.quizService.updateQuiz(quizId, userId, dto);
  }

  @Delete(':quiz_id')
  @ApiOperation({ summary: 'Delete Quiz' })
  async deleteQuiz(
    @Param('quiz_id') quizId: string,
    @GetUser('id') userId: string,
  ) {
    return this.quizService.deleteQuiz(quizId, userId);
  }

  @Post(':quiz_id/close')
  @ApiOperation({ summary: 'Close Quiz' })
  async closeQuiz(
    @Param('quiz_id') quizId: string,
    @GetUser('id') userId: string,
  ) {
    return this.quizService.closeQuiz(quizId, userId);
  }

  @Post(':quiz_id/attempt')
  @ApiOperation({ summary: 'Attempt Quiz' })
  async attemptQuiz(
    @Param('quiz_id') quizId: string,
    @GetUser('id') userId: string,
    @Body() dto: AttemptQuizDto,
  ) {
    return this.quizService.attemptQuiz(quizId, userId, dto);
  }

  @Get(':quiz_id/participants')
  @ApiOperation({ summary: 'Get Quiz Participants' })
  async getQuizParticipants(@Param('quiz_id') quizId: string) {
    return this.quizService.getQuizParticipants(quizId);
  }

  @Get(':quiz_id/leaderboard')
  @ApiOperation({ summary: 'Get Quiz Leaderboard' })
  async getLeaderboard(@Param('quiz_id') quizId: string) {
    return this.quizService.getLeaderboard(quizId);
  }
}
