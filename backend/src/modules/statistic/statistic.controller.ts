import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { AccountRoleEnum } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { CurrentAccount } from '../../common/decorators/current-account.decorator';
import { Account } from '../../schemas';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @UseGuards(new RoleGuard([AccountRoleEnum.ADMIN]))
  @UseGuards(AuthGuard)
  @Get('/admin-statistic')
  async getAdminStatistic() {
    return this.statisticService.getAdminStatistic();
  }

  @UseGuards(new RoleGuard([AccountRoleEnum.DOCTOR]))
  @UseGuards(AuthGuard)
  @Get('/doctor-statistic')
  async getDoctorStatistic(@CurrentAccount() currentAccount: Account) {
    return this.statisticService.getDoctorDashboardStatistic(
      currentAccount._id
    );
  }
}
