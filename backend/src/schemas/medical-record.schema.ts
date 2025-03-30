import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MedicalRecordDocument = HydratedDocument<MedicalRecord>;

@Schema({ timestamps: true })
export class MedicalRecord {
  @Prop({ required: true })
  patient_id: string;

  @Prop({ required: true })
  doctor_id: string;

  @Prop()
  symptoms: string;

  @Prop()
  diagnosis: string;

  @Prop({ type: Object })
  prescription: object;

  @Prop()
  note: string;

  @Prop()
  appointment_id: string;
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);
