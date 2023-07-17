import {
  BadRequestException,
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
import { sendResponse } from 'src/utils/send-response';
import { Question } from 'src/question/schema/question.model';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  async createQuiz(userId: string, dto: CreateQuizDto) {
    try {
      const { name, description } = dto;

      const quiz = new this.quizModel({ name, description, createdBy: userId });

      const result = await quiz.save();

      // Find logged in user and add quiz to their created quizzes
      await this.userModel.findByIdAndUpdate(
        { _id: userId },
        { $push: { quizzes: quiz._id } },
      );

      return sendResponse(
        HttpStatus.CREATED,
        'Quiz created successfully.',
        result,
      );
    } catch (error) {
      throw error;
    }
  }

  async getQuizzes() {
    try {
      const quizzes = await this.quizModel.find().exec();

      return sendResponse(
        HttpStatus.OK,
        'Quizzes fetched successfully.',
        quizzes,
      );
    } catch (error) {
      throw error;
    }
  }

  async getQuizById(quizId: string) {
    try {
      const quiz = await this.quizModel
        .findById(quizId)
        // Excluding password and quizzes(for now)
        .populate('createdBy', '-password -quizzes');

      if (!quiz) throw new NotFoundException('Quiz was not found');

      return sendResponse(
        HttpStatus.OK,
        'Quiz details fetched successfully.',
        quiz,
      );
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

      return sendResponse(HttpStatus.OK, 'Quiz updated successfully.', result);
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

      // Remove associated questions
      await this.questionModel.deleteMany({
        quiz: Types.ObjectId.createFromHexString(quizId),
      });

      // Remove quiz from db
      await this.quizModel.findByIdAndRemove(quizId);

      // Find creator and update quizzes array
      await this.userModel.findByIdAndUpdate(userId, {
        $pull: { quizzes: quizId },
      });

      return sendResponse(HttpStatus.OK, 'Quiz deleted successfully.');
    } catch (error) {
      throw error;
    }
  }

  async closeQuiz(quizId: string, userId: string) {
    try {
      // Find quiz
      const quiz = await this.quizModel.findById(quizId);

      if (!quiz) throw new NotFoundException('Quiz not found');

      if (quiz.status === 'closed')
        throw new BadRequestException('Quiz has already been closed.');

      // Doesnt permit closing quiz if not creator
      if (quiz.createdBy.toString() !== userId)
        throw new ForbiddenException('Not authorized.');

      // Update quiz status
      quiz.status = 'closed';
      await quiz.save();

      return sendResponse(HttpStatus.OK, 'Quiz closed successfully.');
    } catch (error) {
      throw error;
    }
  }

  // todo: will be worked on after working on participant and question models
  async attemptQuiz(quizId: string, userId: string) {
    return 'todo for now';
  }

  // todoL will be worked on after working on participant model
  async getQuizParticipants(quizId: string, userId: string) {
    return 'todo for now';
  }
}
