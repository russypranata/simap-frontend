 
import { useMemo } from 'react';

interface AttendanceRecord {
  status: string;
  date: string;
  studentId?: string;
  [key: string]: unknown;
}

interface Student {
  id?: string;
  [key: string]: unknown;
}

export const useAttendanceStatistics = (
  attendanceRecords: AttendanceRecord[],
  filteredStudents: Student[],
  selectedDate: string
) => {
  const stats = useMemo(() => {
    const totalStudents = filteredStudents.length;
    const totalRecords = attendanceRecords.length;

    if (totalStudents === 0) {
      return { total: 0, totalRecords: 0, hadir: 0, sakit: 0, izin: 0, tanpaKeterangan: 0, percentage: '0.0' };
    }

    const hadirCount = attendanceRecords.filter(r => r.status === 'hadir').length;
    const participationRate = totalRecords > 0 ? ((hadirCount / totalRecords) * 100) : 0;

    return {
      total: totalStudents,
      totalRecords,
      hadir: hadirCount,
      sakit: attendanceRecords.filter(r => r.status === 'sakit').length,
      izin: attendanceRecords.filter(r => r.status === 'izin').length,
      tanpaKeterangan: attendanceRecords.filter(r => r.status === 'tanpa-keterangan').length,
      percentage: participationRate.toFixed(1),
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceRecords, filteredStudents, selectedDate]);

  const attendanceTrend = useMemo(() => {
    const monthlyData: Record<string, { total: number; hadir: number; sakit: number; izin: number; tanpaKeterangan: number }> = {};

    attendanceRecords.forEach(record => {
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

    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const FULL_MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    return Object.keys(monthlyData).sort().map(monthKey => {
      const [_year, month] = monthKey.split('-');
      const monthIndex = parseInt(month) - 1;
      const data = monthlyData[monthKey];
      const pct = (count: number) => data.total > 0 ? parseFloat(((count / data.total) * 100).toFixed(1)) : 0;

      return {
        name: MONTH_NAMES[monthIndex],
        fullName: FULL_MONTH_NAMES[monthIndex],
        percentage: pct(data.hadir),
        percentageSakit: pct(data.sakit),
        percentageIzin: pct(data.izin),
        percentageAlpha: pct(data.tanpaKeterangan),
        total: data.total,
        hadir: data.hadir,
        sakit: data.sakit,
        izin: data.izin,
        tanpaKeterangan: data.tanpaKeterangan,
      };
    });
   
  }, [attendanceRecords]);

  return { stats, attendanceTrend };
};
