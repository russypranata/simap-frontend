import { z } from 'zod';

export const staffSchema = z.object({
    nip: z.string().min(1, 'NIP harus diisi'),
    name: z.string().min(1, 'Nama harus diisi'),
    role: z.enum(['teacher', 'admin', 'staff', 'librarian', 'security']),
    subject: z.string().optional(),
    phone: z.string().min(10, 'Nomor telepon tidak valid'),
    email: z.string().email('Email tidak valid'),
    status: z.enum(['active', 'inactive', 'leave']),
    joinDate: z.string().min(1, 'Tanggal bergabung harus diisi'),
});

export type StaffFormValues = z.infer<typeof staffSchema>;
