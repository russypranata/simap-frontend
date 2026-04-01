// Student Daily Attendance Service
export type AttendanceStatus = "hadir" | "sakit" | "izin" | "alpa" | "libur" | "belum_dicatat";

export interface DailyAttendanceRecord {
    date: string;
    status: AttendanceStatus;
    notes?: string;
    submittedBy?: string;
    submittedAt?: string;
}

export interface DailyAttendanceResponse {
    records: DailyAttendanceRecord[];
    studentName: string;
    studentClass: string;
}

const generateMockData = (year: number, month: number): DailyAttendanceRecord[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const records: DailyAttendanceRecord[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        date.setHours(0, 0, 0, 0);
        const dayOfWeek = date.getDay();
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

        if (dayOfWeek === 0 || dayOfWeek === 6) {
            records.push({ date: dateStr, status: "libur", notes: dayOfWeek === 0 ? "Hari Minggu" : "Hari Sabtu" });
        } else if (date >= today) {
            records.push({ date: dateStr, status: "belum_dicatat" });
        } else if (i % 10 === 0) {
            records.push({ date: dateStr, status: "sakit", notes: "Demam", submittedBy: "Wali Kelas", submittedAt: `${dateStr}T08:00:00` });
        } else if (i % 7 === 0) {
            records.push({ date: dateStr, status: "izin", notes: "Acara Keluarga", submittedBy: "Orang Tua", submittedAt: `${dateStr}T07:30:00` });
        } else if (i === 15) {
            records.push({ date: dateStr, status: "alpa" });
        } else {
            records.push({ date: dateStr, status: "hadir" });
        }
    }
    return records;
};

export const getStudentDailyAttendance = async (
    year: number,
    month: number,
    semesterId: string
): Promise<DailyAttendanceResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
        records: generateMockData(year, month),
        studentName: "Ahmad Rizki Maulana",
        studentClass: "XII IPA 1",
    };
};
