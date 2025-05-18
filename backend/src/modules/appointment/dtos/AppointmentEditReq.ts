import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  AppointmentStatus,
  AppointmentTypeEnum,
  OrderPaymentMethodEnum,
} from '../../../common/enums';
import { Transform, Type } from 'class-transformer';
import { AppointmentDetailRequest } from './AppointmentDetailRequest.dto';

export class PredictedDisease {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  percent: number;
}

export class AppointmentEditRequest {
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsDateString()
  @IsOptional()
  appointment_date: string; // ISO format yyyy-MM-dd

  @IsString()
  @IsOptional()
  time: string; // HH:mm

  @IsEnum(AppointmentTypeEnum)
  @IsOptional()
  type: AppointmentTypeEnum;

  @IsString()
  @IsOptional()
  symptoms: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PredictedDisease)
  predicted_disease: PredictedDisease[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AppointmentDetailRequest)
  appointment_detail: AppointmentDetailRequest[];

  @IsEnum(OrderPaymentMethodEnum)
  @IsOptional()
  paymentMethod: OrderPaymentMethodEnum;

  @IsString()
  @IsOptional()
  createdBy: string;

  @IsNumber()
  @IsOptional()
  totalPrice: number;

  @IsString()
  @IsOptional()
  rootRedirectUrl?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? value : false))
  isPaid?: boolean = false;

  @IsString()
  @IsOptional()
  paymentCode?: string;

  @IsString()
  @IsOptional()
  re_exam_id: string;

  @IsString()
  @IsOptional()
  reasonCancel: string;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status: AppointmentStatus = AppointmentStatus.WAIT;
}
