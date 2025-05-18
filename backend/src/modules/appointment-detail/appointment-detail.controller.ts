import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { AppointmentDetailService } from './appointment-detail.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { AccountRoleEnum } from '../../common/enums';
import { CurrentAccount } from '../../common/decorators/current-account.decorator';
import type { Account } from '../../schemas';
import type { UpdateAppointmentDetailRequest } from './dtos/UpdateAppointmentDetailRequest';

@Controller('appointment-detail')
export class AppointmentDetailController {
  constructor(
    private readonly appointmentDetailService: AppointmentDetailService
  ) {}

  @UseGuards(new RoleGuard([AccountRoleEnum.PATIENT]))
  @UseGuards(AuthGuard)
  @Get('/details-by-date')
  async getDetailsByDate(
    @Query('date') date: string,
    @CurrentAccount() account: Account
  ) {
    return this.appointmentDetailService.findDetailsByDate(date, account);
  }

  @Get()
  async getAllDetails() {
    return this.appointmentDetailService.findAll();
  }

  @UseGuards(new RoleGuard([AccountRoleEnum.DOCTOR]))
  @UseGuards(AuthGuard)
  @Put('/update-appointment-detail')
  async updateAppointmentDetail(
    @CurrentAccount() account: Account,
    @Body() body: UpdateAppointmentDetailRequest
  ) {
    return this.appointmentDetailService.updateAppointmentDetail(
      body,
      account._id
    );
  }
}
