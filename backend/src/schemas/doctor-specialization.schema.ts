import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type DoctorSpecializationDocument =
  HydratedDocument<DoctorSpecialization>;

@Schema()
export class DoctorSpecialization {
  @Prop({ required: true, unique: true, default: uuidv4 })
  id: string;

  @Prop({ required: true })
  doctor_id: string;

  @Prop({ required: true })
  specialization_id: string;

  @Prop()
  room: string;
}

export const DoctorSpecializationSchema =
  SchemaFactory.createForClass(DoctorSpecialization);
