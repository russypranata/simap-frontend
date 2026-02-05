import { z } from 'zod';

export const mutationSchema = z.object({
    studentName: z.string().min(1, 'Nama siswa harus diisi'),
    nisn: z.string().min(1, 'NISN harus diisi'),
    type: z.enum(['in', 'out']),
    reason: z.string().min(1, 'Alasan harus diisi'),
    schoolOrigin: z.string().optional(),
    schoolDestination: z.string().optional(),
    date: z.string().min(1, 'Tanggal harus diisi'),
    status: z.enum(['approved', 'pending', 'rejected']),
});

export type MutationFormValues = z.infer<typeof mutationSchema>;
