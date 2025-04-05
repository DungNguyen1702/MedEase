import { forwardRef, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { CustomMailerService } from './mailer.service';
import { AuthController } from '../auth/auth.controller';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: +process.env.MAIL_PORT,
        secure: process.env.MAIL_PORT === '465', // Đặt true nếu dùng SSL (port 465)
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <test-email@gmail.com>',
      },
    }),
    forwardRef(() => AuthModule),
  ],
  providers: [CustomMailerService],
  controllers: [AuthController],
  exports: [CustomMailerService],
})
export class CustomMailerModule {}
