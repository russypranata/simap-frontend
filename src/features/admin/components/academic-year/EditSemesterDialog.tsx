'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, Loader2, Info } from 'lucide-react';

import { Semester } from '../../types/academicYear';

// Validation schema
const formSchema = z.object({
    startDate: z
        .string()
        .min(1, 'Tanggal mulai wajib diisi'),
    endDate: z
        .string()
        .min(1, 'Tanggal selesai wajib diisi'),
}).refine((data) => {
    if (data.startDate && data.endDate) {
        return new Date(data.startDate) < new Date(data.endDate);
    }
    return true;
}, {
    message: 'Tanggal selesai harus setelah tanggal mulai',
    path: ['endDate'],
});

type FormValues = z.infer<typeof formSchema>;

interface EditSemesterDialogProps {
    semester: Semester | null;
    academicYearId: string;
    academicYearStartDate: string;
    academicYearEndDate: string;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (semesterId: string, startDate: string, endDate: string) => Promise<void>;
}

export const EditSemesterDialog: React.FC<EditSemesterDialogProps> = ({
    semester,
    academicYearId,
    academicYearStartDate,
    academicYearEndDate,
    isOpen,
    onClose,
    onUpdate,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            startDate: '',
            endDate: '',
        },
    });

    // Update form when semester changes
    useEffect(() => {
        if (semester) {
            form.reset({
                startDate: semester.startDate,
                endDate: semester.endDate,
            });
        }
    }, [semester, form]);

    const onSubmit = async (values: FormValues) => {
        if (!semester) return;

        // Additional validation: within academic year range
        const semStart = new Date(values.startDate);
        const semEnd = new Date(values.endDate);
        const yearStart = new Date(academicYearStartDate);
        const yearEnd = new Date(academicYearEndDate);

        if (semStart < yearStart || semEnd > yearEnd) {
            form.setError('endDate', {
                message: 'Tanggal semester harus dalam rentang tahun ajaran',
            });
            return;
        }

        try {
            setIsSubmitting(true);
            await onUpdate(semester.id, values.startDate, values.endDate);
            onClose();
        } catch (error) {
            console.error('Failed to update semester:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!semester) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle>Edit Semester {semester.name}</DialogTitle>
                            <DialogDescription>
                                Sesuaikan periode semester {semester.name.toLowerCase()}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Info Alert */}
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start gap-2">
                                <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-amber-800">
                                    Tanggal semester harus berada dalam rentang tahun ajaran ({new Date(academicYearStartDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(academicYearEndDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })})
                                </p>
                            </div>
                        </div>

                        {/* Start Date */}
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tanggal Mulai</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-[11px] flex items-center gap-1.5 text-slate-500 mt-1">
                                        <Info className="h-3 w-3 text-blue-500 shrink-0" />
                                        Tanggal mulai semester {semester.name.toLowerCase()}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* End Date */}
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tanggal Selesai</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-[11px] flex items-center gap-1.5 text-slate-500 mt-1">
                                        <Info className="h-3 w-3 text-blue-500 shrink-0" />
                                        Tanggal selesai semester {semester.name.toLowerCase()}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-800 hover:bg-blue-900 text-white"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Simpan Perubahan
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
