import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PrescriptionDto {
  @IsString()
  @IsNotEmpty()
  medicine: string;

  @IsString()
  @IsNotEmpty()
  dosage: string;

  @IsString()
  @IsNotEmpty()
  frequency: string;

  @IsString()
  @IsNotEmpty()
  duration: string;
}

class MedicalRecordDto {
  @IsOptional()
  @IsString()
  _id?: string;

  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionDto)
  prescription: PrescriptionDto[];

  @IsString()
  @IsOptional()
  note?: string;
}

class ReExamScheduleDto {
  @IsOptional()
  @IsString()
  _id?: string;

  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @IsString()
  @IsNotEmpty()
  re_exam_date: string;

  @IsString()
  @IsOptional()
  note?: string;
}
export class PredictedDisease {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  percent: number;
}

export class UpdateAppointmentDetailRequest {
  @IsString()
  @IsNotEmpty()
  appointment_id: string;

  @IsString()
  @IsNotEmpty()
  patient_id: string;

  @IsString()
  @IsNotEmpty()
  symptoms: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PredictedDisease)
  predicted_disease?: PredictedDisease[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicalRecordDto)
  medicalrecords: MedicalRecordDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReExamScheduleDto)
  reexamschedules: ReExamScheduleDto[];
}
