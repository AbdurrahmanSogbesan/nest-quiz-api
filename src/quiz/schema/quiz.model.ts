import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Question } from 'src/question/schema/question.model';
import { User } from 'src/user/schema/user.model';

export type QuizDocument = HydratedDocument<Quiz>;

@Schema({ timestamps: true })
export class Quiz {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({ enum: ['open', 'closed'], default: 'open' })
  status: 'open' | 'closed';

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Question' }] })
  questions: Question[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
