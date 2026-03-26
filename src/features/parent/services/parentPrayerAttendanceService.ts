import { getParentChildren, type ChildInfo } from "./dailyAttendanceService";

export type PrayerStatus = "berjamaah" | "munfarid" | "masbuk" | "tidak_hadir" | "haid" | "sakit" | "izin" | "belum_dicatat";

export interface PrayerRecord {
    id: string;
    date: string;
    day: string;
    subuh: PrayerStatus;
    dzuhur: PrayerStatus;
    ashar: PrayerStatus;
    maghrib: PrayerStatus;
    isya: PrayerStatus;
}

// Generate data on the fly during API call to avoid SSR hydration mismatches
export const getPrayerAttendance = async (
    childId: string,
    weekOffset: number // 0 is current week, 1 is next week, -1 is last week
): Promise<PrayerRecord[]> => {
    return new Promise((resolve, reject) => {
        // Uncomment below to test error state
        // if (Math.random() < 0.2) return reject(new Error("Gagal terhubung ke server SIMAP."));
        
        setTimeout(() => {
            const records: PrayerRecord[] = [];
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Get Monday of the current week as base
            const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday...
            const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
            
            const startOfRequestedWeek = new Date(today);
            startOfRequestedWeek.setDate(today.getDate() + distanceToMonday + (weekOffset * 7));
            
            const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
            
            for (let i = 0; i < 7; i++) {
                const date = new Date(startOfRequestedWeek);
                date.setDate(startOfRequestedWeek.getDate() + i);
                
                const dayName = days[date.getDay()];
                const dateString = date.toISOString().split("T")[0];
                
                // Deterministic seed based on date string and childId so it doesn't jump around when switching tabs
                const seedStr = `${dateString}-${childId}`;
                let seed = 0;
                for (let j = 0; j < seedStr.length; j++) {
                    seed += seedStr.charCodeAt(j);
                }
                
                const getStatus = (offset: number): PrayerStatus => {
                    if (date > today) return "belum_dicatat"; 
                    
                    const rand = ((seed + offset) % 100) / 100; // 0 to 0.99
                    if (rand > 0.4) return "berjamaah";
                    if (rand > 0.2) return "masbuk";
                    if (rand > 0.1) return "munfarid";
                    return "tidak_hadir";
                };

                records.push({
                    id: `${childId}-${dateString}`,
                    date: dateString,
                    day: dayName,
                    subuh: getStatus(1),
                    dzuhur: getStatus(2),
                    ashar: getStatus(3),
                    maghrib: getStatus(4),
                    isya: getStatus(5),
                });
            }
            
            resolve(records);
        }, 800);
    });
};

export { getParentChildren, type ChildInfo };
