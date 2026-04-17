'use client';

import React, { useEffect } from 'react';
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
import { CalendarPlus, Save, X } from 'lucide-react';
import { CalendarEventFormValues, calendarEventSchema } from '../../schemas/calendarSchema';
import { CalendarEvent } from '../../types/calendar';

interface CalendarEventFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: CalendarEvent | null;
    onSubmit: (data: CalendarEventFormValues) => Promise<void> | void;
    isLoading?: boolean;
}

export const CalendarEventForm: React.FC<CalendarEventFormProps> = ({
    open,
    onOpenChange,
    initialData,
    onSubmit,
    isLoading = false,
}) => {
    const form = useForm<CalendarEventFormValues>({
        resolver: zodResolver(calendarEventSchema),
        defaultValues: {
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            type: 'event',
            isHoliday: false,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                title: initialData.title,
                description: initialData.description || '',
                startDate: initialData.startDate,
                endDate: initialData.endDate,
                type: initialData.type,
                isHoliday: initialData.isHoliday,
            });
        } else {
            form.reset({
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                type: 'event',
                isHoliday: false,
            });
        }
    }, [initialData, form, open]);

    // Auto-set isHoliday based on type
    // eslint-disable-next-line react-hooks/incompatible-library
    const type = form.watch('type');
    useEffect(() => {
        form.setValue('isHoliday', type === 'holiday');
    }, [type, form]);

    const handleSubmit = async (values: CalendarEventFormValues) => {
        try {
            await onSubmit(values);
            onOpenChange(false);
        } catch {
            // error handled by parent (toast in hook)
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <div className="flex items-center gap-4 pb-2">
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                            <CalendarPlus className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">
                                {initialData?.id 
                                    ? (initialData.type === 'holiday' ? 'Edit Hari Libur' : 'Edit Kegiatan')
                                    : (initialData?.type === 'holiday' ? 'Set Hari Libur' : 'Tambah Kegiatan Baru')
                                }
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {type === 'holiday' 
                                    ? 'Isi detail hari libur nasional atau cuti bersama.' 
                                    : 'Isi form berikut untuk menambah kegiatan akademik.'}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {type === 'holiday' ? 'Nama Hari Libur' : 'Nama Kegiatan'}
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder={type === 'holiday' ? "Contoh: Tahun Baru Islam 1447 H" : "Contoh: Ujian Tengah Semester"} 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tanggal Mulai</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tanggal Selesai</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        {type !== 'holiday' && (
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipe Kegiatan</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih tipe" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="event">Kegiatan Sekolah</SelectItem>
                                            <SelectItem value="exam">Ujian</SelectItem>
                                            <SelectItem value="meeting">Rapat</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        )}

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deskripsi (Opsional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Keterangan tambahan..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="gap-3">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Batal
                            </Button>
                            <Button 
                                type="submit" 
                                className="bg-blue-800 hover:bg-blue-900 text-white min-w-[100px]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Simpan
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </div>
            </DialogContent>
        </Dialog>
    );
};
