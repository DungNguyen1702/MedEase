import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Appointment,
  AppointmentDetail,
  AppointmentDetailDocument,
  MedicalRecord,
  ReExamSchedule,
  Account,
  MedicalRecordDocument,
  ReExamScheduleDocument,
  AppointmentDocument,
  Doctor,
  DoctorDocument,
  Specialization,
  SpecializationDocument,
} from '../../schemas';
import { UpdateAppointmentDetailRequest } from './dtos/UpdateAppointmentDetailRequest';
import {
  NotificationTypeEnum,
  NotificationTypeImageEnum,
} from '../../common/enums';
import { NotificationService } from '../notification/notification.service';
import { google } from 'googleapis';
import { specializationMapping } from '../../common/constants';
import { translateText } from '../../common/utils/translator.utils';

@Injectable()
export class AppointmentDetailService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
    @InjectModel(AppointmentDetail.name)
    private readonly appointmentDetailModel: Model<AppointmentDetailDocument>,
    @InjectModel(ReExamSchedule.name)
    private readonly reExamScheduleModel: Model<ReExamScheduleDocument>,
    @InjectModel(MedicalRecord.name)
    private readonly medicalRecordModel: Model<MedicalRecordDocument>,
    @InjectModel(Doctor.name)
    private readonly doctorModel: Model<DoctorDocument>,
    @InjectModel(Specialization.name)
    private readonly specModel: Model<SpecializationDocument>,
    private readonly notificationService: NotificationService
  ) {}

  async findDetailsByDate(date: string, account: Account) {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setDate(endOfDay.getDate() + 1);

    return this.appointmentDetailModel.aggregate([
      {
        $lookup: {
          from: 'appointments',
          localField: 'appointment_id',
          foreignField: '_id',
          as: 'appointment',
        },
      },
      {
        $addFields: {
          appointment: { $arrayElemAt: ['$appointment', 0] },
        },
      },
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
                account: { $arrayElemAt: ['$account', 0] },
              },
            },
            {
              $project: {
                'account.password': 0,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          doctor: { $arrayElemAt: ['$doctor', 0] },
        },
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
      {
        $match: {
          'appointment.appointment_date': {
            $gte: startOfDay,
            $lt: endOfDay,
          },
          'appointment.patient_id': account._id,
        },
      },
    ]);
  }

  async findAll() {
    return this.appointmentDetailModel
      .find()
      .populate('appointment_id')
      .populate('doctor_id')
      .populate('specialization_id')
      .exec();
  }

  private async appendMedicalRecordToSheet(record: {
    symptoms: string;
    diagnosis: string;
    specialization: string;
  }) {
    const credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64!, 'base64').toString(
        'utf-8'
      )
    );

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.AI_SPREADSHEET_ID!;
    const range = 'Sheet1!A2:C'; // A: patient_problem, B: diagnosis, C: specialization (en)

    const specializationEn =
      specializationMapping[record.specialization] || record.specialization;

    const translatedSymptoms = await translateText(record.symptoms);
    const translatedDiagnosis = await translateText(record.diagnosis);

    // console.log(
    //   `Appending to sheet: Symptoms: ${translatedSymptoms}, Diagnosis: ${translatedDiagnosis}, Specialization: ${specializationEn}`
    // );

    const row = [translatedSymptoms, translatedDiagnosis, specializationEn];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });
  }

  async updateAppointmentDetail(
    dto: UpdateAppointmentDetailRequest,
    accountId: string
  ) {
    const doctor = await this.doctorModel.findOne({
      account_id: accountId,
    });
    if (!doctor) {
      throw new Error('Không tìm thấy bác sĩ');
    }
    const spec = await this.specModel.findById(doctor.specialization_id);
    // Cập nhật các trường cơ bản của AppointmentDetail nếu cần
    await this.appointmentModel.updateOne(
      { _id: dto.appointment_id },
      {
        predicted_disease: dto.predicted_disease,
      }
    );

    // Build mapping diagnosis -> medicalRecordId
    const diagnosisToId: Record<string, string> = {};

    // Xử lý MedicalRecords
    const medicalRecordIds: string[] = [];
    for (const record of dto.medicalrecords) {
      if (record._id) {
        // Update
        await this.medicalRecordModel.updateOne(
          { _id: record._id },
          {
            diagnosis: record.diagnosis,
            prescription: record.prescription,
            note: record.note,
          }
        );
        medicalRecordIds.push(record._id);
        diagnosisToId[record.diagnosis] = record._id;
      } else {
        // Create
        const created = await this.medicalRecordModel.create({
          appointment_id: dto.appointment_id,
          patient_id: dto.patient_id,
          doctor_id: doctor._id,
          symptoms: dto.symptoms,
          diagnosis: record.diagnosis,
          prescription: record.prescription,
          note: record.note,
        });
        medicalRecordIds.push(created._id);
        diagnosisToId[record.diagnosis] = created._id;

        await this.appendMedicalRecordToSheet({
          symptoms: dto.symptoms,
          diagnosis: record.diagnosis,
          specialization: spec.name,
        });
      }
    }

    // Xử lý ReExamSchedules
    const reExamIds: string[] = [];
    for (const reExam of dto.reexamschedules) {
      // Tìm medical_record_id theo diagnosis
      const medical_record_id = diagnosisToId[reExam.diagnosis];

      if (reExam._id) {
        // Update
        await this.reExamScheduleModel.updateOne(
          { _id: reExam._id },
          {
            medical_record_id,
            re_exam_date: reExam.re_exam_date,
            note: reExam.note,
          }
        );
        reExamIds.push(reExam._id);
      } else {
        // Create
        const created = await this.reExamScheduleModel.create({
          parent_appointment_id: dto.appointment_id,
          doctor_id: doctor._id,
          medical_record_id,
          re_exam_date: reExam.re_exam_date,
          note: reExam.note,
          price: 0,
          isPaid: false,
        });
        reExamIds.push(created._id);

        // Tạo notification nhắc tái khám cho bệnh nhân
        await this.notificationService.createNotification({
          title: 'Nhắc lịch tái khám',
          status: false,
          image: NotificationTypeImageEnum.re_exam_reminder,
          account_id: dto.patient_id,
          content: `Bạn có lịch tái khám vào ngày ${reExam.re_exam_date}.`,
          type: NotificationTypeEnum.RE_EXAM,
          idTO: created._id,
        });
      }
    }

    return { message: 'Cập nhật thành công' };
  }
}
