import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AccountGenderEnum } from '../../../common/enums';

export class UpdateAccountDto {
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

  avatar?: string;
}
