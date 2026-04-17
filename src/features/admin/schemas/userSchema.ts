import { z } from 'zod';

export const USER_ROLES = [
    'admin',
    'subject_teacher',
    'picket_teacher',
    'homeroom_teacher',
    'student',
    'parent',
    'extracurricular_tutor',
    'mutamayizin_coordinator',
    'headmaster',
] as const;

export const USER_ROLE_LABELS: Record<typeof USER_ROLES[number], string> = {
    admin: 'Administrator',
    subject_teacher: 'Guru Mapel',
    picket_teacher: 'Guru Piket',
    homeroom_teacher: 'Wali Kelas',
    student: 'Siswa',
    parent: 'Wali Murid',
    extracurricular_tutor: 'Tutor Ekskul',
    mutamayizin_coordinator: 'PJ Mutamayizin',
    headmaster: 'Kepala Sekolah',
};

const baseUserSchema = z.object({
    name: z.string().min(3, 'Nama minimal 3 karakter'),
    email: z.string().email('Format email tidak valid'),
    username: z
        .string()
        .min(3, 'Username minimal 3 karakter')
        .regex(/^[a-z0-9._]+$/, 'Hanya huruf kecil, angka, titik, underscore'),
    role: z.enum(USER_ROLES, { error: 'Role wajib dipilih' }),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    dob: z.string().optional(),
    birth_place: z.string().optional(),
});

export const createUserSchema = baseUserSchema.extend({
    password: z.string().min(8, 'Password minimal 8 karakter'),
});

export const editUserSchema = baseUserSchema.extend({
    password: z
        .string()
        .min(8, 'Password minimal 8 karakter')
        .optional()
        .or(z.literal('')),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type EditUserFormValues = z.infer<typeof editUserSchema>;
export type UserFormValues = CreateUserFormValues | EditUserFormValues;

// Legacy export
export const userSchema = createUserSchema;
