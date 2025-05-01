import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MomoPaymentService } from './momo-payment.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentAccount } from '../../common/decorators/current-account.decorator';
import { Account } from '../../schemas';
import { AppointmentRequest } from '../appointment/dtos/AppointmentRequest';

@Controller('momo-payment')
export class MomoPaymentController {
  constructor(private momoService: MomoPaymentService) {}
  @Post('/payment')
  @UseGuards(AuthGuard)
  async createPayment(
    @Body() appRequest: AppointmentRequest,
    @CurrentAccount() currentAccount: Account
  ) {
    try {
      return await this.momoService.createPayment(appRequest, currentAccount);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Đã xảy ra lỗi khi tạo lịch hẹn'
      );
    }
  }
  @Post('/callback')
  async callback(@Req() req: any) {
    return this.momoService.callback(req);
  }
  @Get('/check-status/:orderId')
  async checkStatus(@Param('orderId') orderId: string) {
    return this.momoService.checkStatusTrans(orderId);
  }
}
