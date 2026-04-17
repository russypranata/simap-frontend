import { useQuery } from '@tanstack/react-query';
import { attendanceService } from '../services/attendanceService';
import type { AttendanceFilters } from '../types/attendance';

export const ATTENDANCE_KEYS = {
    summary:  (date: string)    => ['admin-attendance-summary', date] as const,
    daily:    (f: AttendanceFilters) => ['admin-attendance-daily', f] as const,
    morning:  (f: AttendanceFilters) => ['admin-attendance-morning', f] as const,
    prayer:   (f: AttendanceFilters) => ['admin-attendance-prayer', f] as const,
    ekskul:   (f: AttendanceFilters) => ['admin-attendance-ekskul', f] as const,
};

export const useAttendanceSummary = (date: string) =>
    useQuery({
        queryKey: ATTENDANCE_KEYS.summary(date),
        queryFn:  () => attendanceService.getSummary(date),
        staleTime: 0,
        enabled: !!date,
    });

export const useDailyAttendance = (filters: AttendanceFilters) =>
    useQuery({
        queryKey: ATTENDANCE_KEYS.daily(filters),
        queryFn:  () => attendanceService.getDaily(filters),
        staleTime: 0,
    });

export const useMorningAttendance = (filters: AttendanceFilters) =>
    useQuery({
        queryKey: ATTENDANCE_KEYS.morning(filters),
        queryFn:  () => attendanceService.getMorning(filters),
        staleTime: 0,
    });

export const usePrayerAttendance = (filters: AttendanceFilters) =>
    useQuery({
        queryKey: ATTENDANCE_KEYS.prayer(filters),
        queryFn:  () => attendanceService.getPrayer(filters),
        staleTime: 0,
    });

export const useEkskulAttendance = (filters: AttendanceFilters) =>
    useQuery({
        queryKey: ATTENDANCE_KEYS.ekskul(filters),
        queryFn:  () => attendanceService.getExtracurricular(filters),
        staleTime: 0,
    });
