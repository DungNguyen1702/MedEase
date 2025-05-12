import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi"; 

export const TruncateText = (text, maxLength = 5) => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
};

export const FormatNumberWithDots = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const getKeyFromValue = (obj, value) => {
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

export const formatDateToYYYYMMDD = (dateString) => {
  const date = new Date(dateString); // Chuyển chuỗi thành đối tượng Date
  const year = date.getFullYear(); // Lấy năm
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (tháng bắt đầu từ 0)
  const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày

  return `${year}-${month}-${day}`; // Trả về chuỗi định dạng yyyy-mm-dd
};

export const formatDateToYYYYMMDDHHmm = (dateString) => {
  const date = new Date(dateString); // Chuyển chuỗi thành đối tượng Date
  const year = date.getFullYear(); // Lấy năm
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (tháng bắt đầu từ 0)
  const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày
  const hours = String(date.getHours()).padStart(2, "0"); // Lấy giờ
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Lấy phút

  return `${year}-${month}-${day} ${hours}:${minutes}`; // Trả về chuỗi định dạng yyyy-mm-dd HH:mm
};

export const paginateData = (data, page, limit) => {
  const startIndex = (page - 1) * limit; // Vị trí bắt đầu
  const endIndex = startIndex + limit; // Vị trí kết thúc
  return data.slice(startIndex, endIndex); // Cắt dữ liệu
};

export const calculateAge = (birthDateString) => {
  const today = new Date(); // Ngày hiện tại
  const birthDate = new Date(birthDateString); // Chuyển chuỗi ngày sinh thành đối tượng Date

  let age = today.getFullYear() - birthDate.getFullYear(); // Tính năm chênh lệch
  const monthDifference = today.getMonth() - birthDate.getMonth(); // Tính tháng chênh lệch

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age; 
};


export const formatRelativeTime = (dateString) => {

  dayjs.extend(relativeTime);
  dayjs.locale("vi"); // Thiết lập ngôn ngữ là tiếng Việt

  const now = dayjs(); // Thời gian hiện tại
  const inputDate = dayjs(dateString); // Chuyển chuỗi thành đối tượng dayjs

  // Nếu thời gian cách hiện tại hơn 7 ngày, hiển thị full ngày và giờ
  if (now.diff(inputDate, "day") >= 7) {
    return inputDate.format("YYYY-MM-DD HH:mm"); // Định dạng đầy đủ
  }

  // Nếu thời gian cách hiện tại dưới 7 ngày, hiển thị dạng tương đối
  return inputDate.fromNow(); // Ví dụ: "3 phút trước", "1 giờ trước"
};