import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { SeedersController } from './seeders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { allSchemas } from '../../schemas';

@Module({
  imports: [
    MongooseModule.forFeature(allSchemas),
  ],
  providers: [SeedersService],
  controllers: [SeedersController]
})
export class SeedersModule {}
