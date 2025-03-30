import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReExamDocument = HydratedDocument<ReExam>;

@Schema({ timestamps: true })
export class ReExam {
  @Prop({ required: true })
  medical_record_id: string;

  @Prop({ required: true })
  re_exam_date: Date;

  @Prop({ required: true })
  doctor_id: string;

  @Prop({ required: true })
  appointment_id: string;

  @Prop()
  price: number;

  @Prop()
  isPaid: boolean;

  @Prop()
  note: string;
}

export const ReExamSchema = SchemaFactory.createForClass(ReExam);
