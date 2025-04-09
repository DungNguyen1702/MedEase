export * from './account.schema';
export * from './answer.schema';
export * from './appointment.schema';
export * from './doctor.schema';
export * from './medical-record.schema';
export * from './notification.schema';
export * from './question.schema';
export * from './re-exam-schedule.schema';
export * from './specialization.schema';
export * from './appointment-detail.schema';

import { Account, AccountSchema } from './account.schema';
import { Answer, AnswerSchema } from './answer.schema';
import { Appointment, AppointmentSchema } from './appointment.schema';
import { AppointmentDetail, AppointmentDetailSchema } from './appointment-detail.schema';
import { Doctor, DoctorSchema } from './doctor.schema';
import { MedicalRecord, MedicalRecordSchema } from './medical-record.schema';
import { Notification, NotificationSchema } from './notification.schema';
import { Question, QuestionSchema } from './question.schema';
import { ReExamSchedule, ReExamScheduleSchema } from './re-exam-schedule.schema';
import { Specialization, SpecializationSchema } from './specialization.schema';

export const allSchemas = [
  { name : Account.name, schema: AccountSchema },
  { name : Answer.name, schema: AnswerSchema },
  { name : Appointment.name, schema: AppointmentSchema },
  { name : AppointmentDetail.name, schema: AppointmentDetailSchema },
  { name : Doctor.name, schema: DoctorSchema },
  { name : MedicalRecord.name, schema: MedicalRecordSchema },
  { name : Notification.name, schema: NotificationSchema },
  { name : Question.name, schema: QuestionSchema },
  { name : ReExamSchedule.name, schema: ReExamScheduleSchema },
  { name : Specialization.name, schema: SpecializationSchema },
  // Add other schemas here as needed
]