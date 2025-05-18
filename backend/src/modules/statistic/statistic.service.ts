import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
import { Model } from 'mongoose';
import {
  AccountDocument,
  AppointmentDetailDocument,
  AppointmentDocument,
  DoctorDocument,
  QuestionDocument,
  SpecializationDocument,
} from '../../schemas';
import { AccountRoleEnum, AppointmentStatus } from '../../common/enums';
import { QuestionAnswerService } from '../question-answer/question-answer.service';

@Injectable()
export class StatisticService {
  constructor(
    @InjectModel('AppointmentDetail')
    private appointmentDetailModel: Model<AppointmentDetailDocument>,
    @InjectModel('Appointment')
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel('Doctor')
    private doctorModel: Model<DoctorDocument>,
    @InjectModel('Specialization')
    private specializationModel: Model<SpecializationDocument>,
    @InjectModel('Account')
    private accountModel: Model<AccountDocument>,
    @InjectModel('Question')
    private questionModel: Model<QuestionDocument>,
    private readonly questionService: QuestionAnswerService
  ) {}

  async getAdminStatistic() {
    // Tổng số bệnh nhân
    const patientNum = await this.accountModel.countDocuments({
      role: AccountRoleEnum.PATIENT,
    });
    // Số bệnh nhân mới hôm nay
    const today = dayjs().startOf('day').toDate();
    const tomorrow = dayjs().add(1, 'day').startOf('day').toDate();
    const todayPatientNum = await this.accountModel.countDocuments({
      role: AccountRoleEnum.PATIENT,
      createdAt: { $gte: today, $lt: tomorrow },
    });

    // Tổng số bác sĩ
    const doctorNum = await this.accountModel.countDocuments({
      role: AccountRoleEnum.DOCTOR,
    });
    // Số bác sĩ mới trong tuần này
    const weekStart = dayjs().startOf('week').toDate();
    const weekDoctorNum = await this.accountModel.countDocuments({
      role: AccountRoleEnum.DOCTOR,
      createdAt: { $gte: weekStart },
    });

    // Tổng số cuộc hẹn
    const appointmentNum = await this.appointmentModel.countDocuments();
    // Số cuộc hẹn đang chờ xử lý
    const pendingAppointmentNum = await this.appointmentModel.countDocuments({
      status: AppointmentStatus.WAIT,
    });

    // Pie chart: Thống kê loại khám
    const pieRaw = await this.appointmentModel.aggregate([
      {
        $group: {
          _id: '$type',
          value: { $sum: 1 },
        },
      },
    ]);
    // Map sang dạng { type, value }
    const pieData = pieRaw.map(item => ({
      type: item._id,
      value: item.value,
    }));

    // Line chart: Số bệnh nhân theo tháng
    const year = dayjs().year();
    const lineData = [];
    for (let i = 0; i < 12; i++) {
      const monthStart = dayjs(`${year}-${i + 1}-01`)
        .startOf('month')
        .toDate();
      const monthEnd = dayjs(`${year}-${i + 1}-01`)
        .endOf('month')
        .toDate();
      const patients = await this.appointmentModel.countDocuments({
        appointment_date: { $gte: monthStart, $lte: monthEnd },
      });
      lineData.push({
        month: `Tháng ${i + 1}`,
        patients,
      });
    }

    // Lấy 10 cuộc hẹn gần đây nhất (mới nhất trước)
    const recentAppointments = await this.appointmentDetailModel.aggregate([
      {
        $lookup: {
          from: 'appointments',
          localField: 'appointment_id',
          foreignField: '_id',
          as: 'appointment',
          pipeline: [
            {
              $lookup: {
                from: 'accounts',
                localField: 'patient_id',
                foreignField: '_id',
                as: 'patient',
              },
            },
            {
              $addFields: {
                patient: { $arrayElemAt: ['$patient', 0] },
              },
            },
            {
              $project: {
                'patient.password': 0,
              },
            },
          ],
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
        $sort: { 'appointment.appointment_date': -1 },
      },
      // {
      //   $limit: 10,
      // },
    ]);

    return {
      patientNum: { num: patientNum, today: todayPatientNum },
      doctorNum: { num: doctorNum, week: weekDoctorNum },
      appointmentNum: { num: appointmentNum, pending: pendingAppointmentNum },
      recentAppointments, // đổi từ todayAppointment sang recentAppointments
      pieData,
      lineData,
    };
  }

  async getDoctorDashboardStatistic(accountId: string) {
    const doctor = await this.doctorModel.findOne({ account_id: accountId });
    if (!doctor) throw new Error('Không tìm thấy bác sĩ');
    const doctorId = doctor._id;

    // Lấy tất cả appointment detail của bác sĩ này
    const appointmentDetails = await this.appointmentDetailModel.aggregate([
      {
        $match: { doctor_id: doctorId },
      },
      {
        $lookup: {
          from: 'appointments',
          localField: 'appointment_id',
          foreignField: '_id',
          as: 'appointment',
          pipeline: [
            {
              $lookup: {
                from: 'accounts',
                localField: 'patient_id',
                foreignField: '_id',
                as: 'patient',
              },
            },
            {
              $addFields: {
                patient: { $arrayElemAt: ['$patient', 0] },
              },
            },
            {
              $project: {
                'patient.password': 0,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          appointment: { $arrayElemAt: ['$appointment', 0] },
        },
      },
      {
        $sort: { 'appointment.appointment_date': -1 },
      },
    ]);

    // Số cuộc hẹn hôm nay của bác sĩ
    const today = dayjs().startOf('day').toDate();
    const tomorrow = dayjs().add(1, 'day').startOf('day').toDate();
    const todayAppointment = appointmentDetails.filter(
      item =>
        item.appointment &&
        item.appointment.appointment_date >= today &&
        item.appointment.appointment_date < tomorrow
    );

    // Tổng số cuộc hẹn của bác sĩ
    const totalAppointmentNum = appointmentDetails.length;
    const todayAppointmentNum = todayAppointment.length;

    // Danh sách câu hỏi liên quan đến bác sĩ này
    const questionList = await this.questionService.getAllQuestion();

    // Tổng số cuộc hẹn và câu hỏi
    const total = {
      appointment: todayAppointmentNum,
      question: questionList.length,
    };

    // Thống kê tuần này
    const weekStart = dayjs().startOf('week');
    const weekData: any[] = [];
    for (let i = 0; i < 7; i++) {
      const date = weekStart.add(i, 'day');
      const dateStr = date.format('YYYY-MM-DD');
      const dayOfWeek = [
        'Chủ Nhật',
        'Thứ Hai',
        'Thứ Ba',
        'Thứ Tư',
        'Thứ Năm',
        'Thứ Sáu',
        'Thứ Bảy',
      ][date.day()];
      const patientNum = appointmentDetails.filter(
        item =>
          item.appointment &&
          dayjs(item.appointment.appointment_date).format('YYYY-MM-DD') ===
            dateStr
      ).length;
      const examinedPatientNum = appointmentDetails.filter(
        item =>
          item.appointment &&
          dayjs(item.appointment.appointment_date).format('YYYY-MM-DD') ===
            dateStr &&
          item.examStatus === 'examined'
      ).length;
      weekData.push({
        date: dateStr,
        dayOfWeek,
        patientNum,
        examinedPatientNum,
      });
    }

    return {
      todayAppointmentNum,
      totalAppointmentNum,
      appointmentList: todayAppointment,
      questionList,
      total,
      weekData, // Thêm dữ liệu tuần vào kết quả trả về
    };
  }
}
