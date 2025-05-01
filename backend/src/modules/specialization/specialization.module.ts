import { Module } from '@nestjs/common';
import { SpecializationController } from './specialization.controller';
import { SpecializationService } from './specialization.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecializationSchema } from '../../schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Specialization', schema: SpecializationSchema },
    ]),
  ],
  controllers: [SpecializationController],
  providers: [SpecializationService],
})
export class SpecializationModule {}
