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
  APPOINTMENT_CREATED = 'appointment_created',
  APPOINTMENT_UPDATED = 'appointment_updated',
  APPOINTMENT_CANCELED = 'appointment_canceled',
  APPOINTMENT_REMINDER = 'appointment_reminder',
  MEDICAL_RECORD_READY = 'medical_record_ready',
  RE_EXAM_REMINDER = 're_exam_reminder',
  QUESTION_ANSWERED = 'question_answered',
  ORDER_CONFIRMED = 'order_confirmed',
  ORDER_SHIPPED = 'order_shipped',
  ORDER_DELIVERED = 'order_delivered',
  ORDER_CANCELED = 'order_canceled',
  PAYMENT_SUCCESS = 'payment_success',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
  DOCTOR_ASSIGNED = 'doctor_assigned',
  PRESCRIPTION_READY = 'prescription_ready',
  NEW_MEDICINE_AVAILABLE = 'new_medicine_available',
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
  NEW_EXAMINATION = 'new_examination',
  RE_EXAMINATION = 're_examination',
  HEALTH_CHECKUP = 'health_checkup',
}

export enum OrderPaymentMethodEnum {
  MOMO = 'momo',
  CASH = 'cash',
  ZALOPAY = 'zalopay',
}