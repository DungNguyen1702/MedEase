import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ExaminationStatusEnum } from '../common/enums';
import { v4 as uuidv4 } from 'uuid';

export type AppointmentDetailDocument = HydratedDocument<AppointmentDetail>;

@Schema({ timestamps: true })
export class AppointmentDetail {
  @Prop({ type: String, required: true, default: uuidv4 })
  _id: string;

  @Prop({ required: true, ref: 'Appointment' })
  appointment_id: string;

  @Prop({ ref: 'Specialization' })
  specialization_id: string;

  @Prop({ enum: ExaminationStatusEnum, required: true })
  examStatus: ExaminationStatusEnum;

  @Prop()
  time: string;

  @Prop({ required: true, ref: 'Doctor' })
  doctor_id: string;

  @Prop()
  address: string;

  @Prop()
  price: string;

  @Prop()
  description: string;

  createdAt: Date;
  updatedAt: Date;
}

export const AppointmentDetailSchema =
  SchemaFactory.createForClass(AppointmentDetail);
