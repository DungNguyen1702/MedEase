import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountDocument, Account } from '../../schemas';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel('Account')
    private readonly accountModel: Model<AccountDocument> // Replace 'any' with the actual type of your model
  ) {}

  async getAllPatient() {
    return this.accountModel.find({ role: 'patient' }).exec();
  }

  async getExaminedPatients(currentAccount: Account) {
    return this.accountModel.aggregate([
      {
        $match: { role: 'patient' }, // Chỉ lấy các tài khoản có vai trò là bệnh nhân
      },
      {
        $lookup: {
          from: 'appointments',
          localField: '_id',
          foreignField: 'patient_id',
          as: 'appointments',
        },
      },
      {
        $lookup: {
          from: 'appointmentdetails',
          localField: 'appointments._id',
          foreignField: 'appointment_id',
          as: 'appointmentDetails',
        },
      },
      {
        $addFields: {
          examined: {
            $anyElementTrue: {
              $map: {
                input: '$appointmentDetails',
                as: 'detail',
                in: {
                  $and: [
                    { $eq: ['$$detail.doctor_id', currentAccount._id] }, // Kiểm tra nếu doctor_id trùng với bác sĩ hiện tại
                    { $eq: ['$$detail.examStatus', 'examined'] }, // Kiểm tra trạng thái đã khám
                  ],
                },
              },
            },
          },
        },
      },
      {
        $match: { examined: true }, // Chỉ lấy các bệnh nhân đã được khám bởi bác sĩ hiện tại
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          tel: 1,
          address: 1,
          gender: 1,
          date_of_birth: 1,
          avatar: 1,
          examined: 1, // Bao gồm thông tin đã khám
        },
      },
    ]);
  }
}
