import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Account,
  AccountSchema,
  AppointmentDetail,
  AppointmentDetailSchema,
  Doctor,
  DoctorSchema,
} from '../../schemas';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AccountService } from '../account/account.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Doctor.name, schema: DoctorSchema },
      { name: AppointmentDetail.name, schema: AppointmentDetailSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
  ],
  providers: [DoctorService, AuthGuard, AccountService],
  controllers: [DoctorController],
})
export class DoctorModule {}
