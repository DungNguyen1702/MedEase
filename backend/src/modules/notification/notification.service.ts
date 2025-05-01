import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationDocument } from '../../schemas';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<NotificationDocument> // Replace 'any' with the actual type of your model
  ) {}

  async getNotificationByAccountId(id: string) {
    return this.notificationModel.aggregate([
      {
        $match: { account_id: id },
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
        },
      },
    ]);
  }

  async readNotification(accountId: string, notificationId: string) {
    if (!accountId || !notificationId) {
      throw new Error('Account ID and Notification ID được yêu cầu');
    }

    const notification = await this.notificationModel.findOne({
      _id: notificationId,
      account_id: accountId,
    });
    if (!notification) {
      throw new Error('Không tìm thấy thông báo hoặc không có quyền truy cập');
    }

    return this.notificationModel.findOneAndUpdate(
      { _id: notificationId, account_id: accountId },
      { status: true },
      { new: true }
    );
  }
}
