import { AppointmentTypeFee, DoctorFeePercentageByPosition } from "../constants/constants";

export const calculateFee = (basePrice, doctorPosition, appointmentType) => {
  const doctorFeePercentage =
    DoctorFeePercentageByPosition[doctorPosition] || 0;
  const appointmentFeePercentage = AppointmentTypeFee[appointmentType] || 0;
  const totalFee =
    ((basePrice * appointmentFeePercentage) / 100) *
    (doctorFeePercentage / 100);
  return Math.round(totalFee);
};

export const calculateSumFee = (selectedSpecs, appointmentType) => {
  let totalFee = 0;
  selectedSpecs.forEach((spec) => {
    if (!spec.doctor) return; // Bỏ qua nếu chưa chọn bác sĩ
    const basePrice = spec.spec.base_price;
    const doctorPosition = spec.doctor.position;
    if (appointmentType) {
      const fee = calculateFee(basePrice, doctorPosition, appointmentType);
      totalFee += fee;
    }
  });
  return totalFee;
};