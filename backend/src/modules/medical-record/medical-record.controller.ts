import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MedicalRecordService } from './medical-record.service';
import { RoleGuard } from '../../common/guards/role.guard';
import { AccountRoleEnum } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentAccount } from '../../common/decorators/current-account.decorator';
import { Account } from '../../schemas';

@Controller('medical-record')
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}
  @UseGuards(new RoleGuard([AccountRoleEnum.PATIENT]))
  @UseGuards(AuthGuard)
  @Get()
  async getMedicalRecord(@CurrentAccount() currentAccount: Account) {
    return this.medicalRecordService.getMedicalRecord(currentAccount._id);
  }

  @UseGuards(new RoleGuard([AccountRoleEnum.PATIENT]))
  @UseGuards(AuthGuard)
  @Get('/:id')
  async getMedicalRecordById(
    @CurrentAccount() currentAccount: Account,
    @Param('id') id: string
  ) {
    return this.medicalRecordService.getMedicalRecordById(
      currentAccount._id,
      id
    );
  }
}
