export const TruncateText = (text: string, maxLength: number = 5): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
};
