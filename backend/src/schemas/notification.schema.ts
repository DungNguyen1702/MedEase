import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { NotificationTypeEnum } from '../common/enums';

export type NotificationsDocument = HydratedDocument<Notifications>;

@Schema({ timestamps: true })
export class Notifications {
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

export const NotificationsSchema = SchemaFactory.createForClass(Notifications);