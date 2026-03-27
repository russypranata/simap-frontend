// Types
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

export interface ChildScheduleData {
    childId: string;
    childName: string;
    childClass: string;
    schedule: ScheduleItem[];
}

export interface AcademicYearData {
    id: string;
    year: string;
    semesters: SemesterData[];
}

export interface SemesterData {
    id: string;
    name: string; // Use "Ganjil" or "Genap" for consistency with ActiveAcademicYearBadge
    isActive: boolean;
}

// Days constant
export const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

// Subject colors for visual variety
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
        "Ekonomi": "bg-yellow-100 border-yellow-300 text-yellow-800",
        "Sosiologi": "bg-stone-100 border-stone-300 text-stone-800",
        "Geografi": "bg-zinc-100 border-zinc-300 text-zinc-800",
        "Bimbingan Konseling": "bg-sky-100 border-sky-300 text-sky-800",
    };
    return colors[subject] || "bg-gray-100 border-gray-300 text-gray-800";
};

// Mock schedule data for Child 1 (Ahmad Santoso - X-A)
// Notes: 
// - Room format: "R. [ClassName]" for regular classrooms, specific names for labs/fields
// - Lesson numbers: 1-6 (morning), 7-8 (afternoon after 11:45-12:30 break)
// - Break times: 09:15-09:30 and 11:45-12:30
export const mockScheduleChild1: ScheduleItem[] = [
    // Senin - 6 lessons
    { id: 1, day: "Senin", startTime: "07:00", endTime: "07:45", subject: "Upacara", teacher: "-", room: "Lapangan", lessonNumber: 1 },
    { id: 2, day: "Senin", startTime: "07:45", endTime: "08:30", subject: "Matematika", teacher: "Ahmad Fauzi, S.Pd.", room: "R. X-A", lessonNumber: 2 },
    { id: 3, day: "Senin", startTime: "08:30", endTime: "09:15", subject: "Matematika", teacher: "Ahmad Fauzi, S.Pd.", room: "R. X-A", lessonNumber: 3 },
    { id: 4, day: "Senin", startTime: "09:30", endTime: "10:15", subject: "Bahasa Indonesia", teacher: "Dewi Sartika, S.Pd., M.Pd.", room: "R. X-A", lessonNumber: 4 },
    { id: 5, day: "Senin", startTime: "10:15", endTime: "11:00", subject: "Bahasa Indonesia", teacher: "Dewi Sartika, S.Pd., M.Pd.", room: "R. X-A", lessonNumber: 5 },
    { id: 6, day: "Senin", startTime: "11:00", endTime: "11:45", subject: "PJOK", teacher: "Dedi Kurniawan, S.Pd.", room: "Lapangan", lessonNumber: 6 },

    // Selasa - 7 lessons (afternoon session starts at 12:30)
    { id: 7, day: "Selasa", startTime: "07:00", endTime: "07:45", subject: "Fisika", teacher: "Sari Wahyuni, S.Si., M.Si.", room: "Lab Fisika", lessonNumber: 1 },
    { id: 8, day: "Selasa", startTime: "07:45", endTime: "08:30", subject: "Fisika", teacher: "Sari Wahyuni, S.Si., M.Si.", room: "Lab Fisika", lessonNumber: 2 },
    { id: 9, day: "Selasa", startTime: "08:30", endTime: "09:15", subject: "Kimia", teacher: "Rudi Hartono, S.Si.", room: "Lab Kimia", lessonNumber: 3 },
    { id: 10, day: "Selasa", startTime: "09:30", endTime: "10:15", subject: "Kimia", teacher: "Rudi Hartono, S.Si.", room: "Lab Kimia", lessonNumber: 4 },
    { id: 11, day: "Selasa", startTime: "10:15", endTime: "11:00", subject: "Sejarah", teacher: "Hendra Gunawan, S.Hum., M.Hum.", room: "R. X-A", lessonNumber: 5 },
    { id: 12, day: "Selasa", startTime: "11:00", endTime: "11:45", subject: "Sejarah", teacher: "Hendra Gunawan, S.Hum., M.Hum.", room: "R. X-A", lessonNumber: 6 },
    { id: 13, day: "Selasa", startTime: "12:30", endTime: "13:15", subject: "Pendidikan Agama", teacher: "Usman Abdullah, S.Ag.", room: "R. X-A", lessonNumber: 7 },

    // Rabu - 6 lessons
    { id: 14, day: "Rabu", startTime: "07:00", endTime: "07:45", subject: "Bahasa Inggris", teacher: "Budi Santoso, S.Pd., M.Ed.", room: "R. X-A", lessonNumber: 1 },
    { id: 15, day: "Rabu", startTime: "07:45", endTime: "08:30", subject: "Bahasa Inggris", teacher: "Budi Santoso, S.Pd., M.Ed.", room: "R. X-A", lessonNumber: 2 },
    { id: 16, day: "Rabu", startTime: "08:30", endTime: "09:15", subject: "Biologi", teacher: "Ani Lestari, S.Si., M.Si.", room: "Lab Biologi", lessonNumber: 3 },
    { id: 17, day: "Rabu", startTime: "09:30", endTime: "10:15", subject: "Biologi", teacher: "Ani Lestari, S.Si., M.Si.", room: "Lab Biologi", lessonNumber: 4 },
    { id: 18, day: "Rabu", startTime: "10:15", endTime: "11:00", subject: "Seni Budaya", teacher: "Ratna Sari, S.Sn.", room: "R. Seni", lessonNumber: 5 },
    { id: 19, day: "Rabu", startTime: "11:00", endTime: "11:45", subject: "Seni Budaya", teacher: "Ratna Sari, S.Sn.", room: "R. Seni", lessonNumber: 6 },

    // Kamis - 6 lessons
    { id: 20, day: "Kamis", startTime: "07:00", endTime: "07:45", subject: "Matematika", teacher: "Ahmad Fauzi, S.Pd.", room: "R. X-A", lessonNumber: 1 },
    { id: 21, day: "Kamis", startTime: "07:45", endTime: "08:30", subject: "Matematika", teacher: "Ahmad Fauzi, S.Pd.", room: "R. X-A", lessonNumber: 2 },
    { id: 22, day: "Kamis", startTime: "08:30", endTime: "09:15", subject: "PKn", teacher: "Rina Wijaya, S.Sos., M.Si.", room: "R. X-A", lessonNumber: 3 },
    { id: 23, day: "Kamis", startTime: "09:30", endTime: "10:15", subject: "PKn", teacher: "Rina Wijaya, S.Sos., M.Si.", room: "R. X-A", lessonNumber: 4 },
    { id: 24, day: "Kamis", startTime: "10:15", endTime: "11:00", subject: "Prakarya", teacher: "Joko Susilo, S.Pd.", room: "R. Prakarya", lessonNumber: 5 },
    { id: 25, day: "Kamis", startTime: "11:00", endTime: "11:45", subject: "Prakarya", teacher: "Joko Susilo, S.Pd.", room: "R. Prakarya", lessonNumber: 6 },

    // Jumat - 4 lessons (shorter day)
    { id: 26, day: "Jumat", startTime: "07:00", endTime: "07:45", subject: "Bahasa Inggris", teacher: "Budi Santoso, S.Pd., M.Ed.", room: "R. X-A", lessonNumber: 1 },
    { id: 27, day: "Jumat", startTime: "07:45", endTime: "08:30", subject: "Pendidikan Agama", teacher: "Usman Abdullah, S.Ag.", room: "R. X-A", lessonNumber: 2 },
    { id: 28, day: "Jumat", startTime: "08:30", endTime: "09:15", subject: "BK", teacher: "Linda Kusuma, S.Psi.", room: "R. BK", lessonNumber: 3 },
    { id: 29, day: "Jumat", startTime: "09:30", endTime: "10:15", subject: "PJOK", teacher: "Dedi Kurniawan, S.Pd.", room: "Lapangan", lessonNumber: 4 },

    // Sabtu - 3 lessons (shorter day)
    { id: 30, day: "Sabtu", startTime: "07:00", endTime: "07:45", subject: "TIK", teacher: "Fajar Nugroho, S.Kom.", room: "Lab Komputer", lessonNumber: 1 },
    { id: 31, day: "Sabtu", startTime: "07:45", endTime: "08:30", subject: "TIK", teacher: "Fajar Nugroho, S.Kom.", room: "Lab Komputer", lessonNumber: 2 },
    { id: 32, day: "Sabtu", startTime: "08:30", endTime: "09:15", subject: "Muatan Lokal", teacher: "Yuli Astuti, S.Pd.", room: "R. X-A", lessonNumber: 3 },
];

