import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type AppointmentDetailDocument = HydratedDocument<AppointmentDetail>;

@Schema({ timestamps: true })
export class AppointmentDetail {
  @Prop({ required: true, unique: true, default: uuidv4 })
  id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Appointment'  })
  appointment_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Specialization' })
  specialization_id: string;

  @Prop()
  time: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Doctor'  })
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

export const AppointmentDetailSchema = SchemaFactory.createForClass(AppointmentDetail);
