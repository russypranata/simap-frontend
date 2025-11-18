/**
 * Attendance constants and configuration
 */

export const SUBJECTS = [
  'Matematika',
  'Fisika',
  'Kimia',
  'Biologi',
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'Sejarah',
  'Geografi',
  'Ekonomi',
  'Sosiologi',
] as const;

export const LESSON_HOURS = [
  'Jam ke-1 (07:00-07:45)',
  'Jam ke-2 (07:45-08:30)',
  'Jam ke-3 (08:30-09:15)',
  'Jam ke-4 (09:15-10:00)',
  'Jam ke-5 (10:15-11:00)',
  'Jam ke-6 (11:00-11:45)',
  'Jam ke-7 (12:00-12:45)',
  'Jam ke-8 (12:45-13:30)',
] as const;

export const ATTENDANCE_STATUS = {
  HADIR: 'hadir',
  SAKIT: 'sakit',
  IZIN: 'izin',
  ALPA: 'tanpa-keterangan',
} as const;

export const ATTENDANCE_STATUS_LABELS = {
  hadir: 'Hadir',
  sakit: 'Sakit',
  izin: 'Izin',
  'tanpa-keterangan': 'Alpa',
} as const;
