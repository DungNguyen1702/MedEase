import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AccountRoleEnum, AccountGenderEnum } from '../common/enums';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_AVA } from '../common/constants';
export type AccountDocument = HydratedDocument<Account>;

@Schema({ timestamps: true })
export class Account {
  @Prop({ type: String, required: true, default: uuidv4 })
  _id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  tel?: string;

  @Prop()
  address?: string;

  @Prop({
    type: String,
    default: DEFAULT_AVA,
  })
  avatar: string;

  @Prop({
    type: String,
    enum: AccountGenderEnum,
    default: AccountGenderEnum.MALE,
  })
  gender?: AccountGenderEnum;

  @Prop()
  date_of_birth?: Date;

  @Prop({
    type: String,
    enum: AccountRoleEnum,
    default: AccountRoleEnum.PATIENT,
  })
  role: AccountRoleEnum;

  createdAt?: Date;

  updatedAt?: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
