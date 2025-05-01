import { Module } from '@nestjs/common';
import { AppointmentDetailController } from './appointment-detail.controller';
import { AppointmentDetailService } from './appointment-detail.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Account,
  AccountSchema,
  AppointmentDetail,
  AppointmentSchema,
} from '../../schemas';
import { AccountService } from '../account/account.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AppointmentDetail.name, schema: AppointmentSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
  ],
  controllers: [AppointmentDetailController],
  providers: [AppointmentDetailService, AccountService, AuthGuard],
})
export class AppointmentDetailModule {}
