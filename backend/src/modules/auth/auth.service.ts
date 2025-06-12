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
import { Account, AccountDocument, Doctor } from '../../schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from './dto/register.dto';
import { DEFAULT_AVA_PATIENT } from '../../common/constants';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @InjectModel(Doctor.name)
    private doctorModel: Model<Doctor>,
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

    let position = null;
    let specialization_name = null;
    let specialization_id = null;
    let room = null;
    let base_time = null;

    // Nếu role là bác sĩ, lấy thêm thông tin position và specialization_name
    if (accountByEmail.role === 'doctor') {
      const doctorInfo = await this.doctorModel.aggregate([
        {
          $match: { account_id: accountByEmail._id },
        },
        {
          $lookup: {
            from: 'specializations',
            localField: 'specialization_id',
            foreignField: '_id',
            as: 'specialization',
          },
        },
        {
          $addFields: {
            specialization: { $arrayElemAt: ['$specialization', 0] },
          },
        },
      ]);

      if (doctorInfo) {
        position = doctorInfo[0].position;
        specialization_name = doctorInfo[0].specialization.name;
        specialization_id = doctorInfo[0].specialization._id;
        room = doctorInfo[0].room;
        base_time = doctorInfo[0].base_time;
      }
    }
    //generate jwt token
    const payload = {
      id: accountByEmail._id,
      name: accountByEmail.name,
      address: accountByEmail.address,
      email: accountByEmail.email,
      role: accountByEmail.role,
      date_of_birth: accountByEmail.date_of_birth,
      position,
      specialization_id,
      specialization_name,
      room,
      base_time,
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
      position,
      specialization_id,
      specialization_name,
      room,
      base_time,
      _id : accountByEmail._id,
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
    };

    const verificationToken = await this.jwtService.signAsync(
      { newAccount: newAccount },
      { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const verificationLink =
      accountData.verifyLink + `?token=${verificationToken}`;

    // Gửi email xác minh qua MailerService
    // await this.customMailerService.sendVerificationEmail(newAccount.email, verificationLink);

    return { email: accountData.email, verificationLink };
  }

  async verifyEmail(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });

    const existed = await this.accountModel
      .findOne({ email: payload.newAccount.email })
      .exec();
    if (existed) {
      throw new BadRequestException('Email đã tồn tại!');
    }

    const createdAccount = new this.accountModel({
      ...payload.newAccount,
      avatar: DEFAULT_AVA_PATIENT,
    });

    console.log('createdAccount', createdAccount);

    try {
      const user: Account = await createdAccount.save();
      console.log('user', user);

      if (!user) {
        return new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      console.error('Error saving user:', error);
      throw new BadRequestException('Failed to create account');
    }
  }

  async sendPasswordReset(email: string, resetURL: string) {
    const account = await this.accountService.findByEmail(email);
    if (!account) {
      throw new BadRequestException('Email not found!');
    }

    const resetToken = await this.jwtService.signAsync(
      { email: account.email, _id: account._id },
      { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const resetLink = resetURL + `?token=${resetToken}`;

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

  async changePassword(
    token: string,
    newPassword: string,
    confirmPassword: string
  ) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });

    console.log('payload', payload);

    const accountFound = await this.accountModel.findById(payload._id);
    if (!accountFound) {
      throw new BadRequestException('Tài khoản không tồn tại!');
    }
    if (await bcrypt.compare(newPassword, accountFound.password)) {
      throw new BadRequestException(
        'Mật khẩu mới không được giống mật khẩu cũ!'
      );
    }
    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        'Mật khẩu xác nhận không trùng với mật khẩu mới!'
      );
    }
    accountFound.password = PasswordUtils.hashPassword(newPassword);

    await this.accountService.update(payload._id, accountFound);
    return {
      msg: 'Đổi mật khẩu thành công',
      email: accountFound.email,
      name: accountFound.name,
      address: accountFound.address,
      tel: accountFound.tel,
      avatar: accountFound.avatar,
    };
  }
}
