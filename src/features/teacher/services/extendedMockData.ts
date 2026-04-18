 
// Extended mock data for attendance and journals based on weekly schedule
import { AttendanceRecord, TeachingJournal } from '../types/teacher';
import { mockTeacher, mockStudents } from './mockData';
import { extendedMockSchedule } from './extendedMockSchedule';

// Helper to group consecutive schedules
interface ScheduleGroup {
    day: string;
    class: string;
    subject: string;
    startTime: string;
    endTime: string;
    lessonHour: string;
    scheduleIds: string[];
}

const groupSchedules = (): ScheduleGroup[] => {
    const groups: ScheduleGroup[] = [];

    // Sort by day and time
    const sorted = [...extendedMockSchedule].sort((a, b) => {
        const dayOrder = { 'Senin': 1, 'Selasa': 2, 'Rabu': 3, 'Kamis': 4, 'Jumat': 5, 'Sabtu': 6 };
        const dayDiff = (dayOrder[a.day] || 0) - (dayOrder[b.day] || 0);
        if (dayDiff !== 0) return dayDiff;
        return a.time.localeCompare(b.time);
    });

    let currentGroup: typeof extendedMockSchedule = [];

    sorted.forEach((schedule, index) => {
        if (currentGroup.length === 0) {
            currentGroup.push(schedule);
        } else {
            const lastSchedule = currentGroup[currentGroup.length - 1];
            const lastEndTime = lastSchedule.time.split(' - ')[1];
            const currentStartTime = schedule.time.split(' - ')[0];

            // Check if consecutive and same subject/class/day
            if (
                lastSchedule.day === schedule.day &&
                lastEndTime === currentStartTime &&
                lastSchedule.subject === schedule.subject &&
                lastSchedule.class === schedule.class
            ) {
                currentGroup.push(schedule);
            } else {
                // Save current group
                groups.push(createGroup(currentGroup));
                currentGroup = [schedule];
            }
        }

        // Handle last group
        if (index === sorted.length - 1) {
            groups.push(createGroup(currentGroup));
        }
    });

    return groups;
};

const createGroup = (schedules: typeof extendedMockSchedule): ScheduleGroup => {
    const first = schedules[0];
    const last = schedules[schedules.length - 1];

    // Calculate lesson hours
    const getLessonNumber = (time: string): number => {
        const timeMap: Record<string, number> = {
            '07:00': 1, '07:45': 2, '08:30': 3, '09:15': 4,
            '10:15': 5, '11:00': 6, '11:45': 7,
            '13:00': 8, '13:45': 9
        };
        const startTime = time.split(' - ')[0];
        return timeMap[startTime] || 1;
    };

    const startLesson = getLessonNumber(first.time);
    const endLesson = getLessonNumber(last.time);
    const lessonHour = startLesson === endLesson ? `${startLesson}` : `${startLesson}-${endLesson}`;

    return {
        day: first.day,
        class: first.class,
        subject: first.subject,
        startTime: first.time.split(' - ')[0],
        endTime: last.time.split(' - ')[1],
        lessonHour,
        scheduleIds: schedules.map(s => s.id),
    };
};

// Get grouped schedules
const groupedSchedules = groupSchedules();

console.log(`📊 Generated ${groupedSchedules.length} schedule groups from ${extendedMockSchedule.length} individual schedules`);

// Use static dates
const MOCK_FRIDAY = '2025-11-22'; // Last Friday
const MOCK_THURSDAY = '2025-11-21';
const MOCK_WEDNESDAY = '2025-11-20';
const MOCK_TUESDAY = '2025-11-19';
const MOCK_MONDAY = '2025-11-18';

// Historical Data (One representative week per month for trend demo)





