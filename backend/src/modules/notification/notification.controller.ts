import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { AccountRoleEnum } from '../../common/enums';
import { CurrentAccount } from '../../common/decorators/current-account.decorator';
import { Account } from '../../schemas';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notiService: NotificationService) {}

  @UseGuards(new RoleGuard([AccountRoleEnum.PATIENT]))
  @UseGuards(AuthGuard)
  @Get()
  async getNotificationByAccountId(@CurrentAccount() currentAccount: Account) {
    return this.notiService.getNotificationByAccountId(currentAccount._id);
  }

  @UseGuards(new RoleGuard([AccountRoleEnum.PATIENT]))
  @UseGuards(AuthGuard)
  @Put('/read/:id')
  async readNotification(
    @CurrentAccount() currentAccount: Account,
    @Param('id') id: string
  ) {
    return this.notiService.readNotification(currentAccount._id, id);
  }
}
