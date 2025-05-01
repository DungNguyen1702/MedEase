import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpecializationDocument } from '../../schemas';

@Injectable()
export class SpecializationService {
  constructor(
    @InjectModel('Specialization')
    private readonly specializationModel: Model<SpecializationDocument>
  ) {}

  async findAll() {
    return this.specializationModel.aggregate([
      {
        $lookup: {
          from: 'doctors',
          localField: '_id',
          foreignField: 'specialization_id',
          as: 'doctors',
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
                account: { $arrayElemAt: ['$account', 0] }, // Lấy phần tử đầu tiên của account
              },
            },
            {
              $project: {
                'account.password': 0, // Ẩn trường password trong tài khoản
              },
            },
          ],
        },
      },
    ]);
  }

  async findById(id: string) {
    console.log(id);
    return this.specializationModel.aggregate([
      {
        $match: { _id: id },
      },
      {
        $lookup: {
          from: 'doctors',
          localField: '_id',
          foreignField: 'specialization_id',
          as: 'doctors',
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
                account: { $arrayElemAt: ['$account', 0] }, // Lấy phần tử đầu tiên của account
              },
            },
            {
              $project: {
                'account.password': 0, // Ẩn trường password trong tài khoản
              },
            },
          ],
        },
      },
    ]);
  }
}
