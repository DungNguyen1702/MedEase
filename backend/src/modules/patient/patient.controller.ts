import { Controller, Get, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { RoleGuard } from '../../common/guards/role.guard';
import { AccountRoleEnum } from '../../common/enums';
import { CurrentAccount } from '../../common/decorators/current-account.decorator';
import { Account } from '../../schemas';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  getAllPatient() {
    return this.patientService.getAllPatient();
  }

  @UseGuards(new RoleGuard([AccountRoleEnum.DOCTOR]))
  @UseGuards(AuthGuard)
  @Get('/examined_patients')
  getExaminedPatients(@CurrentAccount() currentAccount: Account) {
    return this.patientService.getExaminedPatients(currentAccount);
  }
}
