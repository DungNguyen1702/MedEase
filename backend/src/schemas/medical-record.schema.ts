import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type MedicalRecordDocument = HydratedDocument<MedicalRecord>;

@Schema({ timestamps: true })
export class MedicalRecord {
  @Prop({ required: true, unique: true, default: uuidv4 })
  id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Account' })
  patient_id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Doctor'  })
  doctor_id: string;

  @Prop()
  symptoms: string;

  @Prop()
  diagnosis: string;

  @Prop({ type: Object })
  prescription: object;

  @Prop()
  note: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' })
  appointment_id: string;
  
  createdAt?: Date;
  updatedAt?: Date;
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);
