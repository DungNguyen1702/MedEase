import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { NotificationTypeEnum } from '../common/enums';
import { v4 as uuidv4 } from 'uuid';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: String, required: true, default: uuidv4 })
  _id: string;

  @Prop()
  title: string;

  @Prop()
  status: boolean;

  @Prop()
  image: string;

  @Prop({ required: true, ref: 'Account' })
  account_id: string;

  @Prop()
  content: string;

  @Prop({ enum: NotificationTypeEnum, required: true })
  type: NotificationTypeEnum;

  @Prop()
  idTO: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
