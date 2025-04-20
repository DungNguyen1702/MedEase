import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type MedicalRecordDocument = HydratedDocument<MedicalRecord>;

@Schema({ timestamps: true })
export class MedicalRecord {
  @Prop({ type: String, required: true, default: uuidv4 })
  _id: string;

  @Prop({
    required: true,
    ref: 'Account',
  })
  patient_id: string;

  @Prop({ required: true, ref: 'Doctor' })
  doctor_id: string;

  @Prop()
  symptoms: string;

  @Prop()
  diagnosis: string;

  @Prop({
    type: [
      { medicine: String, dosage: String, frequency: String, duration: String },
    ],
    default: [],
  })
  prescription: object;

  @Prop()
  note: string;

  @Prop({ ref: 'Appointment' })
  appointment_id: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);
