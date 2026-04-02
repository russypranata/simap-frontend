// ============================================
// STUDENT SCHEDULE SERVICE
// ============================================

export interface ScheduleItem {
    id: number;
    day: string;
    startTime: string;
    endTime: string;
    subject: string;
    teacher: string;
    room: string;
    lessonNumber: number;
}

const mockSchedule: ScheduleItem[] = [
    // Senin
    { id: 1, day: "Senin", startTime: "07:00", endTime: "07:45", subject: "Upacara", teacher: "-", room: "Lapangan", lessonNumber: 1 },
    { id: 2, day: "Senin", startTime: "07:45", endTime: "08:30", subject: "Matematika", teacher: "Pak Ahmad", room: "XII IPA 1", lessonNumber: 2 },
    { id: 3, day: "Senin", startTime: "08:30", endTime: "09:15", subject: "Matematika", teacher: "Pak Ahmad", room: "XII IPA 1", lessonNumber: 3 },
    { id: 4, day: "Senin", startTime: "09:30", endTime: "10:15", subject: "Fisika", teacher: "Bu Sari", room: "Lab Fisika", lessonNumber: 4 },
    { id: 5, day: "Senin", startTime: "10:15", endTime: "11:00", subject: "Fisika", teacher: "Bu Sari", room: "Lab Fisika", lessonNumber: 5 },
    { id: 6, day: "Senin", startTime: "11:00", endTime: "11:45", subject: "Bahasa Indonesia", teacher: "Bu Dewi", room: "XII IPA 1", lessonNumber: 6 },
    { id: 7, day: "Senin", startTime: "12:30", endTime: "13:15", subject: "Bahasa Indonesia", teacher: "Bu Dewi", room: "XII IPA 1", lessonNumber: 7 },
    { id: 8, day: "Senin", startTime: "13:15", endTime: "14:00", subject: "Bahasa Inggris", teacher: "Pak Budi", room: "XII IPA 1", lessonNumber: 8 },
    // Selasa
    { id: 9, day: "Selasa", startTime: "07:00", endTime: "07:45", subject: "Kimia", teacher: "Pak Rudi", room: "Lab Kimia", lessonNumber: 1 },
    { id: 10, day: "Selasa", startTime: "07:45", endTime: "08:30", subject: "Kimia", teacher: "Pak Rudi", room: "Lab Kimia", lessonNumber: 2 },
    { id: 11, day: "Selasa", startTime: "08:30", endTime: "09:15", subject: "Biologi", teacher: "Bu Ani", room: "Lab Biologi", lessonNumber: 3 },
    { id: 12, day: "Selasa", startTime: "09:30", endTime: "10:15", subject: "Biologi", teacher: "Bu Ani", room: "Lab Biologi", lessonNumber: 4 },
    { id: 13, day: "Selasa", startTime: "10:15", endTime: "11:00", subject: "Sejarah", teacher: "Pak Hendra", room: "XII IPA 1", lessonNumber: 5 },
    { id: 14, day: "Selasa", startTime: "11:00", endTime: "11:45", subject: "Sejarah", teacher: "Pak Hendra", room: "XII IPA 1", lessonNumber: 6 },
    { id: 15, day: "Selasa", startTime: "12:30", endTime: "13:15", subject: "Pendidikan Agama", teacher: "Pak Usman", room: "XII IPA 1", lessonNumber: 7 },
    { id: 16, day: "Selasa", startTime: "13:15", endTime: "14:00", subject: "Pendidikan Agama", teacher: "Pak Usman", room: "XII IPA 1", lessonNumber: 8 },
    // Rabu
    { id: 17, day: "Rabu", startTime: "07:00", endTime: "07:45", subject: "Matematika", teacher: "Pak Ahmad", room: "XII IPA 1", lessonNumber: 1 },
    { id: 18, day: "Rabu", startTime: "07:45", endTime: "08:30", subject: "Matematika", teacher: "Pak Ahmad", room: "XII IPA 1", lessonNumber: 2 },
    { id: 19, day: "Rabu", startTime: "08:30", endTime: "09:15", subject: "Bahasa Inggris", teacher: "Pak Budi", room: "XII IPA 1", lessonNumber: 3 },
    { id: 20, day: "Rabu", startTime: "09:30", endTime: "10:15", subject: "Bahasa Inggris", teacher: "Pak Budi", room: "XII IPA 1", lessonNumber: 4 },
    { id: 21, day: "Rabu", startTime: "10:15", endTime: "11:00", subject: "Seni Budaya", teacher: "Bu Ratna", room: "R. Seni", lessonNumber: 5 },
    { id: 22, day: "Rabu", startTime: "11:00", endTime: "11:45", subject: "Seni Budaya", teacher: "Bu Ratna", room: "R. Seni", lessonNumber: 6 },
    { id: 23, day: "Rabu", startTime: "12:30", endTime: "13:15", subject: "PJOK", teacher: "Pak Dedi", room: "Lapangan", lessonNumber: 7 },
    { id: 24, day: "Rabu", startTime: "13:15", endTime: "14:00", subject: "PJOK", teacher: "Pak Dedi", room: "Lapangan", lessonNumber: 8 },
    // Kamis
    { id: 25, day: "Kamis", startTime: "07:00", endTime: "07:45", subject: "Fisika", teacher: "Bu Sari", room: "Lab Fisika", lessonNumber: 1 },
    { id: 26, day: "Kamis", startTime: "07:45", endTime: "08:30", subject: "Fisika", teacher: "Bu Sari", room: "Lab Fisika", lessonNumber: 2 },
    { id: 27, day: "Kamis", startTime: "08:30", endTime: "09:15", subject: "Kimia", teacher: "Pak Rudi", room: "Lab Kimia", lessonNumber: 3 },
    { id: 28, day: "Kamis", startTime: "09:30", endTime: "10:15", subject: "Kimia", teacher: "Pak Rudi", room: "Lab Kimia", lessonNumber: 4 },
    { id: 29, day: "Kamis", startTime: "10:15", endTime: "11:00", subject: "PKn", teacher: "Bu Rina", room: "XII IPA 1", lessonNumber: 5 },
    { id: 30, day: "Kamis", startTime: "11:00", endTime: "11:45", subject: "PKn", teacher: "Bu Rina", room: "XII IPA 1", lessonNumber: 6 },
    { id: 31, day: "Kamis", startTime: "12:30", endTime: "13:15", subject: "Prakarya", teacher: "Pak Joko", room: "R. Prakarya", lessonNumber: 7 },
    { id: 32, day: "Kamis", startTime: "13:15", endTime: "14:00", subject: "Prakarya", teacher: "Pak Joko", room: "R. Prakarya", lessonNumber: 8 },
    // Jumat
    { id: 33, day: "Jumat", startTime: "07:00", endTime: "07:45", subject: "Biologi", teacher: "Bu Ani", room: "Lab Biologi", lessonNumber: 1 },
    { id: 34, day: "Jumat", startTime: "07:45", endTime: "08:30", subject: "Biologi", teacher: "Bu Ani", room: "Lab Biologi", lessonNumber: 2 },
    { id: 35, day: "Jumat", startTime: "08:30", endTime: "09:15", subject: "Matematika", teacher: "Pak Ahmad", room: "XII IPA 1", lessonNumber: 3 },
    { id: 36, day: "Jumat", startTime: "09:30", endTime: "10:15", subject: "Bahasa Indonesia", teacher: "Bu Dewi", room: "XII IPA 1", lessonNumber: 4 },
    { id: 37, day: "Jumat", startTime: "10:15", endTime: "11:00", subject: "BK", teacher: "Bu Linda", room: "R. BK", lessonNumber: 5 },
    // Sabtu
    { id: 38, day: "Sabtu", startTime: "07:00", endTime: "07:45", subject: "Bahasa Inggris", teacher: "Pak Budi", room: "XII IPA 1", lessonNumber: 1 },
    { id: 39, day: "Sabtu", startTime: "07:45", endTime: "08:30", subject: "Bahasa Inggris", teacher: "Pak Budi", room: "XII IPA 1", lessonNumber: 2 },
    { id: 40, day: "Sabtu", startTime: "08:30", endTime: "09:15", subject: "TIK", teacher: "Pak Fajar", room: "Lab Komputer", lessonNumber: 3 },
    { id: 41, day: "Sabtu", startTime: "09:30", endTime: "10:15", subject: "TIK", teacher: "Pak Fajar", room: "Lab Komputer", lessonNumber: 4 },
    { id: 42, day: "Sabtu", startTime: "10:15", endTime: "11:00", subject: "Muatan Lokal", teacher: "Bu Yuli", room: "XII IPA 1", lessonNumber: 5 },
];