const dateScheduleMap: Record<string, string> = {
    // Current Week (Nov)
    [MOCK_MONDAY]: 'Senin',
    [MOCK_TUESDAY]: 'Selasa',
    [MOCK_WEDNESDAY]: 'Rabu',
    [MOCK_THURSDAY]: 'Kamis',
    [MOCK_FRIDAY]: 'Jumat',

    // --- SEMESTER GANJIL (Juli - Desember 2025) ---
    // Juli 2025 (Week 4)
    '2025-07-21': 'Senin', '2025-07-22': 'Selasa', '2025-07-23': 'Rabu', '2025-07-24': 'Kamis', '2025-07-25': 'Jumat',
    // Agustus 2025 (Week 3)
    '2025-08-18': 'Senin', '2025-08-19': 'Selasa', '2025-08-20': 'Rabu', '2025-08-21': 'Kamis', '2025-08-22': 'Jumat',
    // September 2025 (Week 3)
    '2025-09-15': 'Senin', '2025-09-16': 'Selasa', '2025-09-17': 'Rabu', '2025-09-18': 'Kamis', '2025-09-19': 'Jumat',
    // Oktober 2025 (Week 4)
    '2025-10-20': 'Senin', '2025-10-21': 'Selasa', '2025-10-22': 'Rabu', '2025-10-23': 'Kamis', '2025-10-24': 'Jumat',
    // November 2025 (Week 3 - distinct from current week)
    '2025-11-10': 'Senin', '2025-11-11': 'Selasa', '2025-11-12': 'Rabu', '2025-11-13': 'Kamis', '2025-11-14': 'Jumat',
    // Desember 2025 (Week 2)
    '2025-12-08': 'Senin', '2025-12-09': 'Selasa', '2025-12-10': 'Rabu', '2025-12-11': 'Kamis', '2025-12-12': 'Jumat',

    // --- SEMESTER GENAP (Januari - Juni 2026) ---
    // Januari 2026 (Week 4)
    '2026-01-19': 'Senin', '2026-01-20': 'Selasa', '2026-01-21': 'Rabu', '2026-01-22': 'Kamis', '2026-01-23': 'Jumat',
    // Februari 2026 (Week 3)
    '2026-02-16': 'Senin', '2026-02-17': 'Selasa', '2026-02-18': 'Rabu', '2026-02-19': 'Kamis', '2026-02-20': 'Jumat',
    // Maret 2026 (Week 3)
    '2026-03-16': 'Senin', '2026-03-17': 'Selasa', '2026-03-18': 'Rabu', '2026-03-19': 'Kamis', '2026-03-20': 'Jumat',
    // April 2026 (Week 4)
    '2026-04-20': 'Senin', '2026-04-21': 'Selasa', '2026-04-22': 'Rabu', '2026-04-23': 'Kamis', '2026-04-24': 'Jumat',
    // Mei 2026 (Week 3)
    '2026-05-18': 'Senin', '2026-05-19': 'Selasa', '2026-05-20': 'Rabu', '2026-05-21': 'Kamis', '2026-05-22': 'Jumat',
    // Juni 2026 (Week 2)
    '2026-06-08': 'Senin', '2026-06-09': 'Selasa', '2026-06-10': 'Rabu', '2026-06-11': 'Kamis', '2026-06-12': 'Jumat',
};

// Generate attendance records based on grouped schedules
export const extendedMockAttendanceRecords: AttendanceRecord[] = [];

let attendanceId = 1;

Object.entries(dateScheduleMap).forEach(([date, day]) => {
    const dayGroups = groupedSchedules.filter(g => g.day === day);

    dayGroups.forEach(group => {
        const classStudents = mockStudents.filter(s => s.class === group.class);

        if (classStudents.length > 0) {
            classStudents.forEach((student) => {
                // Randomize attendance status (mostly present)
                let status: 'hadir' | 'sakit' | 'izin' | 'tanpa-keterangan' = 'hadir';
                let notes = '';

                const rand = Math.random();

                // FORCE LOW ATTENDANCE FOR DEMO
                if (student.name === 'Muhammad Fadli') {
                    // Fadli sering bolos (60% Alpha)
                    if (rand < 0.6) {
                        status = 'tanpa-keterangan';
                        notes = 'Bolos';
                    }
                } else if (student.name === 'Dewi Anggraini') {
                    // Dewi sering sakit (50% Sakit)
                    if (rand < 0.5) {
                        status = 'sakit';
                        notes = 'Sakit menahun';
                    }
                } else {
                    // Normal students - Variability based on Month
                    const month = new Date(date).getMonth() + 1; // 1-12
                    let sickProb = 0.05;
                    let permitProb = 0.03;

                    // Simulate trends:
                    // July/Aug (7,8): High attendance (low prob)
                    // Sept/Oct (9,10): Mid semester burnout (higher prob)
                    if (month === 7 || month === 8) {
                        sickProb = 0.02;
                        permitProb = 0.01;
                    } else if (month === 9 || month === 10) {
                        sickProb = 0.08; // Higher sickness in Oct
                        permitProb = 0.05;
                    }

                    if (rand < sickProb) {
                        status = 'sakit';
                        notes = 'Demam';
                    } else if (rand < (sickProb + permitProb)) {
                        status = 'izin';
                        notes = 'Keperluan keluarga';
                    }
                }

                extendedMockAttendanceRecords.push({
                    id: String(attendanceId++),
                    studentId: student.id,
                    studentName: student.name,
                    class: group.class,
                    date,
                    status,
                    subject: group.subject,
                    teacher: mockTeacher.name,
                    lessonHour: group.lessonHour,
                    notes,
                    academicYear: '2025/2026',
                    semester: (new Date(date).getMonth() + 1) >= 7 ? 'Ganjil' : 'Genap',
                });
            });
        }
    });
});

