// Utility functions for attendance calculations

/**
 * Calculate attendance statistics from attendance records
 * @param records - Array of attendance records
 * @returns Object with attendance statistics
 */
export const calculateAttendanceStats = (records: any[]) => {
  if (!records || records.length === 0) {
    return {
      total: 0,
      present: 0,
      sick: 0,
      permit: 0,
      absent: 0,
    };
  }

  const total = records.length;
  const present = records.filter(r => r.status === 'hadir').length;
  const sick = records.filter(r => r.status === 'sakit').length;
  const permit = records.filter(r => r.status === 'izin').length;
  const absent = records.filter(r => r.status === 'tanpa-keterangan').length;

  return {
    total,
    present,
    sick,
    permit,
    absent,
  };
};