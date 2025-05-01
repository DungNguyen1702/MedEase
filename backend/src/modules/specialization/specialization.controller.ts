import { Controller, Get, Param } from '@nestjs/common';
import { SpecializationService } from './specialization.service';

@Controller('specialization')
export class SpecializationController {
  constructor(private readonly specService: SpecializationService) {}

  @Get()
  async getAllSpecializations() {
    return this.specService.findAll();
  }

  @Get('/:id')
  async getSpecializationById(@Param('id') id: string) {
    return this.specService.findById(id);
  }
}
