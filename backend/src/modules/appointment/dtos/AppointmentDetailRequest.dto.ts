import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
}
