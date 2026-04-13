import { z } from 'zod';

export const scheduleSchema = z.object({
    day: z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format waktu HH:MM'),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format waktu HH:MM'),
    subjectId: z.string().min(1, 'Mata pelajaran harus dipilih'),
    classId: z.string().min(1, 'Kelas harus dipilih'),
    teacherId: z.string().optional(),
    room: z.string().optional(),
});

export type ScheduleFormValues = z.infer<typeof scheduleSchema>;
