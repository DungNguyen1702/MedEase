import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DoctorPositionEnum } from '../common/enums';
import { v4 as uuidv4 } from 'uuid';

export type DoctorDocument = HydratedDocument<Doctor>;

@Schema()
export class Doctor {
  @Prop({ required: true, unique: true, default: uuidv4 })
  id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Account' })
  account_id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Specialization' })
  specialization_id: string;

  @Prop({ enum: DoctorPositionEnum, required: true })
  position: DoctorPositionEnum;

  @Prop({ required: true })
  base_time : string;

  @Prop({ required: true })
  room: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
