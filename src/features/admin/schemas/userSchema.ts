import { z } from 'zod';

export const userSchema = z.object({
    name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
    email: z.string().email('Format email tidak valid'),
    username: z.string().min(4, 'Username minimal 4 karakter').regex(/^[a-z0-9._]+$/, 'Username hanya boleh huruf kecil, angka, titik, dan underscore'),
    role: z.enum(['admin', 'teacher', 'student', 'parent', 'staff']),
    status: z.enum(['active', 'inactive', 'suspended']),
    password: z.string().optional(), // Optional for edit, required logic handled in UI/Backend usually
});

export type UserFormValues = z.infer<typeof userSchema>;
