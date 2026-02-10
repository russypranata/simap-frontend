import { z } from 'zod';

export const scheduleSchema = z.object({
    day: z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format waktu HH:MM'),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format waktu HH:MM'),
    subjectId: z.string().min(1, 'Mata pelajaran harus dipilh'),
    classId: z.string().min(1, 'Kelas harus dipilih'),
    teacherId: z.string().min(1, 'Guru harus dipilih'),
    subjectName: z.string().optional(),
    className: z.string().optional(),
    teacherName: z.string().optional(),
    room: z.string().min(1, 'Ruangan harus diisi'),
    academicYear: z.string().min(1, 'Tahun ajaran harus diisi'),
    semester: z.string().min(1, 'Semester harus diisi'),
});

export type ScheduleFormValues = z.infer<typeof scheduleSchema>;
