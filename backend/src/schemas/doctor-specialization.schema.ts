import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DoctorSpecializationDocument =
  HydratedDocument<DoctorSpecialization>;

@Schema()
export class DoctorSpecialization {
  @Prop({ required: true })
  doctor_id: string;

  @Prop({ required: true })
  specialization_id: string;

  @Prop()
  room: string;
}

export const DoctorSpecializationSchema =
  SchemaFactory.createForClass(DoctorSpecialization);
