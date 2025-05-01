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

export class AppointmentRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsNotEmpty()
  appointment_date: string; // ISO format yyyy-MM-dd

  @IsString()
  @IsNotEmpty()
  time: string; // HH:mm

  @IsEnum(AppointmentTypeEnum)
  @IsNotEmpty()
  type: AppointmentTypeEnum;

  @IsString()
  @IsNotEmpty()
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
  @IsNotEmpty()
  paymentMethod: OrderPaymentMethodEnum;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsNumber()
  @IsNotEmpty()
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
}
