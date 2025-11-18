import { useMemo } from 'react';
import { formatDate } from '@/features/shared/utils/dateFormatter';

export const useAttendanceStatistics = (
  attendanceRecords: any[],
  filteredStudents: any[],
  selectedDate: string
) => {
  // Calculate attendance statistics
  const getAttendanceStats = () => {
    const todayRecords = attendanceRecords.filter(record => record.date === selectedDate);
    const stats = {
      total: filteredStudents.length,
      hadir: todayRecords.filter(r => r.status === 'hadir').length,
      sakit: todayRecords.filter(r => r.status === 'sakit').length,
      izin: todayRecords.filter(r => r.status === 'izin').length,
      tanpaKeterangan: todayRecords.filter(r => r.status === 'tanpa-keterangan').length,
    };
    
    return {
      ...stats,
      percentage: stats.total > 0 ? ((stats.hadir / stats.total) * 100).toFixed(1) : '0',
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
