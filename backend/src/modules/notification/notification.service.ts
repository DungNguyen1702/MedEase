import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationDocument } from '../../schemas';
import { NotificationsGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<NotificationDocument>, // Replace 'any' with the actual type of your model
    private readonly notificationsGateway: NotificationsGateway
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
      {
        $sort: { createdAt: -1 }, 
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

  async createNotification(notificationData: any) {
    const newNotification = new this.notificationModel(notificationData);
    const savedNotification = await newNotification.save();

    console.log('saved noti : ', savedNotification);

    // Gửi socket đến user (giả sử account_id là userId)
    const { account_id, title, message } = notificationData;

    console.log(
      `Gửi thông báo đến người dùng ${account_id}: ${title} - ${message}`
    );

    this.notificationsGateway.sendNotificationToUser(account_id, {
      title,
      message,
      data: savedNotification,
    });

    return savedNotification;
  }
}
