import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

import { MongooseModule } from '@nestjs/mongoose';
import {
  Account,
  AccountSchema,
  Doctor,
  DoctorSchema,
  Notification,
  NotificationSchema,
  Specialization,
  SpecializationSchema,
} from '../../schemas';
import { AccountService } from '../account/account.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { NotificationsGateway } from './notification.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: Account.name, schema: AccountSchema },
      { name: Specialization.name, schema: SpecializationSchema },
      { name: Doctor.name, schema: DoctorSchema },
    ]),
  ],
  providers: [
    NotificationService,
    AccountService,
    AuthGuard,
    NotificationsGateway,
  ],
  controllers: [NotificationController],
})
export class NotificationModule {}
