export enum AccountGenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export enum AccountRoleEnum {
  DOCTOR = 'doctor',
  PATIENT = 'patient',
  ADMIN = 'admin',
}

export enum AppointmentStatus {
  CANCEL = 'cancel',
  WAIT = 'wait',
  DONE = 'done',
}

export enum OrderStatusEnum {
  PROCESSING = 'processing',
  RECEIVED = 'received',
  CANCEL = 'cancel',
}

export enum NotificationTypeEnum {
  APPOINTMENT = 'appointment',
  RE_EXAM = 're_exam',
  QUESTION_ANSWERED = 'question_answered',
  PAYMENT = 'payment',
}

export enum NotificationTypeImageEnum {
  appointment_created = 'https://res.cloudinary.com/deei5izfg/image/upload/v1744538151/MedEase/Notification/appointment_created_fkdwuh.png',
  appointment_updated = 'https://res.cloudinary.com/deei5izfg/image/upload/v1744538335/MedEase/Notification/appointment_updated_qyegry.png',
  appointment_canceled = 'https://res.cloudinary.com/deei5izfg/image/upload/v1744025306/MedEase/Notification/appointment_cancel_oqofgx.png',
  appointment_reminder = 'https://res.cloudinary.com/deei5izfg/image/upload/v1744025306/MedEase/Notification/appointment_zrnhhq.png',
  re_exam_reminder = 'https://res.cloudinary.com/deei5izfg/image/upload/v1744025307/MedEase/Notification/reminder_xkuhhr.png',
  question_answered = 'https://res.cloudinary.com/deei5izfg/image/upload/v1744025306/MedEase/Notification/question-answer_mymixf.png',
  payment_success = 'https://res.cloudinary.com/deei5izfg/image/upload/v1744025306/MedEase/Notification/payment_hlbopr.png',
}

export enum DoctorPositionEnum {
  GENERAL_DOCTOR = 'general_doctor',
  HEAD_OF_DEPARTMENT = 'head_of_department',
  PROFESSOR = 'professor',
  ASSOCIATE_PROFESSOR = 'associate_professor',
  SENIOR_DOCTOR = 'senior_doctor',
  RESIDENT_DOCTOR = 'resident_doctor',
  INTERN_DOCTOR = 'intern_doctor',
}

export enum AppointmentTypeEnum {
  GENERAL_CONSULTATION = 'general_consultation',
  SPECIALIST_CONSULTATION = 'specialist_consultation',
  RE_EXAMINATION = 're_examination',
  HEALTH_CHECKUP = 'health_checkup',
}

export enum OrderPaymentMethodEnum {
  MOMO = 'momo',
  CASH = 'cash',
  ZALOPAY = 'zalopay',
}

export enum ExaminationStatusEnum {
  EXAMINED = 'examined',
  NOT_EXAMINED = 'not_examined',
  IN_PROGRESS = 'in_progress',
}
