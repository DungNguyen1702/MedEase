import { Controller, Post } from '@nestjs/common';
import { SeedersService } from './seeders.service';

@Controller('seeders')
export class SeedersController {
  constructor(private readonly seederService: SeedersService) {}
  @Post()
  async seedDatabase() {
    await this.seederService.seedData();
    return { message: 'Database seeded successfully'};
  }
}
