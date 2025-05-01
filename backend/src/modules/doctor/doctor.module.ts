import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AppointmentDetail,
  AppointmentDetailSchema,
  Doctor,
  DoctorSchema,
} from '../../schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Doctor.name, schema: DoctorSchema },
      { name: AppointmentDetail.name, schema: AppointmentDetailSchema },
    ]),
  ],
  providers: [DoctorService],
  controllers: [DoctorController],
})
export class DoctorModule {}
