import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Account,
  Doctor,
  AccountDocument,
  DoctorDocument,
  Specialization,
  type SpecializationDocument,
} from '../../schemas';
import { Model } from 'mongoose';
import * as path from 'path';
import * as fs from 'fs';
import { AccountRoleEnum, DoctorPositionEnum } from '../../common/enums';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedersService {
  constructor(
    @InjectModel(Specialization.name)
    private specializationModel: Model<SpecializationDocument>,
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>
  ) {}

  async seedData() {
    try {
      await this.seedSpecialization();
      console.log('Seeder specialization completed!');

      await this.seedAccountsAndDoctors();
      console.log('Seeder accounts and doctors completed!');

      console.log('Seeder completed!');
    } catch (error) {
      console.error('Seeder failed:', error);
    }
  }

  private async seedSpecialization() {
    const dataPath = path.join(__dirname, 'data', 'specialization.json');
    const specializations = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    await this.specializationModel.deleteMany({});

    // Thêm dữ liệu mới và lưu ID để sử dụng cho các bảng liên quan
    const createdSpecializations =
      await this.specializationModel.insertMany(specializations);
    return createdSpecializations.map(spec => spec._id);
  }

  async seedAccountsAndDoctors() {

    const dataPath = path.join(__dirname, 'data', 'account.json');
    const accounts = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    const dataDoctorPath = path.join(__dirname, 'data', 'doctor.json');
    const dataDoctors = JSON.parse(fs.readFileSync(dataDoctorPath, 'utf-8'));
    const doctorNames = dataDoctors.doctor_name;
    const doctorExamples = dataDoctors.doctor_example;

    // Xóa dữ liệu cũ (nếu cần)
    await this.accountModel.deleteMany({});
    await this.doctorModel.deleteMany({});

    // // Hash password trước khi lưu
    for (const account of accounts) {
      account.password = await bcrypt.hash(account.password, 10);
    }
    for (const doctorExample of doctorExamples) {
      doctorExample.password = await bcrypt.hash(doctorExample.password, 10);
    }

    // Thêm dữ liệu mới và lưu ID để sử dụng cho các bảng liên quan
    // Thêm dữ liệu cho patient và admin
    await this.accountModel.insertMany(accounts);

    // // Tạo thêm 7 bác sĩ với thông tin được thay đổi
    const specializations = await this.specializationModel.find().exec(); // Lấy danh sách 25 khoa
    const doctorPositions = Object.values(DoctorPositionEnum); // Lấy danh sách 7 vị trí bác sĩ từ enum

    const doctorAccountSchemaData = [];
    const doctorSchemaData = []
    const baseDoctorAccountId = '20000000-0000-0000-0000-000000000000';
    const baseDocotorId = '30000000-0000-0000-0000-000000000000';
    const baseTimes = ["00:15", "00:30", "00:45"];
    let positionIndex = 0;

    for (let i = 0; i < doctorPositions.length; i++) {
      for (let j = 0; j < specializations.length; j++) {

        // Tăng ID của bác sĩ
        const doctorAccountId = baseDoctorAccountId.replace(/(\d+)$/, match =>
          (parseInt(match) + positionIndex + 1).toString().padStart(match.length, '0')
        );

        const doctorId = baseDocotorId.replace(/(\d+)$/, match =>
          (parseInt(match) + positionIndex + 1).toString().padStart(match.length, '0')
        );

        doctorAccountSchemaData.push({
          id: doctorAccountId, // Gán ID mới
          email: `doctor${positionIndex + 1}@medease.com`,
          password: doctorExamples[i].password,
          name: `${doctorNames[positionIndex]}`, // Tên bác sĩ theo khoa
          tel: doctorExamples[i].tel, // Số điện thoại khác nhau
          address: doctorExamples[i].address, // Địa chỉ khác nhau
          avatar: `https://res.cloudinary.com/deei5izfg/image/upload/v1743519515/MedEase/Avatar/doctor-avatar_fnybrd.png`, // Giữ nguyên avatar
          gender: i % 2 === 0 ? 'male' : 'female', // Xen kẽ giới tính
          date_of_birth: new Date(1980 + i, 0, 1), // Tạo ngày sinh khác nhau
          role: AccountRoleEnum.DOCTOR,
        });

        doctorSchemaData.push({
          id : doctorId,
          account_id: doctorAccountId,
          specialization_id: specializations[j]._id,
          position: doctorPositions[i],
          base_time: baseTimes[Math.floor(Math.random() * baseTimes.length)]
        });

        positionIndex++;
        // console.log('position : ' + positionIndex);
      }
    }

    // // Lưu các bác sĩ vào database
    await this.accountModel.insertMany(doctorAccountSchemaData);
    await this.doctorModel.insertMany(doctorSchemaData);
  }
}
