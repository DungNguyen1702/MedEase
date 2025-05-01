import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from '../account/account.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { CustomMailerService } from '../mailer/mailer.service';
import { PasswordUtils } from '../../common/utils/password.utils';
import { Account, AccountDocument } from '../../schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    private accountService: AccountService,
    private jwtService: JwtService,
    private readonly customMailerService: CustomMailerService
  ) {}

  async login(requestBody: LoginDto) {
    //check email exist
    const accountByEmail = await this.accountService.findByEmail(
      requestBody.email
    );

    if (!accountByEmail) {
      throw new BadRequestException('Không tìm thấy tài khoản!');
    }

    //check password
    const isMatchPassword = await bcrypt.compare(
      requestBody.password,
      accountByEmail.password
    );
    if (!isMatchPassword) {
      throw new BadRequestException('Mật khẩu không chính xác!');
    }

    //generate jwt token
    const payload = {
      id: accountByEmail._id,
      name: accountByEmail.name,
      address: accountByEmail.address,
      email: accountByEmail.email,
      role: accountByEmail.role,
      date_of_birth: accountByEmail.date_of_birth,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      msg: 'Đăng nhập thành công',
      access_token,
      name: accountByEmail.name,
      address: accountByEmail.address,
      email: accountByEmail.email,
      tel: accountByEmail.tel,
      avatar: accountByEmail.avatar,
      gender: accountByEmail.gender,
      role: accountByEmail.role,
      date_of_birth: accountByEmail.date_of_birth,
    };
  }
  async registerAccount(accountData: RegisterDto) {
    const accountFound = await this.accountService.findByEmail(
      accountData.email
    );

    if (accountFound) {
      throw new BadRequestException('The email already exists in the system');
    }
    if (accountData.password !== accountData.confirmPassword) {
      throw new BadRequestException('Confirm password invalid');
    }
    accountData.password = PasswordUtils.hashPassword(accountData.password);
    // const newAccount = await this.accountService.create(accountData);
    const newAccount = {
      ...accountData,
      isActive: true,
    };

    const verificationToken = await this.jwtService.signAsync(
      { newAccount: newAccount },
      { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const verificationLink =
      process.env.DEPLOY_SERVICE_LINK +
      `/auth/verify?token=${verificationToken}`;

    // Gửi email xác minh qua MailerService
    // await this.customMailerService.sendVerificationEmail(newAccount.email, verificationLink);

    return { email: accountData.email, verificationLink };
  }
  async verifyEmail(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
    // console.log(payload);
    const user: Account = await this.accountService.create(payload.newAccount);
    // console.log(user);
    if (!user) {
      return new UnauthorizedException('User not found');
    }

    // await this.accountService.create(payload.newAccount);
    // // Cập nhật trạng thái xác minh của người dùng
    // user.isVerified = true; // Hoặc trường tương ứng trong mô hình của bạn
    // await this.userService.update(user.id, user); // Cập nhật thông tin người dùng

    return user;
  }
  async sendPasswordReset(email: string) {
    const account = await this.accountService.findByEmail(email);
    if (!account) {
      throw new BadRequestException('Email not found!');
    }

    const resetToken = await this.jwtService.signAsync(
      { email: account.email },
      { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const resetLink =
      process.env.DEPLOY_SERVICE_LINK +
      `/auth/get-reset-password?token=${resetToken}`;

    // Gửi email reset mật khẩu qua MailerService
    await this.customMailerService.sendVerificationPasswordResetEmail(
      account.email,
      resetLink
    );

    return { email: account.email, resetLink };
  }
  async resetPassword(token: string) {
    // Xác minh token
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });

    if (!payload) {
      throw new UnauthorizedException('Invalid token or email');
    }

    // Tìm tài khoản bằng email
    const account = await this.accountService.findByEmail(payload.email);
    if (!account) {
      throw new BadRequestException('Email not found!');
    }

    // Đặt mật khẩu mới thành "88888888"
    account.password = PasswordUtils.hashPassword('88888888');

    // Cập nhật thông tin tài khoản
    await this.accountService.update(account._id, account);

    return {
      message: 'Password has been reset successfully.',
      emailreset: account.email,
    };
  }
}
