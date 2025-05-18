import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
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
  Specialization,
  SpecializationSchema,
} from '../../schemas';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AccountService } from '../account/account.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Doctor.name, schema: DoctorSchema },
      { name: AppointmentDetail.name, schema: AppointmentDetailSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Account.name, schema: AccountSchema },
      { name: Specialization.name, schema: SpecializationSchema },
    ]),
  ],
  providers: [DoctorService, AuthGuard, AccountService],
  controllers: [DoctorController],
})
export class DoctorModule {}
