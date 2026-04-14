import { STUDENT_API_URL, getAuthHeaders, handleApiError } from './studentApiClient';

export interface ScheduleItem {
    id: number;
    type: 'lesson' | 'break' | 'ceremony' | 'free';
    label?: string;
    day: string;
    startTime: string;
    endTime: string;
    subject: string;
    teacher: string;
    room: string;
}

const DAY_MAP: Record<string, string> = {
    monday: 'Senin', tuesday: 'Selasa', wednesday: 'Rabu',
    thursday: 'Kamis', friday: 'Jumat', saturday: 'Sabtu', sunday: 'Minggu',
};

const trimTime = (t: string) => t?.length > 5 ? t.substring(0, 5) : (t ?? '');

export const getSubjectColor = (subject: string): string => {
    const colors: Record<string, string> = {
        'Matematika': 'bg-blue-100 border-blue-300 text-blue-800',
        'Fisika': 'bg-purple-100 border-purple-300 text-purple-800',
        'Kimia': 'bg-green-100 border-green-300 text-green-800',
        'Biologi': 'bg-emerald-100 border-emerald-300 text-emerald-800',
        'Bahasa Indonesia': 'bg-amber-100 border-amber-300 text-amber-800',
        'Bahasa Inggris': 'bg-rose-100 border-rose-300 text-rose-800',
        'Sejarah': 'bg-orange-100 border-orange-300 text-orange-800',
        'Pendidikan Agama': 'bg-cyan-100 border-cyan-300 text-cyan-800',
        'Seni Budaya': 'bg-pink-100 border-pink-300 text-pink-800',
        'PJOK': 'bg-lime-100 border-lime-300 text-lime-800',
        'PKn': 'bg-indigo-100 border-indigo-300 text-indigo-800',
        'Prakarya': 'bg-teal-100 border-teal-300 text-teal-800',
        'BK': 'bg-sky-100 border-sky-300 text-sky-800',
        'TIK': 'bg-violet-100 border-violet-300 text-violet-800',
    };
    return colors[subject] ?? 'bg-gray-100 border-gray-300 text-gray-800';
};

export const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const getStudentSchedule = async (): Promise<ScheduleItem[]> => {
    const response = await fetch(`${STUDENT_API_URL}/schedule`, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result.data ?? []).map((item: Record<string, any>): ScheduleItem => ({
        id:        item.id,
        type:      item.type ?? 'lesson',
        label:     item.label ?? undefined,
        day:       DAY_MAP[item.dayOfWeek ?? item.day_of_week] ?? item.dayOfWeek ?? '',
        startTime: trimTime(item.startTime ?? item.start_time ?? ''),
        endTime:   trimTime(item.endTime   ?? item.end_time   ?? ''),
        subject:   item.subject ?? '',
        teacher:   item.teacher ?? '',
        room:      item.room    ?? '',
    }));
};

export const isScheduleCurrentlyHappening = (item: ScheduleItem): boolean => {
    const now = new Date();
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    if (item.day !== dayNames[now.getDay()]) return false;
    const cur = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = item.startTime.split(':').map(Number);
    const [eh, em] = item.endTime.split(':').map(Number);
    return cur >= sh * 60 + sm && cur <= eh * 60 + em;
};
