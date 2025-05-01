export const convertTimeToMilliseconds = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours * 60 + minutes) * 60 * 1000; // Chuyển đổi giờ và phút sang mili giây
};
