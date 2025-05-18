import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from '../../schemas/account.schema';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PasswordUtils } from '../../common/utils/password.utils';
import {
  Doctor,
  Specialization,
  DoctorDocument,
  SpecializationDocument,
} from '../../schemas';
import { AccountRoleEnum, type DoctorPositionEnum } from '../../common/enums';
import { DEFAULT_AVA_DOC, DEFAULT_AVA_PATIENT } from '../../common/constants';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Specialization.name)
    private specializationModel: Model<SpecializationDocument>
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<any> {
    const existed = await this.accountModel
      .findOne({ email: createAccountDto.email })
      .exec();
    if (existed) {
      throw new BadRequestException('Email đã tồn tại!');
    }
    // Tạo account trước
    const createdAccount = new this.accountModel({
      ...createAccountDto,
      avatar:
        createAccountDto.role === AccountRoleEnum.PATIENT
          ? DEFAULT_AVA_PATIENT
          : DEFAULT_AVA_DOC,
    });
    const savedAccount = await createdAccount.save();

    // Nếu không phải doctor thì trả về account như cũ
    if (savedAccount.role !== AccountRoleEnum.DOCTOR) {
      return savedAccount;
    }

    // Nếu là doctor, tạo thêm bản ghi Doctor
    const doctor = new this.doctorModel({
      account_id: savedAccount._id,
      specialization_id: createAccountDto.specializationId,
      position: createAccountDto.position,
      base_time: createAccountDto.base_time,
      room: createAccountDto.room,
    });
    const savedDoctor = await doctor.save();

    // Lấy lại thông tin account và specialization để trả về đầy đủ
    const account = await this.accountModel.findById(savedAccount._id).lean();
    const specialization = await this.specializationModel
      .findById(createAccountDto.specializationId)
      .lean();

    // Trả về đúng định dạng yêu cầu
    return {
      ...savedDoctor.toObject(),
      account,
      specialization,
    };
  }

  async update(
    id: string,
    updateAccountDto: Partial<UpdateAccountDto>
  ): Promise<any> {
    // Cập nhật account
    const updatedAccount = await this.accountModel
      .findByIdAndUpdate(id, updateAccountDto, { new: true })
      .exec();

    if (!updatedAccount) {
      throw new BadRequestException('Không tìm thấy tài khoản!');
    }

    // Nếu role là doctor thì cập nhật hoặc tạo mới doctor
    if (updateAccountDto.role === AccountRoleEnum.DOCTOR) {
      // Kiểm tra đã có doctor chưa
      let doctor = await this.doctorModel.findOne({ account_id: id }).exec();
      if (doctor) {
        // Cập nhật doctor
        doctor.specialization_id =
          updateAccountDto.specializationId || doctor.specialization_id;
        doctor.position =
          (updateAccountDto.position as DoctorPositionEnum) || doctor.position;
        doctor.base_time = updateAccountDto.base_time || doctor.base_time;
        doctor.room = updateAccountDto.room || doctor.room;
        await doctor.save();
      } else {
        // Tạo mới doctor nếu chưa có
        doctor = new this.doctorModel({
          account_id: id,
          specialization_id: updateAccountDto.specializationId,
          position: updateAccountDto.position,
          base_time: updateAccountDto.base_time,
          room: updateAccountDto.room,
        });
        await doctor.save();
      }

      // Lấy lại thông tin specialization
      const specialization = await this.specializationModel
        .findById(doctor.specialization_id)
        .lean();

      // Trả về đúng định dạng
      return {
        ...doctor.toObject(),
        account: updatedAccount.toObject
          ? updatedAccount.toObject()
          : updatedAccount,
        specialization,
      };
    } else {
      // Nếu không phải doctor thì xóa doctor nếu có
      await this.doctorModel.deleteOne({ account_id: id }).exec();
      return updatedAccount;
    }
  }

  async findAll(): Promise<Account[]> {
    return this.accountModel.find().exec();
  }

  async findOne(id: string): Promise<Account> {
    return this.accountModel.findById(id).exec();
  }

  async delete(id: string): Promise<Account> {
    // Tìm account trước để kiểm tra role
    const account = await this.accountModel.findById(id).exec();
    if (!account) {
      throw new BadRequestException('Không tìm thấy tài khoản!');
    }

    // Nếu là bác sĩ thì xóa luôn doctor
    if (account.role === 'doctor') {
      await this.doctorModel.deleteOne({ account_id: id }).exec();
    }

    // Xóa account
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
      throw new BadRequestException(
        'Mật khẩu xác nhận không trùng với mật khẩu mới!'
      );
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
