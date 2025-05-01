import { Controller, Get, Param, Query } from '@nestjs/common';
import { DoctorService } from './doctor.service';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get('/get-current-number/:id')
  async getCurrentNumber(@Param('id') id: string) {
    return this.doctorService.getCurrentNumber(id);
  }

  @Get('/doctor-room/:id')
  async getDoctorRoom(@Param('id') id: string, @Query('date') date: string) {
    return this.doctorService.getDoctorRoom(id, date);
  }
}
