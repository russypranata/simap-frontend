'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Loader2, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';

import { CurriculumFormValues, curriculumSchema } from '../../schemas/curriculumSchema';
import { Curriculum } from '../../types/curriculum';
import { academicYearService } from '../../services/academicYearService';

interface CurriculumFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Curriculum | null;
    onSubmit: (data: CurriculumFormValues) => Promise<void>;
    isSubmitting?: boolean;
}

export const CurriculumForm: React.FC<CurriculumFormProps> = ({
    open, onOpenChange, initialData, onSubmit, isSubmitting = false,
}) => {
    const form = useForm<CurriculumFormValues>({
        resolver: zodResolver(curriculumSchema),
        defaultValues: { name: '', code: '', description: '', academicYearId: '', status: 'draft' },
    });

    const { data: academicYears = [] } = useQuery({
        queryKey: ['academic-years-dropdown'],
        queryFn:  () => academicYearService.getAcademicYears(),
        staleTime: 10 * 60 * 1000,
    });

    useEffect(() => {
        if (open) {
            form.reset(initialData ? {
                name:           initialData.name,
                code:           initialData.code,
                description:    initialData.description,
                academicYearId: initialData.academicYearId,
                status:         initialData.status,
            } : { name: '', code: '', description: '', academicYearId: '', status: 'draft' });
        }
    }, [initialData, open, form]);

    const handleSubmit = async (values: CurriculumFormValues) => {
        await onSubmit(values);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold text-slate-800">
                                {initialData ? 'Edit Kurikulum' : 'Tambah Kurikulum'}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-slate-500 mt-0.5">
                                {initialData ? 'Perbarui informasi kurikulum.' : 'Isi data kurikulum baru.'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Nama Kurikulum <span className="text-red-500">*</span></FormLabel>
                                <FormControl><Input placeholder="Contoh: Kurikulum Merdeka 2025" autoComplete="off" {...field} /></FormControl>
                                <FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="code" render={({ field }) => (
                                <FormItem><FormLabel>Kode <span className="text-red-500">*</span></FormLabel>
                                    <FormControl><Input placeholder="KM-2025" autoComplete="off" {...field} /></FormControl>
                                    <FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Status <span className="text-red-500">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="active">Aktif</SelectItem>
                                            <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="academicYearId" render={({ field }) => (
                            <FormItem><FormLabel>Tahun Ajaran</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Pilih tahun ajaran (opsional)" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {academicYears.map((y) => (
                                            <SelectItem key={y.id} value={y.id}>
                                                {y.name}{y.isActive ? ' (Aktif)' : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Deskripsi</FormLabel>
                                <FormControl><Textarea placeholder="Deskripsi singkat kurikulum..." className="resize-none h-20" {...field} /></FormControl>
                                <FormMessage /></FormItem>
                        )} />
                        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-blue-800 hover:bg-blue-900 text-white min-w-[120px]" disabled={isSubmitting}>
                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
