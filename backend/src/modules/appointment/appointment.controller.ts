import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AccountRoleEnum } from '../../common/enums';
import { RoleGuard } from '../../common/guards/role.guard';
import { CurrentAccount } from '../../common/decorators/current-account.decorator';
import { Account } from '../../schemas';
import type { AppointmentRequest } from './dtos/AppointmentRequest';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @UseGuards(new RoleGuard([AccountRoleEnum.PATIENT]))
  @UseGuards(AuthGuard)
  @Get('/history')
  async getAppointmentById(@CurrentAccount() currentAccount: Account) {
    return this.appointmentService.getAppointmentById(currentAccount);
  }

  @UseGuards(new RoleGuard([AccountRoleEnum.PATIENT]))
  @UseGuards(AuthGuard)
  @Get('/history-detail/:id')
  async getAppointmentDetail(
    @CurrentAccount() currentAccount: Account,
    @Param('id') id: string
  ) {
    return this.appointmentService.getAppointmentDetail(currentAccount, id);
  }

  @UseGuards(new RoleGuard([AccountRoleEnum.PATIENT]))
  @UseGuards(AuthGuard)
  @Get('/appointment-num')
  async getAppointmentNum(@CurrentAccount() currentAccount: Account) {
    return this.appointmentService.getAppointmentNum(currentAccount);
  }

  @UseGuards(new RoleGuard([AccountRoleEnum.PATIENT]))
  @UseGuards(AuthGuard)
  @Post()
  async createAppointment(
    @CurrentAccount() currentAccount: Account,
    @Body() body: AppointmentRequest
  ) {
    try {
      return await this.appointmentService.createAppointment(
        currentAccount,
        body
      );
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Đã xảy ra lỗi khi tạo lịch hẹn'
      );
    }
  }

  @UseGuards(new RoleGuard([AccountRoleEnum.PATIENT]))
  @UseGuards(AuthGuard)
  @Get('/appoinemtment-detail-payment')
  async getAppoinemtmentDetailPayment(
    @CurrentAccount() currentAccount: Account,
    @Query('paymentCode') paymentCode: string,
    @Query('paymentType') paymentType: string
  ) {
    return this.appointmentService.getAppoinemtmentDetailPayment(
      currentAccount,
      paymentCode,
      paymentType
    );
  }
}