console.log(`✅ Generated ${extendedMockAttendanceRecords.length} attendance records for ${groupedSchedules.length} schedule groups`);


// Generate teaching journals based on grouped schedules
export const extendedMockTeachingJournals: TeachingJournal[] = [];

let journalId = 1;

console.log(`📝 Starting to generate teaching journals...`);

Object.entries(dateScheduleMap).forEach(([date, day]) => {
    const dayGroups = groupedSchedules.filter(g => g.day === day);

    dayGroups.forEach(group => {
        const classStudents = mockStudents.filter(s => s.class === group.class);
        const totalStudents = classStudents.length || 30; // Default 30 if no students
        const presentCount = Math.floor(totalStudents * 0.92); // 92% present
        const sickCount = Math.floor(totalStudents * 0.05); // 5% sick
        const permitCount = Math.floor(totalStudents * 0.03); // 3% permit
        const absentCount = totalStudents - presentCount - sickCount - permitCount;

        // Sample materials by subject
        const materials: Record<string, { material: string, topic: string, learningObjective: string }> = {
            'Matematika': {
                material: 'Turunan Fungsi',
                topic: 'Turunan fungsi aljabar dan trigonometri',
                learningObjective: 'Siswa dapat menentukan turunan fungsi aljabar menggunakan sifat-sifat turunan'
            },
            'Fisika': {
                material: 'Hukum Newton',
                topic: 'Hukum Newton I, II, dan III serta aplikasinya',
                learningObjective: 'Siswa dapat menerapkan Hukum Newton dalam menyelesaikan permasalahan gerak lurus'
            },
            'Biologi': {
                material: 'Sel dan Jaringan',
                topic: 'Struktur dan fungsi sel tumbuhan dan hewan',
                learningObjective: 'Siswa dapat membedakan struktur dan fungsi sel hewan dan sel tumbuhan'
            },
        };

        const subjectMaterial = materials[group.subject] || {
            material: `Materi ${group.subject}`,
            topic: `Topik ${group.subject}`,
            learningObjective: `Siswa dapat memahami konsep dasar ${group.subject}`
        };

        // Manually assign semester for mock data testing
        // July-December = Ganjil
        // January-June = Genap
        const month = new Date(date).getMonth() + 1;
        const semester: 'Ganjil' | 'Genap' = (month >= 7) ? 'Ganjil' : 'Genap';

        extendedMockTeachingJournals.push({
            id: String(journalId++),
            date,
            class: group.class,
            subject: group.subject,
            lessonHour: group.lessonHour,
            material: subjectMaterial.material,
            topic: subjectMaterial.topic,
            learningObjective: subjectMaterial.learningObjective,
            teachingMethod: 'Ceramah, Diskusi, Latihan Soal',
            media: 'Papan tulis, LCD, Modul',
            evaluation: 'Tugas individu dan diskusi kelompok',
            notes: 'Siswa aktif dan antusias dalam pembelajaran',
            attendance: {
                total: totalStudents,
                present: presentCount,
                sick: sickCount,
                permit: permitCount,
                absent: absentCount,
            },
            academicYear: '2025/2026',
            semester: semester,
            createdAt: `${date}T14:30:00`,
            updatedAt: `${date}T16:45:00`,
            startTime: group.startTime,
            endTime: group.endTime,
        });

        // Debug log first few entries
        if (journalId <= 5) {
            console.log(`📝 Journal ${journalId}: Date=${date}, Month=${month}, Semester=${semester}`);
        }
    });
});


console.log(`✅ Generated ${extendedMockTeachingJournals.length} teaching journals for ${groupedSchedules.length} schedule groups`);

// Debug: Show semester distribution
const ganjilCount = extendedMockTeachingJournals.filter(j => j.semester === 'Ganjil').length;
const genapCount = extendedMockTeachingJournals.filter(j => j.semester === 'Genap').length;
console.log(`📊 Semester distribution - Ganjil: ${ganjilCount}, Genap: ${genapCount}`);
