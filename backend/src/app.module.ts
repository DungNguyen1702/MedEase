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
import { SpecializationModule } from './modules/specialization/specialization.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { NotificationModule } from './modules/notification/notification.module';
import { QuestionAnswerModule } from './modules/question-answer/question-answer.module';
import { MedicalRecordModule } from './modules/medical-record/medical-record.module';
import { CloudinaryConfig } from './common/config/cloudinary.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors';
import { UploadModule } from './modules/upload/upload.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
      autoIndex: true,
    }),
    AccountModule,
    AuthModule,
    SeedersModule,
    AppointmentModule,
    AppointmentDetailModule,
    SpecializationModule,
    DoctorModule,
    NotificationModule,
    QuestionAnswerModule,
    MedicalRecordModule,
    UploadModule,
    PaymentModule,
    ChatbotModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CloudinaryConfig,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [CloudinaryConfig],
})
export class AppModule {}
