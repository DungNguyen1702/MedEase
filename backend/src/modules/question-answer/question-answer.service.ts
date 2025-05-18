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

@Injectable()
export class QuestionAnswerService {
  constructor(
    @InjectModel('Question')
    private readonly questionModel: Model<QuestionDocument>,
    @InjectModel('Answer')
    private readonly answerModel: Model<AnswerDocument>,
    @InjectModel('Account')
    private readonly accountModel: Model<AccountDocument>,
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

    const answerContent = await this.chatbotService.getMessage(content);

    if (!answerContent) {
      throw new Error('Failed to get answer from chatbot.');
    }
    const answer = await this.answerModel.create({
      account_id: 'robot',
      question_id: newQuestion._id,
      answer: answerContent.message,
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
    return {
      ...newAnswer.toObject(),
      account,
    };
  }
}
