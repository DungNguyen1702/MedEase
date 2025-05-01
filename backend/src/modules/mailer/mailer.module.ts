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
        // host: process.env.MAIL_HOST,
        host: 'smtp.gmail.com',
        // port: +process.env.MAIL_PORT,
        port: 465,
        // secure: process.env.MAIL_PORT === '465', // Đặt true nếu dùng SSL (port 465)
        secure: true, // Đặt true nếu dùng SSL (port 465)
        auth: {
          // user: process.env.MAIL_USER,
          user: 'vandung17022003@gmail.com',
          // pass: process.env.MAIL_PASSWORD,
          pass: 'wsnu hmpp rwzb euke',
        },
      },
      defaults: {
        from: 'test-email@gmail.com',
      },
    }),
    forwardRef(() => AuthModule),
  ],
  providers: [CustomMailerService],
  controllers: [AuthController],
  exports: [CustomMailerService],
})
export class CustomMailerModule {}
