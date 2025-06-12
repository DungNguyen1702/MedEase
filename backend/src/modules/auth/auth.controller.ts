import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CustomMailerService } from '../mailer/mailer.service';
import { RegisterDto } from './dto/register.dto';
import { LoggingInterceptor } from '../../common/interceptors';

@Controller('/auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private customMailerService: CustomMailerService
  ) {}

  @Post('/login')
  loginUser(@Body() requestBody: LoginDto) {
    return this.authService.login(requestBody);
  }

  @Post('/register')
  async registerUser(@Body() registerDto: RegisterDto) {
    const result = await this.authService.registerAccount(registerDto);

    // console.log(result);

    // Gửi email xác minh sau khi đăng ký thành công
    await this.customMailerService.sendVerificationEmail(
      result.email,
      result.verificationLink
    );

    return {
      message: 'Registration successful! Please verify your email.',
      verificationLink: result.verificationLink,
    };
  }

  @Post('/reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('resetLink') resetURL: string
  ) {
    const result = await this.authService.sendPasswordReset(email, resetURL);

    await this.customMailerService.sendVerificationPasswordResetEmail(
      result.email,
      result.resetLink
    );

    return {
      message: 'Password reset link sent to your email.',
      resetLink: result.resetLink,
    };
  }

  @Post('/verify')
  async verifyEmail(@Body() body: any) {
    try {
      return await this.authService.verifyEmail(body.token);
    } catch {
      return new Error('Invalid or expired token');
    }
  }

  @Get('/get-reset-password')
  async getResetPassword(@Query('token') token: string) {
    const result = await this.authService.resetPassword(token);
    await this.customMailerService.sendPasswordReset(result.emailreset);
  }

  @Get('/test-send-mail')
  async testSendMail() {
    const result = await this.customMailerService.testSendMail();
    return {
      message: 'Test email sent successfully',
      result,
    };
  }

  @Put('/change-password')
  async changePassword(
    @Body('newPassword') newPassword: string,
    @Body('confirmPassword') confirmPassword: string,
    @Body('token') token: string,
  ) {

    return this.authService.changePassword(
      token,
      newPassword,
      confirmPassword
    );
  }
}
