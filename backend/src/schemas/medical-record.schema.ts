import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type MedicalRecordDocument = HydratedDocument<MedicalRecord>;

@Schema({ timestamps: true })
export class MedicalRecord {
  @Prop({ required: true, unique: true, default: uuidv4 })
  id: string;

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
