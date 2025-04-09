import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
export type ReExamScheduleDocument = HydratedDocument<ReExamSchedule>;

@Schema({ timestamps: true })
export class ReExamSchedule {
  @Prop({ required: true, unique: true, default: uuidv4 })
  id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'MedicalRecord'  })
  medical_record_id: string;

  @Prop({ required: true })
  re_exam_date: Date;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Doctor'  })
  doctor_id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Appointment'  })
  appointment_id: string;

  @Prop()
  price: number;

  @Prop()
  isPaid: boolean;

  @Prop()
  note: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ReExamScheduleSchema = SchemaFactory.createForClass(ReExamSchedule);
