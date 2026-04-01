export type PrayerStatus = "hadir_tepat_waktu" | "masbuk" | "haid" | "tanpa_keterangan" | "belum_dicatat";

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

const STUDENT_ID = "student-self";

const buildRecords = (dates: Date[], today: Date): PrayerRecord[] => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return dates.map(date => {
        const dayName = days[date.getDay()];
        const dateString = date.toISOString().split("T")[0];
        const seedStr = `${dateString}-${STUDENT_ID}`;
        let seed = 0;
        for (let j = 0; j < seedStr.length; j++) seed += seedStr.charCodeAt(j);

        const getStatus = (offset: number): PrayerStatus => {
            if (date > today) return "belum_dicatat";
            const rand = ((seed + offset) % 100) / 100;
            if (rand > 0.4) return "hadir_tepat_waktu";
            if (rand > 0.2) return "masbuk";
            if (rand > 0.1) return "haid";
            return "tanpa_keterangan";
        };

        return {
            id: `${STUDENT_ID}-${dateString}`,
            date: dateString,
            day: dayName,
            subuh: getStatus(1),
            dhuha: getStatus(6),
            dzuhur: getStatus(2),
            ashar: getStatus(3),
            maghrib: getStatus(4),
            isya: getStatus(5),
            tahajjud: getStatus(7),
        };
    });
};

export const getStudentPrayerAttendanceByMonth = async (
    year: number,
    month: number
): Promise<PrayerRecord[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const dates = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
            resolve(buildRecords(dates, today));
        }, 800);
    });
};
