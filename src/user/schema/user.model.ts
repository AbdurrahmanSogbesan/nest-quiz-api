import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Quiz } from 'src/quiz/schema/quiz.model';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Quiz' }] })
  quizzes: Quiz[];
}

export const UserSchema = SchemaFactory.createForClass(User);
