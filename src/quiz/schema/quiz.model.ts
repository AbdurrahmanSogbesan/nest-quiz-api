import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, now } from 'mongoose';
import { User } from 'src/user/schema/user.model';

export type QuizDocument = HydratedDocument<Quiz>;

@Schema()
export class Quiz {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({ enum: ['open', 'closed'], default: 'open' })
  status: 'open' | 'closed';

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;

  @Prop({ default: null, type: Date })
  deletedAt: Date | null;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
