import { AppointmentType } from "@/constants/Constants";

export const TruncateText = (text: string, maxLength: number = 5): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
};

export const FormatNumberWithDots = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const getKeyFromValue = (
  obj: Record<string, string>,
  value: string
): string | undefined => {
  const entry = Object.entries(obj).find(([_, val]) => val === value);
  return entry ? entry[0] : undefined; // Trả về key nếu tìm thấy, ngược lại trả về undefined
};

export const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0"); // Lấy ngày (dd)
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Lấy tháng (mm) (tháng bắt đầu từ 0)
  const year = today.getFullYear(); // Lấy năm (yyyy)

  return `${day}-${month}-${year}`; // Kết hợp thành chuỗi dd/mm/yyyy
};

export const formatDateToYYYYMMDD = (dateString: string): string => {
  const date = new Date(dateString); // Chuyển chuỗi thành đối tượng Date
  const year = date.getFullYear(); // Lấy năm
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (tháng bắt đầu từ 0)
  const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày

  return `${year}-${month}-${day}`; // Trả về chuỗi định dạng yyyy-mm-dd
};

export const formatDateToYYYYMMDDHHmm = (dateString: string): string => {
  const date = new Date(dateString); // Chuyển chuỗi thành đối tượng Date
  const year = date.getFullYear(); // Lấy năm
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (tháng bắt đầu từ 0)
  const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày
  const hours = String(date.getHours()).padStart(2, "0"); // Lấy giờ
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Lấy phút

  return `${year}-${month}-${day} ${hours}:${minutes}`; // Trả về chuỗi định dạng yyyy-mm-dd HH:mm
};
