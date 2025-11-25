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

const dateScheduleMap: Record<string, string> = {
    [MOCK_MONDAY]: 'Senin',
    [MOCK_TUESDAY]: 'Selasa',
    [MOCK_WEDNESDAY]: 'Rabu',
    [MOCK_THURSDAY]: 'Kamis',
    [MOCK_FRIDAY]: 'Jumat',
};

// Generate attendance records based on grouped schedules
export const extendedMockAttendanceRecords: AttendanceRecord[] = [];

let attendanceId = 1;

Object.entries(dateScheduleMap).forEach(([date, day]) => {
    const dayGroups = groupedSchedules.filter(g => g.day === day);

    dayGroups.forEach(group => {
        const classStudents = mockStudents.filter(s => s.class === group.class);

        // If no students in mockData, create dummy count
        const studentCount = classStudents.length || 30;

        if (classStudents.length > 0) {
            classStudents.forEach((student) => {
                // Randomize attendance status (mostly present)
                let status: 'hadir' | 'sakit' | 'izin' | 'tanpa-keterangan' = 'hadir';
                let notes = '';

                const rand = Math.random();
                if (rand < 0.05) { // 5% sick
                    status = 'sakit';
                    notes = 'Demam';
                } else if (rand < 0.08) { // 3% permit
                    status = 'izin';
                    notes = 'Keperluan keluarga';
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
                });
            });
        }
    });
});

console.log(`✅ Generated ${extendedMockAttendanceRecords.length} attendance records for ${groupedSchedules.length} schedule groups`);

// Generate teaching journals based on grouped schedules
export const extendedMockTeachingJournals: TeachingJournal[] = [];

let journalId = 1;

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
        const materials: Record<string, { material: string, topic: string }> = {
            'Matematika': {
                material: 'Turunan Fungsi',
                topic: 'Turunan fungsi aljabar dan trigonometri'
            },
            'Fisika': {
                material: 'Hukum Newton',
                topic: 'Hukum Newton I, II, dan III serta aplikasinya'
            },
        };

        const subjectMaterial = materials[group.subject] || {
            material: `Materi ${group.subject}`,
            topic: `Topik ${group.subject}`
        };

        extendedMockTeachingJournals.push({
            id: String(journalId++),
            date,
            class: group.class,
            subject: group.subject,
            lessonHour: group.lessonHour,
            material: subjectMaterial.material,
            topic: subjectMaterial.topic,
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
        });
    });
});

console.log(`✅ Generated ${extendedMockTeachingJournals.length} teaching journals for ${groupedSchedules.length} schedule groups`);
