import { Module } from '@nestjs/common';
import { MedicalRecordController } from './medical-record.controller';
import { MedicalRecordService } from './medical-record.service';

import { MongooseModule } from '@nestjs/mongoose';
import {
  Account,
  AccountSchema,
  Doctor,
  DoctorSchema,
  MedicalRecord,
  MedicalRecordSchema,
  Specialization,
  SpecializationSchema,
} from '../../schemas';
import { AccountService } from '../account/account.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicalRecord.name, schema: MedicalRecordSchema },
      { name: Account.name, schema: AccountSchema },
      { name: Specialization.name, schema: SpecializationSchema },
      { name: Doctor.name, schema: DoctorSchema },
    ]),
  ],
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService, AccountService, AuthGuard],
})
export class MedicalRecordModule {}
