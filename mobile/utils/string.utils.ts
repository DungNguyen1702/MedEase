export const TruncateText = (text: string, maxLength: number = 5): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
};

export const FormatNumberWithDots = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const getKeyFromValue = (obj: Record<string, string>, value: string): string | undefined => {
  const entry = Object.entries(obj).find(([_, val]) => val === value);
  return entry ? entry[0] : undefined; // Trả về key nếu tìm thấy, ngược lại trả về undefined
};