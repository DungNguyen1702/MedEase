import { Module } from '@nestjs/common';
import { MedicalRecordController } from './medical-record.controller';
import { MedicalRecordService } from './medical-record.service';

import { MongooseModule } from '@nestjs/mongoose';
import {
  Account,
  AccountSchema,
  MedicalRecord,
  MedicalRecordSchema,
} from '../../schemas';
import { AccountService } from '../account/account.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicalRecord.name, schema: MedicalRecordSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
  ],
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService, AccountService, AuthGuard],
})
export class MedicalRecordModule {}
