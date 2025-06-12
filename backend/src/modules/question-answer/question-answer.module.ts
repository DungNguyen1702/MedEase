import { Module } from '@nestjs/common';
import { QuestionAnswerController } from './question-answer.controller';
import { QuestionAnswerService } from './question-answer.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Account,
  AccountSchema,
  Answer,
  AnswerSchema,
  Doctor,
  DoctorSchema,
  Notification,
  NotificationSchema,
  Question,
  QuestionSchema,
  Specialization,
  SpecializationSchema,
} from '../../schemas';
import { AccountService } from '../account/account.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ChatbotService } from '../chatbot/chatbot.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationsGateway } from '../notification/notification.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: Answer.name, schema: AnswerSchema },
      { name: Account.name, schema: AccountSchema },
      { name: Specialization.name, schema: SpecializationSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [QuestionAnswerController],
  providers: [QuestionAnswerService, AccountService, AuthGuard, ChatbotService, NotificationService, NotificationsGateway],
})
export class QuestionAnswerModule {}
