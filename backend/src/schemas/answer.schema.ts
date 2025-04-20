import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema({ timestamps: true })
export class Answer {
  @Prop({ type:String, required: true, default: uuidv4 })
  _id: string;

  @Prop({ required: true, ref: 'Question'  })
  question_id: string;

  @Prop()
  answer: string;

  @Prop({ required: true })
  accountId: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);