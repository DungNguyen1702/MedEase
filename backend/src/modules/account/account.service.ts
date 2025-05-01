import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from '../../schemas/account.schema';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PasswordUtils } from '../../common/utils/password.utils';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const createdAccount = new this.accountModel(createAccountDto);
    return createdAccount.save();
  }

  async update(
    id: string,
    updateAccountDto: Partial<UpdateAccountDto>
  ): Promise<Account | null> {
    const updatedAccount = await this.accountModel
      .findByIdAndUpdate(id, updateAccountDto, { new: true })
      .exec();

    if (!updatedAccount) {
      throw new Error('Account not found');
    }

    return updatedAccount;
  }

  async findAll(): Promise<Account[]> {
    return this.accountModel.find().exec();
  }

  async findOne(id: string): Promise<Account> {
    return this.accountModel.findById(id).exec();
  }

  async delete(id: string): Promise<Account> {
    return this.accountModel.findByIdAndDelete(id).exec();
  }

  async findByEmail(email: string): Promise<Account | null> {
    return this.accountModel.findOne({ email }).exec();
  }

  async changePassword(
    account: Account,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    const accountFound = await this.accountModel.findById(account._id);
    if (!accountFound) {
      throw new BadRequestException('Tài khoản không tồn tại!');
    }
    //check password
    const isMatchPassword = await bcrypt.compare(
      oldPassword,
      accountFound.password
    );
    if (!isMatchPassword) {
      throw new BadRequestException('Mật khẩu không chính xác!');
    }
    if (await bcrypt.compare(newPassword, accountFound.password)) {
      throw new BadRequestException(
        'Mật khẩu mới không được giống mật khẩu cũ!'
      );
    }
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Mật khẩu xác nhận không trùng với mật khẩu mới!');
    }
    accountFound.password = PasswordUtils.hashPassword(newPassword);
    await this.update(account._id, accountFound);
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
