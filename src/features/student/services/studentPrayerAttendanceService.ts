import { STUDENT_API_URL, getAuthHeaders, handleApiError } from './studentApiClient';

export type PrayerStatus = 'hadir_tepat_waktu' | 'masbuk' | 'haid' | 'tanpa_keterangan' | 'belum_dicatat';

export interface PrayerRecord {
    id: string;
    date: string;
    day: string;
    subuh: PrayerStatus;
    dhuha: PrayerStatus;
    dzuhur: PrayerStatus;
    ashar: PrayerStatus;
    maghrib: PrayerStatus;
    isya: PrayerStatus;
    tahajjud: PrayerStatus;
}

const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const statusMap: Record<string, PrayerStatus> = {
    hadir: 'hadir_tepat_waktu', alpa: 'tanpa_keterangan',
    hadir_tepat_waktu: 'hadir_tepat_waktu', masbuk: 'masbuk',
    haid: 'haid', tanpa_keterangan: 'tanpa_keterangan',
};

export const getStudentPrayerAttendanceByMonth = async (year: number, month: number): Promise<PrayerRecord[]> => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startStr = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endStr   = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

    const params = new URLSearchParams({ start_date: startStr, end_date: endStr });
    const response = await fetch(`${STUDENT_API_URL}/attendance/prayer?${params}`, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    const today = new Date(); today.setHours(0, 0, 0, 0);

    // Group by date
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const byDate: Record<string, Record<string, any>[]> = {};
    for (const item of result.data ?? []) {
        if (!byDate[item.date]) byDate[item.date] = [];
        byDate[item.date].push(item);
    }

    return Array.from({ length: daysInMonth }, (_, i) => {
        const date    = new Date(year, month, i + 1);
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
        const dayRecs = byDate[dateStr] ?? [];
        const isFuture = date > today;

        const getStatus = (prayerTime: string): PrayerStatus => {
            if (isFuture) return 'belum_dicatat';
            const rec = dayRecs.find(r => r.prayerTime === prayerTime || r.prayer_time === prayerTime);
            if (!rec) return 'belum_dicatat';
            return statusMap[rec.status] ?? 'belum_dicatat';
        };

        return {
            id: `student-${dateStr}`,
            date: dateStr,
            day: DAYS_ID[date.getDay()] ?? '',
            subuh:    getStatus('subuh'),
            dhuha:    'belum_dicatat' as PrayerStatus,
            dzuhur:   getStatus('dzuhur'),
            ashar:    getStatus('ashar'),
            maghrib:  getStatus('maghrib'),
            isya:     getStatus('isya'),
            tahajjud: 'belum_dicatat' as PrayerStatus,
        };
    });
};
