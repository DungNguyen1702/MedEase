import { AppService } from './../../app.service';
import { Module } from '@nestjs/common';
import { ZaloPaymentService } from './zalo-payment.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AccountService } from '../account/account.service';

import { MomoPaymentController } from './momo-payment.controller';
import { MomoPaymentService } from './momo-payment.service';
import { ZaloPaymentController } from './zalo-payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Account,
  AccountSchema,
  Appointment,
  AppointmentDetail,
  AppointmentDetailSchema,
  AppointmentSchema,
  Doctor,
  DoctorSchema,
  Notification,
  NotificationSchema,
  ReExamSchedule,
  ReExamScheduleSchema,
  Specialization,
  SpecializationSchema,
} from '../../schemas';
import { AppointmentService } from '../appointment/appointment.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationsGateway } from '../notification/notification.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: AppointmentDetail.name, schema: AppointmentDetailSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Account.name, schema: AccountSchema },
      { name: ReExamSchedule.name, schema: ReExamScheduleSchema },
      { name: Specialization.name, schema: SpecializationSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [ZaloPaymentController, MomoPaymentController],
  providers: [
    ZaloPaymentService,
    AuthGuard,
    AccountService,
    AppService,
    MomoPaymentService,
    AppointmentService,
    NotificationService,
    NotificationsGateway,
  ],
  exports: [MomoPaymentService, ZaloPaymentService],
})
export class PaymentModule {}
