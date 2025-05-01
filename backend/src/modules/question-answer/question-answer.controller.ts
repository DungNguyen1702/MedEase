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
  @Get()
  async getAllQuestion(@CurrentAccount() currentAccount: Account) {
    return this.questionAnswerService.getAllQuestion(currentAccount._id);
  }

  @UseGuards(new RoleGuard([AccountRoleEnum.PATIENT]))
  @UseGuards(AuthGuard)
  @Post()
  async createQuestion(
    @CurrentAccount() currentAccount: Account,
    @Body() body: { content: string }
  ) {
    return this.questionAnswerService.createQuestion(
      currentAccount,
      body.content
    );
  }
}
