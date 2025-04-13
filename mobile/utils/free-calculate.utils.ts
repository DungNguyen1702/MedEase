import { DoctorFeePercentageByPosition } from "@/constants/Constants";
import { AppointmentTypeFee } from "@/constants/Constants";

export function calculateFee(
  basePrice: number,
  doctorPosition: keyof typeof DoctorFeePercentageByPosition,
  appointmentType: keyof typeof AppointmentTypeFee
): number {
  const doctorFeePercentage =
    DoctorFeePercentageByPosition[doctorPosition] || 0;

  const appointmentFeePercentage = AppointmentTypeFee[appointmentType] || 0;

  const totalFee =
    ((basePrice * appointmentFeePercentage) / 100) *
    (doctorFeePercentage / 100);

  return Math.round(totalFee);
}
