import { ChatbotService } from './../chatbot/chatbot.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  QuestionDocument,
  Account,
  AnswerDocument,
  AccountDocument,
} from '../../schemas';
import {
  NotificationTypeEnum,
  NotificationTypeImageEnum,
} from '../../common/enums';
import {} from '../../schemas/notification.schema';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class QuestionAnswerService {
  constructor(
    @InjectModel('Question')
    private readonly questionModel: Model<QuestionDocument>,
    @InjectModel('Answer')
    private readonly answerModel: Model<AnswerDocument>,
    @InjectModel('Account')
    private readonly accountModel: Model<AccountDocument>,
    private readonly notificationService: NotificationService,
    private readonly chatbotService: ChatbotService
  ) {}

  private accountRobot = {
    _id: '20000000-0000-0000-0000-000000000001',
    email: 'robot@medease.com',
    password: '12345678',
    name: 'ChatBox',
    role: 'chatbot',
    avatar:
      'https://res.cloudinary.com/deei5izfg/image/upload/v1745127486/MedEase/Avatar/chat-box-avatar_anp2ee.png',
    gender: 'male',
  };

  async getAllQuestion() {
    const foundQuestion = await this.questionModel.aggregate([
      {
        $lookup: {
          from: 'answers',
          localField: '_id',
          foreignField: 'question_id',
          as: 'answers',
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
      {
        $sort: { createdAt: -1 },
      },
    ]);
    return foundQuestion.map((question: any) => {
      return {
        ...question,
        answers: question.answers.map((answer: any) => {
          if (answer.account_id === 'robot')
            return {
              ...answer,
              account: this.accountRobot,
            };
          return answer;
        }),
      };
    });
  }

  async getAllQuestionByPatient(accountId: string) {
    const foundQuestion = await this.questionModel.aggregate([
      {
        $lookup: {
          from: 'answers',
          localField: '_id',
          foreignField: 'question_id',
          as: 'answers',
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
      {
        $match: { account_id: accountId },
      },
    ]);
    return foundQuestion.map((question: any) => {
      return {
        ...question,
        answers: question.answers.map((answer: any) => {
          if (answer.account_id === 'robot')
            return {
              ...answer,
              account: this.accountRobot,
            };
          return answer;
        }),
      };
    });
  }

  async createQuestion(account: Account, content: string): Promise<any> {
    const newQuestion = await this.questionModel.create({
      account_id: account._id,
      content,
    });

    const answerContent = await this.chatbotService.answer(
      content,
      newQuestion._id
    );

    if (!answerContent) {
      throw new Error('Failed to get answer from chatbot.');
    }
    const answer = await this.answerModel.create({
      account_id: 'robot',
      question_id: newQuestion._id,
      answer: answerContent.geminiAnswer,
    });

    console.log('Answer created:', answer);

    return {
      ...newQuestion.toObject(),
      answers: [
        {
          ...answer.toObject(),
          account: this.accountRobot,
        },
      ],
      account: account,
    };
  }

  async createAnswer(account_id: string, questionId: string, content: string) {
    const newAnswer = await this.answerModel.create({
      account_id: account_id,
      question_id: questionId,
      answer: content,
    });
    const account = await this.accountModel
      .findById(account_id)
      .select('-password')
      .lean();

    // Lấy thông tin câu hỏi để biết ai là người hỏi
    const question = await this.questionModel.findById(questionId);
    if (question && question.account_id && question.account_id !== account_id) {
      // Tạo notification cho người hỏi
      await this.notificationService.createNotification({
        title: 'Câu hỏi của bạn đã được trả lời',
        status: false,
        image: NotificationTypeImageEnum.question_answered,
        account_id: question.account_id,
        content: 'Câu hỏi của bạn vừa nhận được câu trả lời mới.',
        type: NotificationTypeEnum.QUESTION_ANSWERED,
        idTO: questionId,
      });
    }

    if (question) {
      if (question._id) {
        await this.chatbotService.updateAnswerInSheet(question._id, content);
      }
    }

    return {
      ...newAnswer.toObject(),
      account,
    };
  }
}
