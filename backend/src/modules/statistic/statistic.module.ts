import { Module } from '@nestjs/common';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import {
  AccountSchema,
  AnswerSchema,
  AppointmentDetailSchema,
  AppointmentSchema,
  DoctorSchema,
  QuestionSchema,
  SpecializationSchema,
} from '../../schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AccountService } from '../account/account.service';
import { QuestionAnswerService } from '../question-answer/question-answer.service';
import { ChatbotService } from '../chatbot/chatbot.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Account', schema: AccountSchema },
      { name: 'Appointment', schema: AppointmentSchema },
      { name: 'AppointmentDetail', schema: AppointmentDetailSchema },
      { name: 'Doctor', schema: DoctorSchema },
      { name: 'Specialization', schema: SpecializationSchema },
      { name: 'Question', schema: QuestionSchema },
      { name: 'Answer', schema: AnswerSchema },
    ]),
  ],
  controllers: [StatisticController],
  providers: [
    StatisticService,
    AuthGuard,
    AccountService,
    QuestionAnswerService,
    ChatbotService,
  ],
})
export class StatisticModule {}
