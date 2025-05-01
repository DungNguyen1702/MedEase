import { Module } from '@nestjs/common';
import { QuestionAnswerController } from './question-answer.controller';
import { QuestionAnswerService } from './question-answer.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Account,
  AccountSchema,
  Answer,
  AnswerSchema,
  Question,
  QuestionSchema,
} from '../../schemas';
import { AccountService } from '../account/account.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: Answer.name, schema: AnswerSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
  ],
  controllers: [QuestionAnswerController],
  providers: [QuestionAnswerService, AccountService, AuthGuard],
})
export class QuestionAnswerModule {}
