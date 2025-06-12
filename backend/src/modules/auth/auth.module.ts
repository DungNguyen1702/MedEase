import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Account,
  AccountSchema,
  Doctor,
  DoctorSchema,
  Specialization,
  SpecializationSchema,
} from '../../schemas';
import { JwtModule } from '@nestjs/jwt';
import { AccountModule } from '../account/account.module';
import { CustomMailerModule } from '../mailer/mailer.module';
import { AuthGuard } from '../../common/guards/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Specialization.name, schema: SpecializationSchema },
    ]),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    AccountModule,
    CustomMailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
