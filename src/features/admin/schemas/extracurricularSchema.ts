import { z } from 'zod';

export const extracurricularSchema = z.object({
    name: z.string().min(3, 'Nama ekskul minimal 3 karakter'),
    category: z.enum(['Olahraga', 'Seni', 'Akademik', 'Keagamaan', 'Lainnya']),
    mentorId: z.string().min(1, 'Pembina harus dipilih'),
    mentorName: z.string().min(1, 'Nama pembina harus diisi'),
    day: z.string().min(1, 'Hari harus diisi'),
    time: z.string().min(1, 'Waktu pelaksanaan harus diisi'),
    maxCapacity: z.number().min(1, 'Kapasitas maksimal minimal 1'),
    location: z.string().optional(),
    description: z.string().optional(),
    academicYearId: z.string().min(1, 'ID Tahun Ajaran harus diisi'),
});

export type ExtracurricularFormValues = z.infer<typeof extracurricularSchema>;
