'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { AlumniFormValues, alumniSchema } from '../../schemas/alumniSchema';
import { AdminAlumni as Alumni } from '../../types/alumni';

interface AlumniFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Alumni | null;
    onSubmit: (data: AlumniFormValues) => void;
}

export const AlumniForm: React.FC<AlumniFormProps> = ({
    open,
    onOpenChange,
    initialData,
    onSubmit,
}) => {
    const form = useForm<AlumniFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(alumniSchema) as any,
        defaultValues: {
            nisn: '',
            name: '',
            graduationYear: '',
            className: '',
            phone: '',
            university: '',
            job: '',
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                nisn: initialData.admission_number ?? '',
                name: initialData.name,
                graduationYear: initialData.graduation_year ?? '',
                className: initialData.last_class_name ?? '',
                phone: initialData.phone ?? '',
                university: '',
                job: '',
            });
        } else {
            form.reset({
                nisn: '',
                name: '',
                graduationYear: '',
                className: '',
                phone: '',
                university: '',
                job: '',
            });
        }
    }, [initialData, form, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Data Alumni' : 'Tambah Data Alumni'}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name="nisn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>NISN</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nomor NISN" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="graduationYear"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tahun Lulus</FormLabel>
                                        <FormControl>
                                            <Input placeholder="202X" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Alumni</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nama Lengkap" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="className"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kelas Terakhir</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: XII-IPA-1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>No. Telepon</FormLabel>
                                        <FormControl>
                                            <Input placeholder="08..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <FormField
                            control={form.control}
                            name="university"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Universitas (Opsional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nama Kampus" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="job"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pekerjaan (Opsional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Pekerjaan saat ini" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Batal
                            </Button>
                            <Button type="submit">Simpan</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
