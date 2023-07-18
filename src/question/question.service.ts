import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './schema/question.model';
import { Model, Types } from 'mongoose';
import { Quiz } from 'src/quiz/schema/quiz.model';
import { CreateQuestionDto, UpdateQuestionDto } from './dto';
import { sendResponse } from 'src/utils/send-response';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
  ) {}

  async createQuestion(quizId: string, dto: CreateQuestionDto, userId: string) {
    try {
      // Find quiz question is being added to
      const quiz = await this.quizModel.findById(quizId);

      if (!quiz) throw new NotFoundException('Quiz not found.');

      // Doesnt permit adding question if not creator
      if (quiz.createdBy.toString() !== userId)
        throw new ForbiddenException('Not authorized.');

      // todo: add duration later
      const newQuestion = new this.questionModel({
        ...dto,
        quiz: Types.ObjectId.createFromHexString(quizId),
      });

      const result = await newQuestion.save();

      // Find quiz and add question to it
      await this.quizModel.findByIdAndUpdate(
        { _id: quizId },
        { $push: { questions: newQuestion._id } },
      );

      return sendResponse(
        HttpStatus.CREATED,
        'Question created successfully',
        result,
      );
    } catch (error) {
      throw error;
    }
  }

  async getQuestions(quizId: string) {
    try {
      const questions = await this.questionModel.find({
        quiz: Types.ObjectId.createFromHexString(quizId),
      });

      if (!questions) throw new NotFoundException('Questions not found.');

      return sendResponse(
        HttpStatus.OK,
        'Questions fetched successfully',
        questions,
      );
    } catch (error) {
      throw error;
    }
  }

  async getQuestion(quizId: string, questionId: string) {
    try {
      const question = await this.questionModel.findOne({
        _id: Types.ObjectId.createFromHexString(questionId),
        quiz: Types.ObjectId.createFromHexString(quizId),
      });

      if (!question) throw new NotFoundException('Question not found.');

      return sendResponse(
        HttpStatus.OK,
        'Question fetched successfully',
        question,
      );
    } catch (error) {
      throw error;
    }
  }

  async updateQuestion(
    quizId: string,
    questionId: string,
    dto: UpdateQuestionDto,
    userId: string,
  ) {
    const { question, answer, marks, options } = dto;
    try {
      // Find question qith quiz data
      const dbQuestion = await this.questionModel
        .findOne({
          _id: Types.ObjectId.createFromHexString(questionId),
          quiz: Types.ObjectId.createFromHexString(quizId),
        })
        .populate('quiz', '-questions');

      if (!dbQuestion) throw new NotFoundException('Question not found.');

      // Doesnt permit updating question if not quiz creator
      if (dbQuestion.quiz.createdBy.toString() !== userId)
        throw new ForbiddenException('Not authorized.');

      // Reassign values
      if (question) dbQuestion.question = question;

      if (answer) dbQuestion.answer = answer;

      if (marks) dbQuestion.marks = marks;

      if (options) dbQuestion.options = options;

      const result = await dbQuestion.save();

      return sendResponse(
        HttpStatus.OK,
        'Question updated successfully',
        result,
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteQuestion(quizId: string, questionId: string, userId: string) {
    try {
      // Find question
      const question = await this.questionModel
        .findOne({
          _id: Types.ObjectId.createFromHexString(questionId),
          quiz: Types.ObjectId.createFromHexString(quizId),
        })
        .populate('quiz');

      if (!question) throw new NotFoundException('Question not found.');

      // Doesnt permit updating question if not quiz creator
      if (question.quiz.createdBy.toString() !== userId)
        throw new ForbiddenException('Not authorized.');

      // Delete question
      await this.questionModel.findByIdAndRemove(questionId);

      // Remove deleted question from quiz
      await this.quizModel.findByIdAndUpdate(quizId, {
        $pull: { questions: questionId },
      });

      return sendResponse(HttpStatus.OK, 'Question deleted successfully');
    } catch (error) {
      throw error;
    }
  }
}
