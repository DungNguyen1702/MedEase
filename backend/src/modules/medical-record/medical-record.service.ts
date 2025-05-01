import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MedicalRecordDocument } from '../../schemas';

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectModel('MedicalRecord')
    private readonly medicalRecordModel: Model<MedicalRecordDocument>
  ) {}

  async getMedicalRecord(accountId: string) {
    return this.medicalRecordModel.aggregate([
      {
        $match: {
          patient_id: accountId,
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
                localField: 'doctor_id',
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
        $lookup: {
          from: 'appointments',
          localField: 'appointment_id',
          foreignField: '_id',
          as: 'appointment',
          pipeline: [
            {
              $lookup: {
                from: 'reexamschedules',
                localField: '_id',
                foreignField: 'parent_appointment_id',
                as: 're-exam',
                pipeline: [
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
                      ],
                    },
                  },
                  {
                    $addFields: {
                      doctor: { $arrayElemAt: ['$doctor', 0] },
                    },
                  },
                  {
                    $project: {
                      'doctor.account.password': 0,
                    },
                  },
                ],
              },
            },
          ],
        },
      },

      {
        $addFields: {
          doctor: { $arrayElemAt: ['$doctor', 0] },
          appointment: { $arrayElemAt: ['$appointment', 0] },
        },
      },
    ]);
  }

  async getMedicalRecordById(accountId: string, id: string) {
    return this.medicalRecordModel.aggregate([
      {
        $match: {
          _id: id,
          patient_id: accountId,
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
                localField: 'doctor_id',
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
        $lookup: {
          from: 'appointments',
          localField: 'appointment_id',
          foreignField: '_id',
          as: 'appointment',
          pipeline: [
            {
              $lookup: {
                from: 'reexamschedules',
                localField: '_id',
                foreignField: 'parent_appointment_id',
                as: 're-exam',
                pipeline: [
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
                      ],
                    },
                  },
                  {
                    $addFields: {
                      doctor: { $arrayElemAt: ['$doctor', 0] },
                    },
                  },
                ],
              },
            },
          ],
        },
      },

      {
        $addFields: {
          doctor: { $arrayElemAt: ['$doctor', 0] },
          appointment: { $arrayElemAt: ['$appointment', 0] },
        },
      },
    ]);
  }
}
