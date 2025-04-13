import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  Account,
  AccountDocument,
  Doctor,
  DoctorDocument,
  Specialization,
  SpecializationDocument,
  Appointment,
  AppointmentDocument,
  AppointmentDetail,
  AppointmentDetailDocument,
  MedicalRecord,
  MedicalRecordDocument,
  Notification,
  NotificationDocument,
  ReExamSchedule,
  ReExamScheduleDocument,
} from '../../schemas';
import { Model } from 'mongoose';
import * as path from 'path';
import * as fs from 'fs';
import { AccountRoleEnum, DoctorPositionEnum } from '../../common/enums';
import * as bcrypt from 'bcrypt';
import { Connection } from 'mongoose';
@Injectable()
export class SeedersService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Specialization.name)
    private specializationModel: Model<SpecializationDocument>,
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(AppointmentDetail.name)
    private appointmentDetailModel: Model<AppointmentDetailDocument>,
    @InjectModel(MedicalRecord.name)
    private medicalRecordModel: Model<MedicalRecordDocument>,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(ReExamSchedule.name)
    private reExamModel: Model<ReExamScheduleDocument>
  ) {}

  async seedData() {
    try {
      await this.seedSpecialization();
      console.log('Seeder specialization completed!');

      await this.seedAccountsAndDoctors();
      console.log('Seeder accounts and doctors completed!');

      await this.seedAppointments();
      console.log('Seeder appointments completed!');

      await this.seedAppointmentDetails();
      console.log('Seeder appointment details completed!');

      await this.seedNotifications();
      console.log('Seeder notifications completed!');

      await this.seedReExams();
      console.log('Seeder re-exams completed!');

      console.log('Seeder completed!');
    } catch (error) {
      console.error('Seeder failed:', error);
    }
  }

  async seedSpecialization() {
    const dataPath = path.join(__dirname, 'data', 'specialization.json');
    const specializations = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    await this.specializationModel.deleteMany({});

    // Thêm dữ liệu mới và lưu ID để sử dụng cho các bảng liên quan
    const createdSpecializations =
      await this.specializationModel.insertMany(specializations);
    return createdSpecializations.map(spec => spec._id);
  }

  private async seedAccountsAndDoctors() {
    const dataPath = path.join(__dirname, 'data', 'account.json');
    const accounts = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    const dataDoctorPath = path.join(__dirname, 'data', 'doctor.json');
    const dataDoctors = JSON.parse(fs.readFileSync(dataDoctorPath, 'utf-8'));
    const doctorNames = dataDoctors.doctor_name;
    const doctorExamples = dataDoctors.doctor_example;
    const doctorRooms = dataDoctors.doctor_room;

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
    const doctorSchemaData = [];
    const baseDoctorAccountId = '20000000-0000-0000-0000-000000000000';
    const baseDocotorId = '30000000-0000-0000-0000-000000000000';
    const baseTimes = ['00:15', '00:30', '00:45'];
    let positionIndex = 0;

    for (let i = 0; i < doctorPositions.length; i++) {
      for (let j = 0; j < specializations.length; j++) {
        // Tăng ID của bác sĩ
        const doctorAccountId = baseDoctorAccountId.replace(/(\d+)$/, match =>
          (parseInt(match) + positionIndex + 1)
            .toString()
            .padStart(match.length, '0')
        );

        const doctorId = baseDocotorId.replace(/(\d+)$/, match =>
          (parseInt(match) + positionIndex + 1)
            .toString()
            .padStart(match.length, '0')
        );

        doctorAccountSchemaData.push({
          _id: doctorAccountId, // Gán ID mới
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
          _id: doctorId,
          account_id: doctorAccountId,
          specialization_id: specializations[j]._id,
          position: doctorPositions[i],
          base_time: baseTimes[Math.floor(Math.random() * baseTimes.length)],
          room: doctorRooms[positionIndex]['room_id'],
        });

        positionIndex++;
        // console.log('position : ' + positionIndex);
      }
    }

    // // Lưu các bác sĩ vào database
    await this.accountModel.insertMany(doctorAccountSchemaData);
    await this.doctorModel.insertMany(doctorSchemaData);
  }

  private async seedAppointments() {
    const dataPath = path.join(__dirname, 'data', 'appointment.json');
    const appointments = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    await this.appointmentModel.deleteMany({});

    // Thêm dữ liệu mới và lưu ID để sử dụng cho các bảng liên quan
    const createdAppointments =
      await this.appointmentModel.insertMany(appointments);
    return createdAppointments.map(app => app._id);
  }

  private async seedAppointmentDetails() {
    const dataPath = path.join(__dirname, 'data', 'appointment_detail.json');
    const appointmentDetails = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    await this.appointmentDetailModel.deleteMany({});

    const createdAppointmentDetails =
      await this.appointmentDetailModel.insertMany(appointmentDetails);
    return createdAppointmentDetails.map(app => app._id);
  }

  private async seedNotifications() {
    const dataPath = path.join(__dirname, 'data', 'notification.json');
    const notifications = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    await this.notificationModel.deleteMany({});

    const createdNotifications =
      await this.notificationModel.insertMany(notifications);
    return createdNotifications.map(app => app._id);
  }

  private async seedReExams() {
    const dataPath = path.join(__dirname, 'data', 're-exam.json');
    const reExams = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    await this.reExamModel.deleteMany({});

    const createdReExams = await this.reExamModel.insertMany(reExams);
    return createdReExams.map(app => app._id);
  }

  async clearData() {
    await this.accountModel.deleteMany({});
    await this.doctorModel.deleteMany({});
    await this.specializationModel.deleteMany({});
    await this.appointmentModel.deleteMany({});
    await this.appointmentDetailModel.deleteMany({});
    await this.medicalRecordModel.deleteMany({});
    await this.notificationModel.deleteMany({});
    await this.reExamModel.deleteMany({});
    // console.log('All data cleared!');
  }

  async resetDatabase() {
    // Xóa toàn bộ cơ sở dữ liệu
    await this.connection.dropDatabase();
    console.log('Database dropped!');
  }
}
