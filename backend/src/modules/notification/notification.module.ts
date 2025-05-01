import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

import { MongooseModule } from '@nestjs/mongoose';
import {
  Account,
  AccountSchema,
  Notification,
  NotificationSchema,
} from '../../schemas';
import { AccountService } from '../account/account.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: Account.name, schema: AccountSchema }, // Assuming you have an Account schema
    ]),
  ],
  providers: [NotificationService, AccountService, AuthGuard],
  controllers: [NotificationController],
})
export class NotificationModule {}
