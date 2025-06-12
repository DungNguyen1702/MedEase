import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { QuestionAnswerService } from './question-answer.service';
import { RoleGuard } from '../../common/guards/role.guard';
import { AccountRoleEnum } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentAccount } from '../../common/decorators/current-account.decorator';
import { Account } from '../../schemas';

@Controller('question-answer')
export class QuestionAnswerController {
  constructor(private readonly questionAnswerService: QuestionAnswerService) {}

  @UseGuards(new RoleGuard([AccountRoleEnum.PATIENT]))
  @UseGuards(AuthGuard)
  @Get('/patient')
  async getAllQuestionByPatient(@CurrentAccount() currentAccount: Account) {
    return this.questionAnswerService.getAllQuestionByPatient(
      currentAccount._id
    );
  }

  @UseGuards(new RoleGuard([AccountRoleEnum.PATIENT]))
  @UseGuards(AuthGuard)
  @Post()
  async createQuestion(
    @CurrentAccount() currentAccount: Account,
    @Body() body: { content: string }
  ) {
    console.log('currentAccount', currentAccount);
    return this.questionAnswerService.createQuestion(
      currentAccount,
      body.content
    );
  }

  @Get('')
  async getAllQuestion() {
    return this.questionAnswerService.getAllQuestion();
  }
  @UseGuards(new RoleGuard([AccountRoleEnum.DOCTOR, AccountRoleEnum.ADMIN]))
  @UseGuards(AuthGuard)
  @Post('/create-answer')
  async createAnswer(
    @CurrentAccount() currentAccount: Account,
    @Body() body: { questionId: string; content: string }
  ) {
    return this.questionAnswerService.createAnswer(
      currentAccount._id,
      body.questionId,
      body.content
    );
  }
}
