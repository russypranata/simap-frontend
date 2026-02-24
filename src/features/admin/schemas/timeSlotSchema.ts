import { z } from 'zod';

export const timeSlotSchema = z.object({
  id: z.string(),
  label: z.string().min(1, 'Label wajib diisi'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format waktu invalid (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format waktu invalid (HH:MM)'),
  order: z.number(),
  type: z.enum(['lesson', 'break', 'ceremony', 'ishoma']),
  day: z.string().optional(),
}).refine((data) => {
  return data.endTime > data.startTime;
}, {
  message: "Jam selesai harus setelah jam mulai",
  path: ["endTime"],
});

export const timeSlotsArraySchema = z.array(timeSlotSchema);

export type TimeSlotFormValues = z.infer<typeof timeSlotSchema>;
