import { z } from 'zod';

export const calendarEventSchema = z.object({
    title: z.string().min(3, 'Judul kegiatan minimal 3 karakter'),
    description: z.string().optional(),
    startDate: z.string().min(1, 'Tanggal mulai harus diisi'),
    endDate: z.string().min(1, 'Tanggal selesai harus diisi'),
    type: z.enum(['holiday', 'exam', 'event', 'meeting']),
    isHoliday: z.boolean(),
}).refine((data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
}, {
    message: "Tanggal selesai tidak boleh sebelum tanggal mulai",
    path: ["endDate"],
});

export type CalendarEventFormValues = z.infer<typeof calendarEventSchema>;
