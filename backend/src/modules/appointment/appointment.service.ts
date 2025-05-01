import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AppointmentDocument,
  Account,
  AppointmentDetailDocument,
  DoctorDocument,
  ReExamScheduleDocument,
} from '../../schemas';
import * as moment from 'moment';
import { AppointmentRequest } from './dtos/AppointmentRequest';
import {
  AppointmentStatus,
  AppointmentTypeEnum,
  ExaminationStatusEnum,
} from '../../common/enums';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel('Appointment')
    private readonly appointmentModel: Model<AppointmentDocument>,
    @InjectModel('AppointmentDetail')
    private readonly appointmentDetailModel: Model<AppointmentDetailDocument>,
    @InjectModel('Doctor')
    private readonly doctorModel: Model<DoctorDocument>,
    @InjectModel('ReExamSchedule')
    private readonly reExamScheduleModel: Model<ReExamScheduleDocument>
  ) {}

  async getAppointmentById(currentAccount: Account) {
    return this.appointmentModel.aggregate([
      {
        $match: {
          patient_id: currentAccount._id,
        },
      },
      {
        $lookup: {
          from: 'appointmentdetails',
          localField: '_id',
          foreignField: 'appointment_id',
          as: 'appointment_detail',
          pipeline: [
            {
              $lookup: {
                from: 'doctors',
                localField: 'doctor_id',
                foreignField: '_id',
                as: 'doctor',
              },
            },
          ],
        },
      },
      {
        $addFields: {
          minTime: { $min: '$appointment_detail.time' }, // Lấy thời gian nhỏ nhất
          maxTime: { $max: '$appointment_detail.time' }, // Lấy thời gian lớn nhất
          time: {
            $concat: [
              { $toString: { $min: '$appointment_detail.time' } }, // Thời gian nhỏ nhất
              ' - ',
              { $toString: { $max: '$appointment_detail.time' } }, // Thời gian lớn nhất
            ],
          },
        },
      },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctor_id',
          foreignField: '_id',
          as: 'doctor',
        },
      },
      {
        $addFields: {
          doctor: { $arrayElemAt: ['$doctor', 0] },
        },
      },
    ]);
  }

  async getAppointmentDetail(currentAccount: Account, id: string) {
    const aggregateDoctor = [
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
          ],
        },
      },
      {
        $addFields: {
          doctor: { $arrayElemAt: ['$doctor', 0] },
        },
      },
    ];

    const aggregateReExam = [
      {
        $lookup: {
          from: 'reexamschedules',
          localField: '_id',
          foreignField: 'parent_appointment_id',
          as: 're-exam',
          pipeline: [...aggregateDoctor],
        },
      },
    ];

    const aggregateAppointment = [
      {
        $lookup: {
          from: 'appointments',
          localField: 'appointment_id',
          foreignField: '_id',
          as: 'appointment',
          pipeline: [...aggregateReExam],
        },
      },
      {
        $addFields: {
          appointment: { $arrayElemAt: ['$appointment', 0] },
        },
      },
    ];

    const aggregateSpecialization = [
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
    ];

    return this.appointmentModel.aggregate([
      {
        $match: {
          _id: id,
          patient_id: currentAccount._id,
        },
      },

      // appointment-detail
      {
        $lookup: {
          from: 'appointmentdetails',
          localField: '_id',
          foreignField: 'appointment_id',
          as: 'appointment_detail',
          pipeline: [
            ...aggregateDoctor,
            ...aggregateSpecialization,
            ...aggregateAppointment,
          ],
        },
      },

      // medical_record
      {
        $lookup: {
          from: 'medicalrecords',
          localField: '_id',
          foreignField: 'appointment_id',
          as: 'medical_record',
          pipeline: [...aggregateDoctor, ...aggregateAppointment],
        },
      },

      // re-exam
      ...aggregateReExam,

      // start-time
      {
        $addFields: {
          start_time: {
            $min: '$appointment_detail.time', // Lấy giá trị nhỏ nhất từ trường time trong appointment_detail
          },
        },
      },
    ]);
  }

  async getAppointmentNum(currentAccount: Account) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(today.getDate()).padStart(2, '0');

    const currentDate = `${year}-${month}-${day}`;

    const appoinmentToday = await this.appointmentModel.aggregate([
      {
        $match: {
          patient_id: currentAccount._id,
          appointment_date: currentDate,
        },
      },
    ]);
    const appointmentTotal = await this.appointmentModel.aggregate([
      {
        $match: {
          patient_id: currentAccount._id,
        },
      },
    ]);

    return {
      appointmentToday: appoinmentToday.length,
      appointmentTotal: appointmentTotal.length,
    };
  }

  async getAppoinemtmentDetailPayment(
    currentAccount: Account,
    paymentCode: string,
    paymentType: string
  ) {
    // console.log(paymentCode, paymentType);

    const aggregateDoctor = [
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
          ],
        },
      },
      {
        $addFields: {
          doctor: { $arrayElemAt: ['$doctor', 0] },
        },
      },
    ];

    const aggregateReExam = [
      {
        $lookup: {
          from: 'reexamschedules',
          localField: '_id',
          foreignField: 'parent_appointment_id',
          as: 're-exam',
          pipeline: [...aggregateDoctor],
        },
      },
    ];

    const aggregateAppointment = [
      {
        $lookup: {
          from: 'appointments',
          localField: 'appointment_id',
          foreignField: '_id',
          as: 'appointment',
          pipeline: [...aggregateReExam],
        },
      },
      {
        $addFields: {
          appointment: { $arrayElemAt: ['$appointment', 0] },
        },
      },
    ];

    const aggregateSpecialization = [
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
    ];

    return this.appointmentModel.aggregate([
      {
        $match: {
          paymentCode: paymentCode,
          paymentMethod: paymentType,
          patient_id: currentAccount._id,
        },
      },

      // appointment-detail
      {
        $lookup: {
          from: 'appointmentdetails',
          localField: '_id',
          foreignField: 'appointment_id',
          as: 'appointment_detail',
          pipeline: [
            ...aggregateDoctor,
            ...aggregateSpecialization,
            ...aggregateAppointment,
          ],
        },
      },

      // medical_record
      {
        $lookup: {
          from: 'medicalrecords',
          localField: '_id',
          foreignField: 'appointment_id',
          as: 'medical_record',
          pipeline: [...aggregateDoctor, ...aggregateAppointment],
        },
      },

      // re-exam
      ...aggregateReExam,

      // start-time
      {
        $addFields: {
          start_time: {
            $min: '$appointment_detail.time', // Lấy giá trị nhỏ nhất từ trường time trong appointment_detail
          },
        },
      },
    ]);
  }

  async createAppointment(currentAccount: Account, body: AppointmentRequest) {
    const {
      title,
      appointment_date,
      time,
      type,
      symptoms,
      predicted_disease,
      appointment_detail,
      paymentMethod,
      paymentCode,
      createdBy,
      totalPrice,
      isPaid,
      re_exam_id,
    } = body;

    const currentTime = moment(
      `${appointment_date} ${time}`,
      'YYYY-MM-DD HH:mm'
    );

    const appointmentDetailsToSave = [];

    for (const detail of appointment_detail) {
      const { specialization_id, doctor_id, price } = detail;

      const { assignedDoctor, assignedTime } = await this.checkAndAssignDoctor(
        doctor_id,
        specialization_id,
        appointment_date,
        currentTime.clone()
      );

      appointmentDetailsToSave.push({
        specialization_id,
        doctor_id: assignedDoctor._id,
        time: assignedTime.format('HH:mm'),
        address: assignedDoctor.room,
        price,
        examStatus: ExaminationStatusEnum.NOT_EXAMINED,
        description: '',
      });

      // Cập nhật currentTime sau khi xếp lịch cho bác sĩ
      const duration = moment.duration(assignedDoctor.base_time);
      const baseTimeInMinutes = duration.asMinutes();
      currentTime.add(baseTimeInMinutes, 'minutes');
    }

    // Sau khi tất cả các chi tiết lịch hẹn được xếp thành công, tạo appointment
    const appointment = new this.appointmentModel({
      patient_id: currentAccount._id,
      title,
      status: AppointmentStatus.WAIT,
      appointment_date: new Date(appointment_date),
      symptoms,
      predicted_disease,
      paymentCode,
      paymentMethod,
      reasonCancel: null,
      isPaid: isPaid ? true : false,
      price: totalPrice,
      type,
      createdBy,
    });

    await appointment.save();

    // Lưu tất cả các chi tiết lịch hẹn vào cơ sở dữ liệu
    for (const detail of appointmentDetailsToSave) {
      const appointmentDetail = new this.appointmentDetailModel({
        ...detail,
        appointment_id: appointment._id,
      });
      await appointmentDetail.save();
    }

    // Đếm số lượng appointment đã có trong ngày
    const appointmentsInDay = await this.appointmentModel.countDocuments({
      appointment_date: new Date(appointment_date),
    });

    // Gán giá trị cho appointment.number
    appointment.number = appointmentsInDay + 1;

    await appointment.save();

    // Nếu có lịch tái khám, tạo lịch tái khám
    if (re_exam_id && type === AppointmentTypeEnum.RE_EXAMINATION) {
      await this.reExamScheduleModel.findByIdAndUpdate(
        re_exam_id, // ID của tài liệu cần cập nhật
        { $set: { appointment_id: appointment._id } } // Cập nhật trường appointment_id
      );
    }

    return appointment;
  }

  private async isDoctorBusy(
    doctor_id: string,
    date: string,
    time: moment.Moment,
    base_time: string
  ) {
    const appointmentDetails = await this.appointmentDetailModel.find({
      doctor_id,
      appointment_id: {
        $in: await this.appointmentModel.distinct('_id', {
          appointment_date: new Date(date),
        }),
      },
    });

    // Chuyển đổi base_time từ "HH:mm" sang số phút
    const duration = moment.duration(base_time);
    const baseTimeInMinutes = duration.asMinutes();

    for (const detail of appointmentDetails) {
      const startTime = moment(`${date} ${detail.time}`, 'YYYY-MM-DD HH:mm');
      const endTime = startTime.clone().add(baseTimeInMinutes, 'minutes');

      if (time.isBetween(startTime, endTime, undefined, '[)')) {
        return true;
      }
    }

    return false;
  }

  async checkAndAssignDoctor(
    doctor_id: string | null,
    specialization_id: string,
    appointment_date: string,
    currentTime: moment.Moment
  ): Promise<{ assignedDoctor: any; assignedTime: moment.Moment }> {
    const morningStart = moment(`${appointment_date} 8:00`, 'YYYY-MM-DD HH:mm');

    const morningEnd = moment(`${appointment_date} 12:00`, 'YYYY-MM-DD HH:mm');
    const afternoonStart = moment(
      `${appointment_date} 13:00`,
      'YYYY-MM-DD HH:mm'
    );
    const afternoonEnd = moment(
      `${appointment_date} 17:00`,
      'YYYY-MM-DD HH:mm'
    );

    let assignedDoctor = null;
    let assignedTime = null;

    if (doctor_id) {
      while (!assignedDoctor) {
        const doctor = await this.doctorModel.aggregate([
          {
            $match: { _id: doctor_id },
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
            },
          },
        ]);

        if (!doctor || doctor.length === 0) {
          throw new Error(`Không tìm thấy bác sĩ với ID: ${doctor_id}`);
        }

        const isBusy = await this.isDoctorBusy(
          doctor_id,
          appointment_date,
          currentTime.clone(),
          doctor[0].base_time
        );

        if (isBusy) {
          const duration = moment.duration(doctor[0].base_time);
          const baseTimeInMinutes = duration.asMinutes();

          currentTime.add(baseTimeInMinutes, 'minutes');

          let endTime = currentTime.clone().add(baseTimeInMinutes, 'minutes');

          if (
            endTime.isSameOrAfter(morningEnd) &&
            endTime.isBefore(afternoonStart)
          ) {
            currentTime.set({
              hour: 13,
              minute: 0,
              second: 0,
              millisecond: 0,
            });

            endTime = currentTime.clone().add(baseTimeInMinutes, 'minutes');
          }

          if (
            !(
              endTime.isBetween(morningStart, morningEnd, undefined, '[)') ||
              endTime.isBetween(afternoonStart, afternoonEnd, undefined, '[)')
            )
          ) {
            throw new Error(
              `Lịch bác sĩ ${doctor[0].account.name} không phù hợp, vui lòng chọn bác sĩ khác.`
            );
          }

          continue;
        }

        assignedDoctor = doctor[0];
        assignedTime = currentTime.clone();
      }
    } else {
      const doctors = await this.doctorModel.find({ specialization_id });

      while (!assignedDoctor) {
        for (const doctor of doctors) {
          const isBusy = await this.isDoctorBusy(
            doctor._id,
            appointment_date,
            currentTime.clone(),
            doctor.base_time
          );

          if (!isBusy) {
            assignedDoctor = doctor;
            assignedTime = currentTime.clone();
            break;
          }
        }

        if (!assignedDoctor) {
          const duration = moment.duration(doctors[0].base_time);
          const baseTimeInMinutes = duration.asMinutes();

          currentTime.add(baseTimeInMinutes, 'minutes');

          let endTime = currentTime.clone().add(baseTimeInMinutes, 'minutes');

          if (
            endTime.isSameOrAfter(morningEnd) &&
            endTime.isBefore(afternoonStart)
          ) {
            currentTime.set({
              hour: 13,
              minute: 0,
              second: 0,
              millisecond: 0,
            });

            endTime = currentTime.clone().add(baseTimeInMinutes, 'minutes');
          }

          if (
            !(
              endTime.isBetween(morningEnd, afternoonStart, undefined, '[)') ||
              endTime.isBetween(afternoonStart, afternoonEnd, undefined, '[)')
            )
          ) {
            throw new Error(
              'Không thể xếp được lịch phù hợp trong giờ hành chính.'
            );
          }
        }
      }
    }

    return { assignedDoctor, assignedTime };
  }
}
