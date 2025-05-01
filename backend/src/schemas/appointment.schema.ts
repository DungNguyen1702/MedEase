import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  AppointmentStatus,
  OrderPaymentMethodEnum,
  AppointmentTypeEnum,
} from '../common/enums';
import { v4 as uuidv4 } from 'uuid';

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: String, required: true, default: uuidv4 })
  _id: string;

  @Prop({
    required: true,
    ref: 'Account',
  })
  patient_id: string;

  @Prop()
  title: string;

  @Prop({ enum: AppointmentStatus, required: true })
  status: AppointmentStatus;

  @Prop({ required: true })
  appointment_date: Date;

  @Prop()
  symptoms: string;

  @Prop({ type: [{ name: String, percent: Number }], default: [] })
  predicted_disease: object;

  @Prop()
  number: number;

  @Prop({ enum: OrderPaymentMethodEnum, required: true })
  paymentMethod: OrderPaymentMethodEnum;

  @Prop()
  paymentCode: string;

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
