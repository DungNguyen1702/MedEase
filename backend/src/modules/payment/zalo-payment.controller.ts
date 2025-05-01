import { ZaloPaymentService } from './zalo-payment.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccountRoleEnum } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { LoggingInterceptor } from '../../common/interceptors';
import { AppointmentRequest } from '../appointment/dtos/AppointmentRequest';
import { Account } from '../../schemas';
import { CurrentAccount } from '../../common/decorators/current-account.decorator';

@Controller('zalo-payment')
@UseInterceptors(LoggingInterceptor)
export class ZaloPaymentController {
  constructor(private readonly ZaloPaymentService: ZaloPaymentService) {}

  @UseGuards(new RoleGuard([AccountRoleEnum.PATIENT]))
  @UseGuards(AuthGuard)
  @Post('/payment')
  async createPayment(
    @Body() appRequest: AppointmentRequest,
    @CurrentAccount() account: Account
  ) {
    try {
      return await this.ZaloPaymentService.createPayment(appRequest, account);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Đã xảy ra lỗi khi tạo lịch hẹn'
      );
    }
  }

  @Post('/callback')
  async callbackPayment(@Body() body: any) {
    return await this.ZaloPaymentService.handleZaloCallback(body);
  }

  @Get('/check-status/:app_trans_id')
  async checkOrderStatus(@Param('app_trans_id') app_trans_id: string) {
    return await this.ZaloPaymentService.queryPayment(app_trans_id);
  }
}
