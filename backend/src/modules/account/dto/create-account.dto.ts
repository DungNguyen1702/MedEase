import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { AccountRoleEnum } from '../../../common/enums';

export class CreateAccountDto {

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  tel?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsOptional()
  date_of_birth?: Date;

  @IsEnum(AccountRoleEnum)
  @IsOptional()
  role?: AccountRoleEnum = AccountRoleEnum.PATIENT;

  @IsString()
  @IsOptional()
  specializationId?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsOptional()
  base_time?: string;

  @IsString()
  @IsOptional()
  room?: string;
}
