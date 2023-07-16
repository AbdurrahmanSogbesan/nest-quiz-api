import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuizDto, UpdateQuizDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz } from './schema/quiz.model';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/schema/user.model';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createQuiz(userId: string, dto: CreateQuizDto) {
    try {
      const { name, description } = dto;

      const quiz = new this.quizModel({ name, description, createdBy: userId });

      const result = await quiz.save();

      // Find logged in user and add quiz to their created quizzes
      const user = await this.userModel.findById(userId);
      user.quizzes.push(quiz);
      await user.save();

      return {
        status: HttpStatus.CREATED,
        message: 'Quiz created successfully.',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  async getQuizzes() {
    try {
      const quizzes = await this.quizModel.find().exec();

      return {
        status: HttpStatus.OK,
        message: 'Quizzes fetched successfully.',
        data: quizzes,
      };
    } catch (error) {
      throw error;
    }
  }

  async getQuizById(quizId: string) {
    try {
      const quiz = await this.quizModel
        .findById(quizId)
        .populate('createdBy', '-password');

      if (!quiz) throw new NotFoundException('Quiz was not found');

      return {
        status: HttpStatus.OK,
        message: 'Quiz details fetched successfully.',
        data: quiz,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateQuiz(quizId: string, userId: string, dto: UpdateQuizDto) {
    const { name, description } = dto;
    try {
      // Find Quiz
      const quiz = await this.quizModel.findById(quizId);

      if (!quiz) throw new NotFoundException('Quiz not found.');

      // Doesnt permit updating quiz if not creator
      if (quiz.createdBy.toString() !== userId)
        throw new ForbiddenException('Not authorized.');

      if (name) quiz.name = name;

      if (description) quiz.description = description;

      const result = await quiz.save();

      return {
        status: HttpStatus.OK,
        message: 'Quiz updated successfully.',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteQuiz(quizId: string, userId: string) {
    try {
      // find quiz
      const quiz = await this.quizModel.findById(quizId);

      if (!quiz) throw new NotFoundException('Quiz not found');

      // Doesnt permit deleting quiz if not creator
      if (quiz.createdBy.toString() !== userId)
        throw new ForbiddenException('Not authorized.');

      // Remove quiz from db
      await this.quizModel.findByIdAndRemove(quizId);

      // Find creator and update quizzes array
      await this.userModel.findByIdAndUpdate(
        { _id: userId },
        { $pull: { quizzes: quizId } },
      );

      return { status: HttpStatus.OK, message: 'Quiz deleted successfully.' };
    } catch (error) {
      throw error;
    }
  }
}
