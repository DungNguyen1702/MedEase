import {
  AppointmentType,
  DoctorFeePercentageByPosition,
} from "@/constants/Constants";
import { AppointmentTypeFee } from "@/constants/Constants";
import { getKeyFromValue } from "./string.utils";

export function calculateFee(
  basePrice: number,
  doctorPosition: keyof typeof DoctorFeePercentageByPosition,
  appointmentType: keyof typeof AppointmentTypeFee
): number {
  // console.log("basePrice", basePrice);
  // console.log("doctorPosition", doctorPosition);
  // console.log("appointmentType", appointmentType);

  const doctorFeePercentage =
    DoctorFeePercentageByPosition[doctorPosition] || 0;

  const appointmentFeePercentage = AppointmentTypeFee[appointmentType] || 0;

  const totalFee =
    ((basePrice * appointmentFeePercentage) / 100) *
    (doctorFeePercentage / 100);

  return Math.round(totalFee);
}

export const calculateSumFee = (
  selectedSpecs: any[],
  appointmentType: string
): number => {
  let totalFee = 0;
  selectedSpecs.forEach((spec) => {
    const basePrice = spec.spec.base_price;
    const doctorPosition = spec.doctor.position;

    if (appointmentType) {
      const fee = calculateFee(
        basePrice,
        doctorPosition,
        appointmentType as keyof typeof AppointmentTypeFee
      );
      totalFee += fee;
    }
  });
  return totalFee;
};
