import { format } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Format date to Indonesian locale format
 * @param date - Date to format
 * @param formatStr - Format string (default: 'dd MMMM yyyy')
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string, formatStr: string = 'dd MMMM yyyy'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: id });
};

/**
 * Format time to Indonesian locale format
 * @param date - Date to format
 * @returns Formatted time string
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'HH:mm', { locale: id });
};

/**
 * Format date and time to Indonesian locale format
 * @param date - Date to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd MMMM yyyy HH:mm', { locale: id });
};

/**
 * Get day name in Indonesian
 * @param date - Date to get day name from
 * @returns Day name in Indonesian
 */
export const getDayName = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'EEEE', { locale: id });
};

/**
 * Get relative time in Indonesian (e.g., "2 jam yang lalu")
 * @param date - Date to get relative time from
 * @returns Relative time string
 */
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Baru saja';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} menit yang lalu`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} jam yang lalu`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} hari yang lalu`;
  } else {
    return formatDate(dateObj);
  }
};