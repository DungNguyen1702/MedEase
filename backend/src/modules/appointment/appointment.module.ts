import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
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
import { AuthGuard } from '../../common/guards/auth.guard';
import { AccountService } from '../account/account.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationsGateway } from '../notification/notification.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: AppointmentDetail.name, schema: AppointmentDetailSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Specialization.name, schema: SpecializationSchema },
      { name: Account.name, schema: AccountSchema },
      { name: ReExamSchedule.name, schema: ReExamScheduleSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService, AuthGuard, AccountService, NotificationService, NotificationsGateway],
})
export class AppointmentModule {}
