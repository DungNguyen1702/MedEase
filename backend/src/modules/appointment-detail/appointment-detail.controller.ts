import { Controller, Get, Query } from '@nestjs/common';
import { AppointmentDetailService } from './appointment-detail.service';

@Controller('appointment-detail')
export class AppointmentDetailController {

  constructor(private readonly appointmentDetailService: AppointmentDetailService) {}

  @Get('/details-by-date')
  async getDetailsByDate(@Query('date') date: string) {
    return this.appointmentDetailService.findDetailsByDate(date);
  }

  @Get()
  async getAllDetails() {
    return this.appointmentDetailService.findAll();
  }
}
