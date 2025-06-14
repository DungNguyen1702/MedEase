import { Module } from '@nestjs/common';
import { AppointmentDetailController } from './appointment-detail.controller';
import { AppointmentDetailService } from './appointment-detail.service';
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
  MedicalRecord,
  MedicalRecordSchema,
  Notification,
  NotificationSchema,
  ReExamSchedule,
  ReExamScheduleSchema,
  Specialization,
  SpecializationSchema,
} from '../../schemas';
import { AccountService } from '../account/account.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { NotificationService } from '../notification/notification.service';
import { NotificationsGateway } from '../notification/notification.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: AppointmentDetail.name, schema: AppointmentDetailSchema },
      { name: Account.name, schema: AccountSchema },
      { name: Specialization.name, schema: SpecializationSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: MedicalRecord.name, schema: MedicalRecordSchema },
      { name: ReExamSchedule.name, schema: ReExamScheduleSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [AppointmentDetailController],
  providers: [AppointmentDetailService, AccountService, AuthGuard, NotificationService, NotificationsGateway],
})
export class AppointmentDetailModule {}
