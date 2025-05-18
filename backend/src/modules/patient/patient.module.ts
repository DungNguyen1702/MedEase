import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
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
  ReExamSchedule,
  ReExamScheduleSchema,
  Specialization,
  SpecializationSchema,
} from '../../schemas';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AccountService } from '../account/account.service';
import { MedicalRecordService } from '../medical-record/medical-record.service';
import { AppointmentService } from '../appointment/appointment.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: Specialization.name, schema: SpecializationSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: MedicalRecord.name, schema: MedicalRecordSchema },
      { name: ReExamSchedule.name, schema: ReExamScheduleSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: AppointmentDetail.name, schema: AppointmentDetailSchema },
    ]),
  ],
  providers: [
    PatientService,
    AuthGuard,
    AccountService,
    MedicalRecordService,
    AppointmentService,
  ],
  controllers: [PatientController],
})
export class PatientModule {}
