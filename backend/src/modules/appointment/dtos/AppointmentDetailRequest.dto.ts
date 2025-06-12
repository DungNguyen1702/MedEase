import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ExaminationStatusEnum } from '../../../common/enums';

export class AppointmentDetailRequest {
  @IsString()
  @IsNotEmpty()
  specialization_id: string;

  @IsString()
  @IsNotEmpty()
  doctor_id: string;

  @IsNumber({}, { each: false })
  @IsNotEmpty()
  price: number;

  @IsEnum(ExaminationStatusEnum)
  @IsOptional()
  examStatus: ExaminationStatusEnum;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  time: string;

  @IsString()
  @IsOptional()
  room: string;
}


