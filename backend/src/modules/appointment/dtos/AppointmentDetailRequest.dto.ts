import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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
  @IsNotEmpty()
  examStatus: ExaminationStatusEnum;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  room: string;
}


