import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {
  AppointmentStatus,
  OrderPaymentMethodEnum,
  AppointmentTypeEnum,
} from '../common/enums';
import { v4 as uuidv4 } from 'uuid';

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ required: true, unique: true, default: uuidv4 })
  id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Account' })
  patient_id: string;

  @Prop()
  title: string;

  @Prop({ enum: AppointmentStatus, required: true })
  status: AppointmentStatus;

  @Prop({ required: true })
  appointment_date: Date;

  @Prop()
  symptoms: string;

  @Prop({ type: Object })
  predicted_disease: { name: string; percent: number };

  @Prop()
  number: number;

  @Prop({ enum: OrderPaymentMethodEnum, required: true })
  paymentMethod: OrderPaymentMethodEnum;

  @Prop()
  reasonCancel: string;

  @Prop()
  isPaid: boolean;

  @Prop()
  price: number;

  @Prop({ enum: AppointmentTypeEnum, required: true })
  type: AppointmentTypeEnum;

  @Prop({ required: true })
  createdBy: string;

  createdAt: Date;
  updatedAt: Date;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