// Mock schedule data for Child 2 (Siti Aminah - XI-B)
// Notes: Same structure as Child 1 but different subjects (IPS track - Ilmu Pengetahuan Sosial)
export const mockScheduleChild2: ScheduleItem[] = [
    // Senin - 7 lessons
    { id: 101, day: "Senin", startTime: "07:00", endTime: "07:45", subject: "Upacara", teacher: "-", room: "Lapangan", lessonNumber: 1 },
    { id: 102, day: "Senin", startTime: "07:45", endTime: "08:30", subject: "Ekonomi", teacher: "Hartati Susanti, S.E., M.E.", room: "R. XI-B", lessonNumber: 2 },
    { id: 103, day: "Senin", startTime: "08:30", endTime: "09:15", subject: "Ekonomi", teacher: "Hartati Susanti, S.E., M.E.", room: "R. XI-B", lessonNumber: 3 },
    { id: 104, day: "Senin", startTime: "09:30", endTime: "10:15", subject: "Sosiologi", teacher: "Gunawan Pratama, S.Sos., M.Si.", room: "R. XI-B", lessonNumber: 4 },
    { id: 105, day: "Senin", startTime: "10:15", endTime: "11:00", subject: "Sosiologi", teacher: "Gunawan Pratama, S.Sos., M.Si.", room: "R. XI-B", lessonNumber: 5 },
    { id: 106, day: "Senin", startTime: "11:00", endTime: "11:45", subject: "Matematika", teacher: "Ratna Dewi, S.Pd.", room: "R. XI-B", lessonNumber: 6 },
    { id: 107, day: "Senin", startTime: "12:30", endTime: "13:15", subject: "Matematika", teacher: "Ratna Dewi, S.Pd.", room: "R. XI-B", lessonNumber: 7 },

    // Selasa - 7 lessons
    { id: 108, day: "Selasa", startTime: "07:00", endTime: "07:45", subject: "Bahasa Indonesia", teacher: "Dewi Sartika, S.Pd., M.Pd.", room: "R. XI-B", lessonNumber: 1 },
    { id: 109, day: "Selasa", startTime: "07:45", endTime: "08:30", subject: "Bahasa Indonesia", teacher: "Dewi Sartika, S.Pd., M.Pd.", room: "R. XI-B", lessonNumber: 2 },
    { id: 110, day: "Selasa", startTime: "08:30", endTime: "09:15", subject: "Geografi", teacher: "Bambang Wijaya, S.Si., M.Si.", room: "R. XI-B", lessonNumber: 3 },
    { id: 111, day: "Selasa", startTime: "09:30", endTime: "10:15", subject: "Geografi", teacher: "Bambang Wijaya, S.Si., M.Si.", room: "R. XI-B", lessonNumber: 4 },
    { id: 112, day: "Selasa", startTime: "10:15", endTime: "11:00", subject: "Bahasa Inggris", teacher: "Budi Santoso, S.Pd., M.Ed.", room: "R. XI-B", lessonNumber: 5 },
    { id: 113, day: "Selasa", startTime: "11:00", endTime: "11:45", subject: "Bahasa Inggris", teacher: "Budi Santoso, S.Pd., M.Ed.", room: "R. XI-B", lessonNumber: 6 },
    { id: 114, day: "Selasa", startTime: "12:30", endTime: "13:15", subject: "Pendidikan Agama", teacher: "Usman Abdullah, S.Ag.", room: "R. XI-B", lessonNumber: 7 },

    // Rabu - 7 lessons
    { id: 115, day: "Rabu", startTime: "07:00", endTime: "07:45", subject: "Kimia", teacher: "Rudi Hartono, S.Si.", room: "Lab Kimia", lessonNumber: 1 },
    { id: 116, day: "Rabu", startTime: "07:45", endTime: "08:30", subject: "Kimia", teacher: "Rudi Hartono, S.Si.", room: "Lab Kimia", lessonNumber: 2 },
    { id: 117, day: "Rabu", startTime: "08:30", endTime: "09:15", subject: "Fisika", teacher: "Sari Wahyuni, S.Si., M.Si.", room: "Lab Fisika", lessonNumber: 3 },
    { id: 118, day: "Rabu", startTime: "09:30", endTime: "10:15", subject: "Fisika", teacher: "Sari Wahyuni, S.Si., M.Si.", room: "Lab Fisika", lessonNumber: 4 },
    { id: 119, day: "Rabu", startTime: "10:15", endTime: "11:00", subject: "Sejarah", teacher: "Hendra Gunawan, S.Hum., M.Hum.", room: "R. XI-B", lessonNumber: 5 },
    { id: 120, day: "Rabu", startTime: "11:00", endTime: "11:45", subject: "Sejarah", teacher: "Hendra Gunawan, S.Hum., M.Hum.", room: "R. XI-B", lessonNumber: 6 },
    { id: 121, day: "Rabu", startTime: "12:30", endTime: "13:15", subject: "PJOK", teacher: "Dedi Kurniawan, S.Pd.", room: "Lapangan", lessonNumber: 7 },

    // Kamis - 6 lessons
    { id: 122, day: "Kamis", startTime: "07:00", endTime: "07:45", subject: "Biologi", teacher: "Ani Lestari, S.Si., M.Si.", room: "Lab Biologi", lessonNumber: 1 },
    { id: 123, day: "Kamis", startTime: "07:45", endTime: "08:30", subject: "Biologi", teacher: "Ani Lestari, S.Si., M.Si.", room: "Lab Biologi", lessonNumber: 2 },
    { id: 124, day: "Kamis", startTime: "08:30", endTime: "09:15", subject: "PKn", teacher: "Rina Wijaya, S.Sos., M.Si.", room: "R. XI-B", lessonNumber: 3 },
    { id: 125, day: "Kamis", startTime: "09:30", endTime: "10:15", subject: "Bimbingan Konseling", teacher: "Linda Kusuma, S.Psi.", room: "R. BK", lessonNumber: 4 },
    { id: 126, day: "Kamis", startTime: "10:15", endTime: "11:00", subject: "Seni Budaya", teacher: "Ratna Sari, S.Sn.", room: "R. Seni", lessonNumber: 5 },
    { id: 127, day: "Kamis", startTime: "11:00", endTime: "11:45", subject: "Seni Budaya", teacher: "Ratna Sari, S.Sn.", room: "R. Seni", lessonNumber: 6 },

    // Jumat - 4 lessons (shorter day)
    { id: 128, day: "Jumat", startTime: "07:00", endTime: "07:45", subject: "Matematika", teacher: "Ratna Dewi, S.Pd.", room: "R. XI-B", lessonNumber: 1 },
    { id: 129, day: "Jumat", startTime: "07:45", endTime: "08:30", subject: "Matematika", teacher: "Ratna Dewi, S.Pd.", room: "R. XI-B", lessonNumber: 2 },
    { id: 130, day: "Jumat", startTime: "08:30", endTime: "09:15", subject: "Ekonomi", teacher: "Hartati Susanti, S.E., M.E.", room: "R. XI-B", lessonNumber: 3 },
    { id: 131, day: "Jumat", startTime: "09:30", endTime: "10:15", subject: "Prakarya", teacher: "Joko Susilo, S.Pd.", room: "R. Prakarya", lessonNumber: 4 },

    // Sabtu - 4 lessons (shorter day)
    { id: 132, day: "Sabtu", startTime: "07:00", endTime: "07:45", subject: "TIK", teacher: "Fajar Nugroho, S.Kom.", room: "Lab Komputer", lessonNumber: 1 },
    { id: 133, day: "Sabtu", startTime: "07:45", endTime: "08:30", subject: "TIK", teacher: "Fajar Nugroho, S.Kom.", room: "Lab Komputer", lessonNumber: 2 },
    { id: 134, day: "Sabtu", startTime: "08:30", endTime: "09:15", subject: "Muatan Lokal", teacher: "Yuli Astuti, S.Pd.", room: "R. XI-B", lessonNumber: 3 },
    { id: 135, day: "Sabtu", startTime: "09:30", endTime: "10:15", subject: "Bahasa Indonesia", teacher: "Dewi Sartika, S.Pd., M.Pd.", room: "R. XI-B", lessonNumber: 4 },
];

