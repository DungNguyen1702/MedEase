import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AppointmentDetailService } from './appointment-detail.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { AccountRoleEnum } from '../../common/enums';
import { CurrentAccount } from '../../common/decorators/current-account.decorator';
import type { Account } from '../../schemas';

@Controller('appointment-detail')
export class AppointmentDetailController {
  constructor(
    private readonly appointmentDetailService: AppointmentDetailService
  ) {}

  @Get('/details-by-date')
  @UseGuards(new RoleGuard([AccountRoleEnum.PATIENT]))
  @UseGuards(AuthGuard)
  async getDetailsByDate(@Query('date') date: string, @CurrentAccount() account : Account) {
    return this.appointmentDetailService.findDetailsByDate(date, account);
  }

  @Get()
  async getAllDetails() {
    return this.appointmentDetailService.findAll();
  }
}
