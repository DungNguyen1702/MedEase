import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { RoleGuard } from '../../common/guards/role.guard';
import { AccountRoleEnum } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentAccount } from '../../common/decorators/current-account.decorator';
import { Account } from '../../schemas';

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

  @UseGuards(new RoleGuard([AccountRoleEnum.DOCTOR]))
  @UseGuards(AuthGuard)
  @Get('/get-examined-appointment')
  async getExaminedPatients(@Query('date') date: string, @CurrentAccount() currentAccount: Account) {
    return this.doctorService.getExaminedPatients(date, currentAccount);
  }
}
