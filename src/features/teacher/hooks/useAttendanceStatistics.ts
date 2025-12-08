import { useMemo } from 'react';
import { formatDate } from '@/features/shared/utils/dateFormatter';

export const useAttendanceStatistics = (
  attendanceRecords: any[],
  filteredStudents: any[],
  selectedDate: string
) => {
  // Calculate attendance statistics
  // Calculate cumulative attendance statistics (Total Semester/All Time)
  const getAttendanceStats = () => {
    // Total Students (The relevant "Total" metric)
    const totalStudents = filteredStudents.length;

    // Total Attendance Records (for percentage calculation)
    const totalRecords = attendanceRecords.length;

    // If no students, return 0 stats
    if (totalStudents === 0) {
      return {
        total: 0,
        totalRecords: 0,
        hadir: 0,
        sakit: 0,
        izin: 0,
        tanpaKeterangan: 0,
        percentage: '0',
      };
    }

    const hadirCount = attendanceRecords.filter(r => r.status === 'hadir').length;

    const stats = {
      total: totalStudents, // Display Total Students
      totalRecords: totalRecords, // Total Attendance Records for calculations
      hadir: hadirCount,
      sakit: attendanceRecords.filter(r => r.status === 'sakit').length,
      izin: attendanceRecords.filter(r => r.status === 'izin').length,
      tanpaKeterangan: attendanceRecords.filter(r => r.status === 'tanpa-keterangan').length,
    };

    // Percentage is based on Total Records (Participation Rate)
    // Avoid division by zero if no records yet
    const participationRate = totalRecords > 0 ? ((hadirCount / totalRecords) * 100) : 0;

    return {
      ...stats,
      percentage: participationRate.toFixed(1),
    };
  };

  const stats = useMemo(() => getAttendanceStats(), [attendanceRecords, filteredStudents, selectedDate]);

  // Get monthly attendance trend for the semester
  const getMonthlyTrend = () => {
    // Group records by month
    const monthlyData: Record<string, { total: number; hadir: number; sakit: number; izin: number; tanpaKeterangan: number }> = {};

    attendanceRecords.forEach(record => {
      // Extract month key (YYYY-MM)
      const date = new Date(record.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { total: 0, hadir: 0, sakit: 0, izin: 0, tanpaKeterangan: 0 };
      }

      const status = record.status?.toLowerCase().trim();

      monthlyData[monthKey].total += 1;
      if (status === 'hadir' || status === 'present') monthlyData[monthKey].hadir += 1;
      else if (status === 'sakit') monthlyData[monthKey].sakit += 1;
      else if (status === 'izin') monthlyData[monthKey].izin += 1;
      else if (status === 'tanpa-keterangan' || status === 'alpha') monthlyData[monthKey].tanpaKeterangan += 1;
    });

    // Convert to array and sort
    const sortedMonths = Object.keys(monthlyData).sort();

    // Map to chart format
    return sortedMonths.map(monthKey => {
      const [year, month] = monthKey.split('-');
      const MONTH_NAMES = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
      ];
      const FULL_MONTH_NAMES = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const monthIndex = parseInt(month) - 1;
      const monthName = MONTH_NAMES[monthIndex];
      const fullMonthName = FULL_MONTH_NAMES[monthIndex];

      const data = monthlyData[monthKey];
      const calculatePercentage = (count: number) => data.total > 0 ? parseFloat(((count / data.total) * 100).toFixed(1)) : 0;

      return {
        name: monthName,
        fullName: fullMonthName,
        percentage: calculatePercentage(data.hadir),
        percentageSakit: calculatePercentage(data.sakit),
        percentageIzin: calculatePercentage(data.izin),
        percentageAlpha: calculatePercentage(data.tanpaKeterangan),
        total: data.total,
        hadir: data.hadir,
        sakit: data.sakit,
        izin: data.izin,
        tanpaKeterangan: data.tanpaKeterangan
      };
    });
  };

  const attendanceTrend = useMemo(() => getMonthlyTrend(), [attendanceRecords]);

  return {
    stats,
    attendanceTrend,
  };
};
