import { z } from 'zod';

export const parentSchema = z.object({
    name: z.string().min(1, 'Nama harus diisi'),
    email: z.string().email('Email tidak valid'),
    phone: z.string().min(10, 'Nomor telepon tidak valid'),
    occupation: z.string().min(1, 'Pekerjaan harus diisi'),
    address: z.string().min(1, 'Alamat harus diisi'),
    status: z.enum(['active', 'inactive']),
});

export type ParentFormValues = z.infer<typeof parentSchema>;
