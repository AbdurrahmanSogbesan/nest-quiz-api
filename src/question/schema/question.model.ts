import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Quiz } from 'src/quiz/schema/quiz.model';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ timestamps: true })
export class Question {
  @Prop({ required: true })
  question: string;

  @Prop({ type: Types.ObjectId, ref: 'Quiz', required: true })
  quiz: Quiz;

  @Prop({ required: true })
  marks: number;

  @Prop({ required: true })
  options: any[];

  @Prop({ required: true, type: {} })
  answer: number | string | boolean;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
