import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema({ timestamps: true })
export class Answer extends Document {
  @Prop({ required: true })
  question_id: string;

  @Prop()
  answer: string;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);