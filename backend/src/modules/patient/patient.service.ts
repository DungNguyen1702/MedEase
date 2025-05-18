import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountDocument, Account } from '../../schemas';
import { MedicalRecordService } from '../medical-record/medical-record.service';
import { AppointmentService } from '../appointment/appointment.service';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel('Account')
    private readonly accountModel: Model<AccountDocument>, // Replace 'any' with the actual type of your model
    private readonly medicalRecordService: MedicalRecordService,
    private readonly appointmentService: AppointmentService
  ) {}

  async getAllPatient() {
    return this.accountModel.aggregate([
      {
        $match: { role: 'patient' }, // Chỉ lấy các tài khoản có vai trò là bệnh nhân
      },
      {
        $lookup: {
          from: 'appointments',
          localField: '_id',
          foreignField: 'patient_id',
          as: 'appointments',
        },
      },
      {
        $addFields: {
          appointmentNum: { $size: '$appointments' },
        },
      },
      {
        $project: {
          password: 0, // Ẩn trường password trong tài khoản
        },
      },
    ]);
  }

  async getExaminedPatients(currentAccount: Account) {
    console.log(currentAccount._id);

    return this.accountModel.aggregate([
      {
        $match: { role: 'patient' }, // Chỉ lấy các tài khoản có vai trò là bệnh nhân
      },
      {
        $lookup: {
          from: 'appointments',
          localField: '_id',
          foreignField: 'patient_id',
          as: 'appointments',
        },
      },
      {
        $lookup: {
          from: 'appointmentdetails',
          localField: 'appointments._id',
          foreignField: 'appointment_id',
          as: 'appointmentDetails',
          pipeline: [
            {
              $lookup: {
                from: 'doctors',
                localField: 'doctor_id',
                foreignField: '_id',
                as: 'doctor',
                pipeline: [
                  {
                    $lookup: {
                      from: 'accounts',
                      localField: 'account_id',
                      foreignField: '_id',
                      as: 'account',
                    },
                  },
                  {
                    $addFields: {
                      account: { $arrayElemAt: ['$account', 0] }, // Lấy phần tử đầu tiên của account
                    },
                  },
                  {
                    $match: {
                      doctor_id: currentAccount._id, // Lọc các chi tiết hẹn khám theo bác sĩ hiện tại
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                doctor: { $arrayElemAt: ['$doctor', 0] }, // Lấy phần tử đầu tiên của doctor
              },
            },
          ],
        },
      },
      {
        $match: {
          'appointmentDetails.0': { $exists: true },
        },
      },
      {
        $addFields: {
          appointmentNum: { $size: '$appointments' },
        },
      },
    ]);
  }

  async getPatientProfile(patientId: string): Promise<{
    patient: any;
    appointments: any[];
    medicalRecords: any[];
    total: {
      appointment: number;
      medicalRecord: number;
    };
  }> {
    // Lấy thông tin bệnh nhân
    const patient = await this.accountModel
      .findById(patientId)
      .select('-password')
      .lean();

    // Lấy danh sách lịch hẹn của bệnh nhân
    const appointments =
      await this.appointmentService.getAppointmentById(patientId);

    // Lấy danh sách hồ sơ bệnh án của bệnh nhân
    const medicalRecords =
      await this.medicalRecordService.getMedicalRecord(patientId);

    return {
      patient,
      appointments,
      medicalRecords,
      total: {
        appointment: appointments.length,
        medicalRecord: medicalRecords.length,
      },
    };
  }
}
