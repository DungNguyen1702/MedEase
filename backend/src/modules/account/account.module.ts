import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Account, AccountSchema } from '../../schemas/account.schema';
import { AuthGuard } from '../../common/guards/auth.guard';
import { UploadService } from '../upload/upload.service';
import {
  Doctor,
  DoctorSchema,
  Specialization,
  SpecializationSchema,
} from '../../schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Specialization.name, schema: SpecializationSchema },
    ]),
  ],
  controllers: [AccountController],
  providers: [AccountService, AuthGuard, UploadService],
  exports: [AccountService],
})
export class AccountModule {}
