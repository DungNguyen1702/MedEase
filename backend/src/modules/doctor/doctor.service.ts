import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AppointmentDetailDocument,
  DoctorDocument,
  type Account,
  type AppointmentDocument,
} from '../../schemas';
import { AppointmentStatus, ExaminationStatusEnum } from '../../common/enums';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel('Doctor')
    private readonly doctorModel: Model<DoctorDocument>,
    @InjectModel('AppointmentDetail')
    private readonly appointmentDetailModel: Model<AppointmentDetailDocument>,
    @InjectModel('Appointment')
    private readonly appointmentModel: Model<AppointmentDocument>
  ) {}

  async getCurrentNumber(id: string) {
    const appointmentDetails = await this.appointmentDetailModel.aggregate([
      {
        $match: {
          doctor_id: id,
          examStatus: ExaminationStatusEnum.IN_PROGRESS,
        },
      },
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
    ]);

    return appointmentDetails.length > 0
      ? appointmentDetails[0].appointment.number
      : 0;
  }

  async getDoctorRoom(id: string, date: string) {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setDate(endOfDay.getDate() + 1);

    return this.doctorModel.aggregate([
      {
        $match: { _id: id },
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
          specialization: { $arrayElemAt: ['$specialization', 0] },
        },
      },
      {
        $lookup: {
          from: 'appointmentdetails',
          localField: '_id',
          foreignField: 'doctor_id',
          as: 'appointmentDetails',
          pipeline: [
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
              $match: {
                'appointment.appointment_date': {
                  $gte: startOfDay,
                  $lt: endOfDay,
                },
              },
            },
          ],
        },
      },
    ]);
  }

  async getExaminedPatients(date: string, currentAccount: Account) {
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
          doctor_id: currentAccount._id,
        },
      },
    ]);
  }

  async getAllDoctors() {
    return this.doctorModel.aggregate([
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
        $project: {
          'account.password': 0,
        },
      },
    ]);
  }

  async getDoctorRoomData(accountId: string, date: string) {
    // Tìm bác sĩ theo accountId
    const doctor = await this.doctorModel.findOne({ account_id: accountId });
    if (!doctor) {
      throw new Error('Không tìm thấy bác sĩ');
    }
    const doctorId = doctor._id;

    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Lấy tất cả appointmentDetails của bác sĩ trong ngày
    const appointmentDetails = await this.appointmentDetailModel.aggregate([
      {
        $match: {
          doctor_id: doctorId,
        },
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
        $match: {
          'appointment.appointment_date': {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        },
      },
      {
        $lookup: {
          from: 'accounts',
          localField: 'appointment.patient_id',
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
      {
        $sort: { 'appointment.time': 1 },
      },
    ]);

    // Tổng số lịch hẹn trong ngày
    const total = appointmentDetails.length;

    // Số lịch hẹn chưa hoàn thành (examStatus != 'examined')
    const notFinished = appointmentDetails.filter(
      item => item.examStatus !== ExaminationStatusEnum.EXAMINED
    ).length;

    // Số thứ tự hiện tại (lịch hẹn đang IN_PROGRESS)
    const current = appointmentDetails.find(
      item => item.examStatus === ExaminationStatusEnum.IN_PROGRESS
    );
    const currentNum = current ? current.appointment.number : 0;

    return {
      appointmentNum: {
        total,
        notFinished,
      },
      currentNum,
      appointmentDetails,
    };
  }

  async nextNumber(accountId: string, date: string) {
    // Tìm bác sĩ theo accountId
    const doctor = await this.doctorModel.findOne({ account_id: accountId });
    if (!doctor) throw new BadRequestException('Không tìm thấy bác sĩ');
    const doctorId = doctor._id;

    // Tìm appointmentDetail đang IN_PROGRESS trong ngày
    const inProgressArr = await this.appointmentDetailModel.aggregate([
      {
        $match: {
          doctor_id: doctorId,
          examStatus: ExaminationStatusEnum.IN_PROGRESS,
        },
      },
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
    ]);
    const inProgress = inProgressArr[0];

    console.log('inProgress', inProgress);

    // Nếu không có IN_PROGRESS, tìm lịch hẹn WAIT đầu tiên trong ngày
    if (!inProgress) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const nextDetail = await this.appointmentDetailModel.aggregate([
        {
          $match: {
            doctor_id: doctorId,
            examStatus: ExaminationStatusEnum.NOT_EXAMINED,
          },
        },
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
          $match: {
            'appointment.appointment_date': {
              $gte: startOfDay,
              $lt: endOfDay,
            },
          },
        },
        {
          $sort: { time: 1 },
        },
      ]);

      if (nextDetail && nextDetail.length > 0 && nextDetail[0].appointment) {
        nextDetail[0].examStatus = ExaminationStatusEnum.IN_PROGRESS;
        await this.appointmentDetailModel.updateOne(
          { _id: nextDetail[0]._id },
          { examStatus: ExaminationStatusEnum.IN_PROGRESS }
        );
        return {
          message: 'Bắt đầu số đầu tiên trong ngày',
          appointmentDetailId: nextDetail[0]._id,
          number: nextDetail[0].appointment.number,
        };
      } else {
        throw new BadRequestException('Không còn số để bấm');
      }
    }

    await this.appointmentDetailModel.updateOne(
      { _id: inProgress._id },
      { examStatus: ExaminationStatusEnum.EXAMINED }
    );

    
    // Kiểm tra nếu tất cả appointmentDetail của appointment này đã EXAMINED thì chuyển appointment sang DONE
    const appointmentId = inProgress.appointment._id;
    const countNotExamined = await this.appointmentDetailModel.countDocuments({
      appointment_id: appointmentId,
      examStatus: { $ne: ExaminationStatusEnum.EXAMINED },
    });
    console.log('countNotExamined', countNotExamined);
    if (countNotExamined === 0) {
      console.log('appointmentId', appointmentId);
      const newApp = await this.appointmentModel.updateOne(
        { _id: appointmentId },
        { status: AppointmentStatus.DONE }
      );
      console.log('newApp', newApp);
    }

    // Tìm appointmentDetail tiếp theo (status = WAIT) trong ngày, theo thứ tự thời gian
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const nextArr = await this.appointmentDetailModel.aggregate([
      {
        $match: {
          doctor_id: doctorId,
          examStatus: ExaminationStatusEnum.NOT_EXAMINED, // hoặc NOT_EXAMINED nếu bạn dùng enum này
        },
      },
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
        $match: {
          'appointment.appointment_date': { $gte: startOfDay, $lt: endOfDay },
        },
      },
      {
        $sort: { time: 1 },
      },
    ]);
    const nextDetail = nextArr[0];

    if (nextDetail && nextDetail.appointment_id) {
      nextDetail.examStatus = ExaminationStatusEnum.IN_PROGRESS;
      await this.appointmentDetailModel.updateOne(
        { _id: nextDetail._id },
        { examStatus: ExaminationStatusEnum.IN_PROGRESS }
      );
      return {
        message: 'Chuyển sang số tiếp theo thành công',
        appointmentDetailId: nextDetail._id,
        number: nextDetail.appointment.number,
      };
    }

    return { message: 'Đã hoàn thành tất cả lịch hẹn trong ngày' };
  }
}
