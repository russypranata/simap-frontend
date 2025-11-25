import dynamic from 'next/dynamic';

export { ScheduleStatsCards } from './ScheduleStatsCards';
export { ScheduleFilterSection } from './ScheduleFilterSection';
export { WeeklyScheduleGrid } from './WeeklyScheduleGrid';
export { DailyScheduleCalendar } from './DailyScheduleCalendar';

// Dynamically import ScheduleStatistics to avoid SSR issues with recharts
export const ScheduleStatistics = dynamic(
    () => import('./ScheduleStatistics').then((mod) => mod.ScheduleStatistics),
    { ssr: false }
);
