'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { MutationFormValues, mutationSchema } from '../../schemas/mutationSchema';

interface MutationFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: MutationFormValues) => void;
}

export const MutationForm: React.FC<MutationFormProps> = ({
    open,
    onOpenChange,
    onSubmit,
}) => {
    const form = useForm<MutationFormValues>({
        resolver: zodResolver(mutationSchema),
        defaultValues: {
            studentName: '',
            nisn: '',
            type: 'out',
            reason: '',
            schoolOrigin: '',
            schoolDestination: '',
            date: '',
            status: 'pending',
        },
    });

    // eslint-disable-next-line react-hooks/incompatible-library
    const type = form.watch('type');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Input Data Mutasi</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jenis Mutasi</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih jenis" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="in">Masuk (Siswa Pindahan)</SelectItem>
                                            <SelectItem value="out">Keluar (Pindah Sekolah)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="studentName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Siswa</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nama Lengkap" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                        </div>

                        {type === 'in' ? (
                            <FormField
                                control={form.control}
                                name="schoolOrigin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sekolah Asal</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nama sekolah sebelumnya" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <FormField
                                control={form.control}
                                name="schoolDestination"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sekolah Tujuan</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nama sekolah tujuan" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tanggal Mutasi</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alasan Mutasi</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Alasan kepindahan..." {...field} />
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
