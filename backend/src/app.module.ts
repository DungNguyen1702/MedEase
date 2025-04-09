import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { SeedersModule } from './database/seeders/seeders.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { AppointmentDetailModule } from './modules/appointment-detail/appointment-detail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    }),
    AccountModule,
    AuthModule,
    SeedersModule,
    AppointmentModule,
    AppointmentDetailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
