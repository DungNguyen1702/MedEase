import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppointmentDetailDocument, DoctorDocument } from '../../schemas';
import { ExaminationStatusEnum } from '../../common/enums';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel('Doctor')
    private readonly doctorModel: Model<DoctorDocument>,
    @InjectModel('AppointmentDetail')
    private readonly appointmentDetailModel: Model<AppointmentDetailDocument>
  ) {}

  async getCurrentNumber(id: string) {
    const appointmentDetails = await this.appointmentDetailModel.aggregate([
      {
        $match: {
          doctor_id: id,
          examStatus: ExaminationStatusEnum.IN_PROGRESS,
        },
      },
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
    ]);

    return appointmentDetails.length > 0
      ? appointmentDetails[0].appointment.number
      : 0;
  }

  async getDoctorRoom(id: string, date: string) {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setDate(endOfDay.getDate() + 1);

    return this.doctorModel.aggregate([
      {
        $match: { _id: id },
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
          specialization: { $arrayElemAt: ['$specialization', 0] },
        },
      },
      {
        $lookup: {
          from: 'appointmentdetails',
          localField: '_id',
          foreignField: 'doctor_id',
          as: 'appointmentDetails',
          pipeline: [
            {
              $lookup: {
                from: 'appointments',
                localField: 'appointment_id',
                foreignField: '_id',
                as: 'appointment',
                pipeline: [
                  {
                    $lookup: {
                      from: 'accounts',
                      localField: 'patient_id',
                      foreignField: '_id',
                      as: 'patient',
                    },
                  },
                  {
                    $addFields: {
                      patient: { $arrayElemAt: ['$patient', 0] },
                    },
                  },
                  {
                    $project: {
                      'patient.password': 0,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                appointment: { $arrayElemAt: ['$appointment', 0] },
              },
            },
            {
              $match: {
                'appointment.appointment_date': {
                  $gte: startOfDay,
                  $lt: endOfDay,
                },
              },
            },
          ],
        },
      },
    ]);
  }
}
