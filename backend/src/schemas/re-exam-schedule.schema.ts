import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
export type ReExamScheduleDocument = HydratedDocument<ReExamSchedule>;

@Schema({ timestamps: true })
export class ReExamSchedule {
  @Prop({ type: String, required: true, default: uuidv4 })
  _id: string;

  @Prop({
    required: true,
    ref: 'MedicalRecord',
  })
  medical_record_id: string;

  @Prop({ required: true })
  re_exam_date: Date;

  @Prop({ required: true, ref: 'Doctor' })
  doctor_id: string;

  @Prop({
    required: true,
    ref: 'Appointment',
  })
  parent_appointment_id: string;

  @Prop()
  price: number;

  @Prop()
  isPaid: boolean;

  @Prop()
  note: string;

  @Prop({
    ref: 'Appointment',
  })
  appointment_id: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ReExamScheduleSchema =
  SchemaFactory.createForClass(ReExamSchedule);
