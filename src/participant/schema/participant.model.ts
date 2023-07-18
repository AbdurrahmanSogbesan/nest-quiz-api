import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, now } from 'mongoose';
import { Quiz } from 'src/quiz/schema/quiz.model';
import { User } from 'src/user/schema/user.model';

export type ParticipantDocument = HydratedDocument<Participant>;

@Schema()
export class Participant {
  @Prop({ type: Types.ObjectId, ref: 'Quiz', required: true })
  quiz: Quiz;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ default: now() })
  participationDate: Date;

  @Prop({ required: true })
  score: number;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
