import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { NotificationTypeEnum } from '../common/enums';
import { v4 as uuidv4 } from 'uuid';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, unique: true, default: uuidv4 })
  id: string;

  @Prop()
  title: string;

  @Prop()
  status: boolean;

  @Prop()
  image: string;

  @Prop({ required: true })
  account_id: string;

  @Prop()
  content: string;

  @Prop({ enum: NotificationTypeEnum, required: true })
  type: NotificationTypeEnum;

  @Prop()
  idTO: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);