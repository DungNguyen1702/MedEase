import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AppointmentDetail,
  AppointmentDetailDocument,
  type Account,
} from '../../schemas';

@Injectable()
export class AppointmentDetailService {
  constructor(
    @InjectModel(AppointmentDetail.name)
    private readonly appointmentDetailModel: Model<AppointmentDetailDocument>
  ) {}

  async findDetailsByDate(date: string, account: Account) {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setDate(endOfDay.getDate() + 1);

    return this.appointmentDetailModel.aggregate([
      {
        $lookup: {
          from: 'appointments',
          localField: 'appointment_id',
          foreignField: '_id',
          as: 'appointment',
        },
      },
      {
        $addFields: {
          appointment: { $arrayElemAt: ['$appointment', 0] },
        },
      },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctor_id',
          foreignField: '_id',
          as: 'doctor',
          pipeline: [
            {
              $lookup: {
                from: 'accounts',
                localField: 'account_id',
                foreignField: '_id',
                as: 'account',
              },
            },
            {
              $addFields: {
                account: { $arrayElemAt: ['$account', 0] },
              },
            },
            {
              $project: {
                'account.password': 0,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          doctor: { $arrayElemAt: ['$doctor', 0] },
        },
      },
      {
        $lookup: {
          from: 'specializations',
          localField: 'specialization_id',
          foreignField: '_id',
          as: 'specialization',
        },
      },
      {
        $addFields: {
          specialization: { $arrayElemAt: ['$specialization', 0] },
        },
      },
      {
        $match: {
          'appointment.appointment_date': {
            $gte: startOfDay,
            $lt: endOfDay,
          },
          'appointment.patient_id': account._id,
        },
      },
    ]);
  }

  async findAll() {
    return this.appointmentDetailModel
      .find()
      .populate('appointment_id')
      .populate('doctor_id')
      .populate('specialization_id')
      .exec();
  }
}
