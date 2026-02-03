import { z } from 'zod';

export const alumniSchema = z.object({
    nisn: z.string().min(1, 'NISN harus diisi'),
    name: z.string().min(1, 'Nama harus diisi'),
    graduationYear: z.string().min(4, 'Tahun lulus harus 4 digit'),
    className: z.string().min(1, 'Kelas terakhir harus diisi'),
    phone: z.string().min(1, 'Nomor telepon harus diisi'),
    university: z.string().optional(),
    job: z.string().optional(),
});

export type AlumniFormValues = z.infer<typeof alumniSchema>;