export const getSubjectColor = (subject: string): string => {
    const colors: Record<string, string> = {
        "Matematika": "bg-blue-100 border-blue-300 text-blue-800",
        "Fisika": "bg-purple-100 border-purple-300 text-purple-800",
        "Kimia": "bg-green-100 border-green-300 text-green-800",
        "Biologi": "bg-emerald-100 border-emerald-300 text-emerald-800",
        "Bahasa Indonesia": "bg-amber-100 border-amber-300 text-amber-800",
        "Bahasa Inggris": "bg-rose-100 border-rose-300 text-rose-800",
        "Sejarah": "bg-orange-100 border-orange-300 text-orange-800",
        "Pendidikan Agama": "bg-cyan-100 border-cyan-300 text-cyan-800",
        "Seni Budaya": "bg-pink-100 border-pink-300 text-pink-800",
        "PJOK": "bg-lime-100 border-lime-300 text-lime-800",
        "PKn": "bg-indigo-100 border-indigo-300 text-indigo-800",
        "Prakarya": "bg-teal-100 border-teal-300 text-teal-800",
        "BK": "bg-sky-100 border-sky-300 text-sky-800",
        "TIK": "bg-violet-100 border-violet-300 text-violet-800",
        "Muatan Lokal": "bg-fuchsia-100 border-fuchsia-300 text-fuchsia-800",
        "Upacara": "bg-red-100 border-red-300 text-red-800",
    };
    return colors[subject] || "bg-gray-100 border-gray-300 text-gray-800";
};

export const getStudentSchedule = async (): Promise<ScheduleItem[]> => {
    return Promise.resolve(mockSchedule);
};
