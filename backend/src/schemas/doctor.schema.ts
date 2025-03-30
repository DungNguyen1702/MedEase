import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DoctorPositionEnum } from '../common/enums';

export type DoctorDocument = HydratedDocument<Doctor>;

@Schema()
export class Doctor {
  @Prop({ required: true })
  account_id: string;

  @Prop({ required: true })
  specialization_id: string;

  @Prop({ enum: DoctorPositionEnum, required: true })
  position: DoctorPositionEnum;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
