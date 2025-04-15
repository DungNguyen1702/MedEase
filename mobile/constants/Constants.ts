export const DoctorPosition = {
  general_doctor: "Bác sĩ đa khoa",
  head_of_department: "Trưởng khoa",
  professor: "Giáo sư",
  associate_professor: "Phó giáo sư",
  senior_doctor: "Bác sĩ cao cấp",
  resident_doctor: "Bác sĩ nội trú",
  intern_doctor: "Bác sĩ thực tập",
};
export const OrderPaymentMethod = {
  momo: "Momo",
  cash: "Tiền mặt",
  zalopay: "zalopay",
};
export const DoctorFeePercentageByPosition = {
  general_doctor: 60,
  head_of_department: 80,
  professor: 100,
  associate_professor: 90,
  senior_doctor: 50,
  resident_doctor: 40,
  intern_doctor: 30,
};

export const AppointmentType = {
  general_consultation: "Khám tổng quát",
  specialist_consultation: "Khám chuyên khoa",
  re_examination: "Tái Khám",
  health_checkup: "Khám sức khỏe",
};

export const AppointmentTypeFee = {
  general_consultation: 50,
  specialist_consultation: 70,
  re_examination: 30,
  health_checkup: 100,
};

export const NotificationTypeEnum = {
  all: "Tất cả",
  appointment: "Lịch hẹn",
  re_exam: "Tái khám",
  question_answered: "câu hỏi & trả lời",
  payment: "Thanh toán",
};

export const ExaminationStatusEnum = {
  examined: "Đã khám",
  not_examined: "Chưa khám",
  in_progress: "Đang khám",
};

export const ExaminationStatusColor = {
  examined: "#F4CD62",
  not_examined: "#F46295",
  in_progress: "#62F48E",
};
