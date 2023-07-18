import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AttemptQuizDto, CreateQuizDto, UpdateQuizDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz } from './schema/quiz.model';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/schema/user.model';
import { sendResponse } from 'src/utils/send-response';
import { Question } from 'src/question/schema/question.model';
import { Participant } from 'src/participant/schema/participant.model';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
    @InjectModel(Participant.name) private participantModel: Model<Participant>,
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

      // Get quiz participants
      const quizParticipants = await this.participantModel.find({
        quiz: Types.ObjectId.createFromHexString(quizId),
      });

      const participantIds = quizParticipants.map((p) => p._id);

      // remove quiz from users participatedIn field
      await this.userModel.updateMany(
        { participatedIn: { $in: participantIds } },
        { $pull: { participatedIn: { $in: participantIds } } },
      );
      // Find creator and update quizzes
      await this.userModel.findByIdAndUpdate(userId, {
        $pull: { quizzes: quizId },
      });

      // Remove quiz participants
      await this.participantModel.deleteMany({
        quiz: Types.ObjectId.createFromHexString(quizId),
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

  async attemptQuiz(quizId: string, userId: string, dto: AttemptQuizDto) {
    const { answers: userAnswers } = dto;
    try {
      // Find quiz
      const quiz = await this.quizModel.findById(quizId);

      // Check if its open
      if (quiz.status !== 'open')
        return sendResponse(HttpStatus.BAD_REQUEST, 'Quiz is currently closed');

      // Find questions
      const questions = await this.questionModel.find({
        quiz: Types.ObjectId.createFromHexString(quizId),
      });

      // Check if quiz has at least 1 question
      if (!questions.length)
        return sendResponse(
          HttpStatus.BAD_REQUEST,
          'No questions found in quiz',
        );

      // Check if user has attempted it before
      const existingParticipant = await this.participantModel.findOne({
        quiz: Types.ObjectId.createFromHexString(quizId),
        user: Types.ObjectId.createFromHexString(userId),
      });

      if (existingParticipant)
        return sendResponse(
          HttpStatus.BAD_REQUEST,
          'User has already attempted the quiz.',
        );

      // Calculate total available scores
      const totalMarks = questions.reduce(
        (total, question) => total + question.marks,
        0,
      );

      // Calculate score for user attempt
      let score = 0;
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const userAnswer = userAnswers[i] as string;

        // Compare user answers to db answer and add to score
        if (
          question.options.includes(userAnswer) &&
          question.answer == userAnswer
        ) {
          score += question.marks;
        }
      }

      // Calculate the percentage score
      const percentageScore = (score / totalMarks) * 100;

      // create participation
      const participant = new this.participantModel({
        quiz: Types.ObjectId.createFromHexString(quizId),
        user: Types.ObjectId.createFromHexString(userId),
        score: percentageScore,
      });

      const result = await participant.save();

      // add to participatedIn on user model
      await this.userModel.findByIdAndUpdate(userId, {
        $push: { participatedIn: result._id },
      });

      // add to participants in quiz model
      await this.quizModel.findByIdAndUpdate(quizId, {
        $push: { participants: result._id },
      });

      // return response
      return sendResponse(HttpStatus.OK, 'Quiz attempted successfully', {
        score: `${result.score}%`,
      });
    } catch (error) {
      throw error;
    }
  }

  async getQuizParticipants(quizId: string) {
    try {
      const participants = await this.participantModel
        .find({
          quiz: Types.ObjectId.createFromHexString(quizId),
        })
        .populate('user', '-password -quizzes -participatedIn');

      // If the array is empty
      if (!participants.length)
        throw new NotFoundException('Quiz participants not found.');

      return sendResponse(
        HttpStatus.OK,
        'Quiz participants fetched successfully',
        participants,
      );
    } catch (error) {
      throw error;
    }
  }

  async getLeaderboard(quizId: string) {
    try {
      const participants = await this.participantModel
        .find({
          quiz: Types.ObjectId.createFromHexString(quizId),
        })
        .populate('user', '-password -quizzes -participatedIn')
        .sort({ score: -1 });

      // If the array is empty
      if (!participants.length)
        throw new NotFoundException('No participants not found.');

      const leaderboard = participants?.map((p, index) => ({
        name: `${p.user?.firstname + ' ' + p.user?.lastname || 'None'}`,
        score: `${p.score}%`,
        rank: index + 1,
        email: p.user.email,
      }));

      return sendResponse(
        HttpStatus.OK,
        'Leaderboard fetched successfully',
        leaderboard,
      );
    } catch (error) {
      throw error;
    }
  }
}
