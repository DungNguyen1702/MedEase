import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppointmentDetail, AppointmentDetailDocument } from '../../schemas';

@Injectable()
export class AppointmentDetailService {
  constructor(
    @InjectModel(AppointmentDetail.name)
    private readonly appointmentDetailModel: Model<AppointmentDetailDocument>
  ) {}

  async findDetailsByDate(date: string) {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setDate(endOfDay.getDate() + 1);

    return this.appointmentDetailModel
      .find()
      .populate({
        path: 'appointment_id',
        match: {
          appointment_date: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        },
        // 'appointment_id'
      })
      .populate('doctor_id')
      .populate('specialization_id')
      .then(results => results.filter(detail => detail.appointment_id)); // lọc bỏ những cái không match ngày
  }

  async findAll() {
    return this.appointmentDetailModel
      .find()
      .populate('appointment_id') // Populate thông tin cuộc hẹn
      .populate('doctor_id') // Populate thông tin bác sĩ
      .populate('specialization_id') // Populate thông tin chuyên khoa
      .exec(); // Thực thi truy vấn
  }
}
