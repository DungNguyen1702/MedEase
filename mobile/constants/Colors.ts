const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  primary: {
    main: "#6282F4", // Xanh chính
    darkText: "#3F69FF", // Xanh đậm chữ
    light: "#62B0F4", // Xanh nhạt phụ
    mainLight: "#AECAF9",
    mainDark: "#021529",
    lightBackground: "#E7EFFD",
    lightMain: "#9ABDF8",
    darkBorder: "#3F69FF",
  },
  success: {
    background: "#62F48E", // Xanh lá nền
    border: "#50C97C", // Xanh lá viền
    text: "#349056", // Xanh lá chữ
  },
  danger: {
    background: "#F46295", // Đỏ nền
    text: "#A50064", // Đỏ chữ
  },
  warning: {
    background: "#FFE6A2", // Vàng nền
    text: "#F7BF26", // Vàng chữ
  },
  light: {
    main: "#fff",
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
  brand: {
    momo: "#A50064",
    zalopay_green: "#00CF6A",
    zalopay_blue: "#0033C9",
    cash: "#142C14",
  },
};
