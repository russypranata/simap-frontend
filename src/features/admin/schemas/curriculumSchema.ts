import { z } from 'zod';

export const curriculumSchema = z.object({
    name: z.string().min(3, 'Nama kurikulum minimal 3 karakter'),
    code: z.string().min(2, 'Kode minimal 2 karakter'),
    description: z.string().optional(),
    academicYearId: z.string().min(1, 'Tahun ajaran harus dipilih'),
    status: z.enum(['active', 'inactive', 'draft']),
});

export type CurriculumFormValues = z.infer<typeof curriculumSchema>;
