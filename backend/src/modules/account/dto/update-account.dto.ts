import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AccountGenderEnum } from '../../../common/enums';

export class UpdateAccountDto {
  @IsString()
  @IsNotEmpty()
  id: string;
  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  tel?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsEnum(AccountGenderEnum)
  @IsOptional()
  gender?: AccountGenderEnum;

  @IsOptional()
  date_of_birth?: Date;

  @IsString()
  @IsOptional()
  avatar?: string;

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
  role?: string;

  @IsString()
  @IsOptional()
  room?: string;
}
