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

  // Get dynamic attendance trend for the current week
  const getAttendanceTrend = () => {
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
    const currentDate = new Date(selectedDate);
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1);

    return days.map((day, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      const dateStr = formatDate(date, 'yyyy-MM-dd');

      const dayRecords = attendanceRecords.filter(r => r.date === dateStr);
      const hadir = dayRecords.filter(r => r.status === 'hadir').length;
      const total = filteredStudents.length || dayRecords.length || 32;

      return { date: day, hadir, total, dateStr };
    });
  };

  const attendanceTrend = useMemo(() => getAttendanceTrend(), [attendanceRecords, filteredStudents, selectedDate]);

  // Calculate percentage change from previous day
  const getPreviousDayChange = () => {
    if (attendanceTrend.length < 2) return null;

    const today = attendanceTrend[attendanceTrend.length - 1];
    const yesterday = attendanceTrend[attendanceTrend.length - 2];

    if (yesterday.total === 0) return null;

    const todayPercentage = (today.hadir / today.total) * 100;
    const yesterdayPercentage = (yesterday.hadir / yesterday.total) * 100;
    const change = todayPercentage - yesterdayPercentage;

    return {
      value: Math.abs(change).toFixed(1),
      isUp: change >= 0
    };
  };

  const previousDayChange = useMemo(() => getPreviousDayChange(), [attendanceTrend]);

  return {
    stats,
    attendanceTrend,
    previousDayChange,
  };
};
