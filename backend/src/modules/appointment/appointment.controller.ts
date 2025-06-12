import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AccountRoleEnum } from '../../common/enums';
import { RoleGuard } from '../../common/guards/role.guard';
import { CurrentAccount } from '../../common/decorators/current-account.decorator';
import { Account } from '../../schemas';
import { AppointmentRequest } from './dtos/AppointmentRequest';
import { AppointmentEditRequest } from './dtos/AppointmentEditReq';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @UseGuards(new RoleGuard([AccountRoleEnum.PATIENT]))
  @UseGuards(AuthGuard)
  @Get('/history')
  async getAppointmentById(@CurrentAccount() currentAccount: Account) {
    return this.appointmentService.getAppointmentById(currentAccount._id);
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
      console.log('body', body);

      return await this.appointmentService.createAppointment(
        currentAccount._id,
        body
      );
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Đã xảy ra lỗi khi tạo lịch hẹn'
      );
    }
  }

  @UseGuards(new RoleGuard([AccountRoleEnum.ADMIN]))
  @UseGuards(AuthGuard)
  @Post('/admin-appointment/:patientId')
  async createAppointmentByAdmin(
    @Param('patientId') patientId: string,
    @Body() body: AppointmentRequest
  ) {
    try {
      return await this.appointmentService.createAppointment(patientId, body);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Đã xảy ra lỗi khi tạo lịch hẹn'
      );
    }
  }

  @UseGuards(new RoleGuard([AccountRoleEnum.ADMIN]))
  @UseGuards(AuthGuard)
  @Put('/admin-appointment/:appointmentId')
  async updateAppointmentByAdmin(
    @Param('appointmentId') appointmentId: string,
    @Body() body: AppointmentEditRequest
  ) {
    try {
      return await this.appointmentService.updateAppointment(
        appointmentId,
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

  @UseGuards(new RoleGuard([AccountRoleEnum.ADMIN]))
  @UseGuards(AuthGuard)
  @Get('/admin-appointment')
  async getAllAppointment() {
    return this.appointmentService.getAllAppointment();
  }

  @UseGuards(new RoleGuard([AccountRoleEnum.ADMIN]))
  @UseGuards(AuthGuard)
  @Delete('/admin-appointment/:id')
  async deleteAppointmentByAdmin(@Param('id') id: string) {
    try {
      return await this.appointmentService.deleteAppointment(id);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Đã xảy ra lỗi khi xóa lịch hẹn'
      );
    }
  }

  @UseGuards(new RoleGuard([AccountRoleEnum.DOCTOR]))
  @UseGuards(AuthGuard)
  @Get('/appointment-detail/:id')
  async getAppointmentDetailById(@Param('id') id: string) {
    // console.log('id', id);
    return this.appointmentService.getAppointmentDetailById(id);
  }
}
