export const returnNumericValue = (value: string): string => value?.replace(/\D/g, '');

export const getMinutes = (value?: number): string => {
  if (!value) {
    return '';
  }
  return value && value > 60 ? `${Math.floor(value / 60)} мин.` : `${value} сек.`;
};
