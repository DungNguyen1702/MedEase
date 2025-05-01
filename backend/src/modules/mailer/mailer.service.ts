import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class CustomMailerService {
  constructor(private readonly mailerService: MailerService) {}
  async sendVerificationEmail(email: string, verificationLink: string) {
    try {
      const result = await this.mailerService.sendMail({
        to: email,
        subject: 'Verify Your Email',
        text: `Please verify your email by clicking the following link: ${verificationLink}`,
      });
      console.log('Email sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Email sending failed');
    }
  }

  async sendVerificationPasswordResetEmail(email: string, resetLink: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Your Password',
      text: `You can get your reset password by clicking the following link: ${resetLink}`,
    });
  }

  async sendPasswordReset(email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Your Password',
      text: 'Your password has been reset to 88888888',
    });
  }

  async testSendMail() {
    try {
      const result = await this.mailerService.sendMail({
        to: 'vandung17022003@gmail.com', // Địa chỉ email nhận
        subject: 'Test Email', // Tiêu đề email
        text: 'This is a test email to verify the mailer service.', // Nội dung email
      });
      console.log('Test email sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to send test email:', error);
      throw new Error('Test email sending failed');
    }
  }
}