// Academic years data
// Note: Active year/semester must match AcademicYearContext (2025/2026, Ganjil)
// Using "Ganjil"/"Genap" labels for consistency with ActiveAcademicYearBadge
export const mockAcademicYears: AcademicYearData[] = [
    {
        id: "year-2023-2024",
        year: "2023/2024",
        semesters: [
            { id: "sem-1-2023", name: "Ganjil", isActive: false },
            { id: "sem-2-2023", name: "Genap", isActive: false },
        ],
    },
    {
        id: "year-2024-2025",
        year: "2024/2025",
        semesters: [
            { id: "sem-1-2024", name: "Ganjil", isActive: false },
            { id: "sem-2-2024", name: "Genap", isActive: false },
        ],
    },
    {
        id: "year-2025-2026",
        year: "2025/2026",
        semesters: [
            { id: "sem-1-2025", name: "Ganjil", isActive: true },
            { id: "sem-2-2025", name: "Genap", isActive: false },
        ],
    },
];

// Map child IDs to their schedules
export const childScheduleMap: Record<string, ChildScheduleData> = {
    "student-1": {
        childId: "student-1",
        childName: "Ahmad Santoso",
        childClass: "X-A",
        schedule: mockScheduleChild1,
    },
    "student-2": {
        childId: "student-2",
        childName: "Siti Aminah",
        childClass: "XI-B",
        schedule: mockScheduleChild2,
    },
};
