import { Module } from '@nestjs/common';
import { AppointmentDetailController } from './appointment-detail.controller';
import { AppointmentDetailService } from './appointment-detail.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentDetail, AppointmentSchema } from '../../schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AppointmentDetail.name, schema: AppointmentSchema },
    ]),
  ],
  controllers: [AppointmentDetailController],
  providers: [AppointmentDetailService],
})
export class AppointmentDetailModule {}
