import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Save, Calendar, PlusCircle, Loader2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { TimeSlot, DayKey } from '@/features/admin/services/timeSlotService';
import { timeSlotSchema } from '@/features/admin/schemas/timeSlotSchema';
import { TimeSlotSkeleton } from './TimeSlotSkeleton';
import { useTimeSlots } from '@/features/admin/hooks/useTimeSlots';

interface TimeSlotListProps {
    day: DayKey;
    dayLabel: string;
}

export const TimeSlotList: React.FC<TimeSlotListProps> = ({ day, dayLabel }) => {
    const { slots: serverSlots, isLoading, isSaving, save } = useTimeSlots(day);
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [isDirty, setIsDirty] = useState(false);

    // Sync dari server ke local state
    useEffect(() => {
        setSlots(serverSlots);
        setIsDirty(false);
    }, [serverSlots]);

    const handleChange = (id: string, field: keyof TimeSlot, value: any) => {
        setSlots(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
        setIsDirty(true);
    };

    const handleDelete = (id: string) => {
        setSlots(prev => prev.filter(s => s.id !== id));
        setIsDirty(true);
    };

    const handleAdd = () => {
        const last = slots[slots.length - 1];
        const newSlot: TimeSlot = {
            id: `new-${Date.now()}`,
            day,
            label: 'Jam Baru',
            startTime: last?.endTime ?? '07:00',
            endTime: last?.endTime ?? '07:45',
            order: slots.length,
            type: 'lesson',
        };
        setSlots(prev => [...prev, newSlot]);
        setIsDirty(true);
    };

    const handleSave = async () => {
        for (const slot of slots) {
            const result = timeSlotSchema.safeParse({
                ...slot,
                id: slot.id,
                startTime: slot.startTime,
                endTime: slot.endTime,
            });
            if (!result.success) {
                toast.error(`Error pada "${slot.label}": ${result.error.issues[0].message}`);
                return;
            }
        }
        await save(slots);
        setIsDirty(false);
    };

    if (isLoading) return <TimeSlotSkeleton />;

    return (
        <div>
            {/* Sub-header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-slate-100 bg-slate-50/30">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/50">
                        <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Konfigurasi Hari {dayLabel}</h3>
                        <p className="text-sm text-slate-500">{slots.length} slot waktu terdaftar</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleAdd} size="sm" variant="outline">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Tambah Slot
                    </Button>
                    <Button
                        onClick={handleSave}
                        size="sm"
                        disabled={!isDirty || isSaving}
                        className="bg-blue-800 hover:bg-blue-900 text-white"
                    >
                        {isSaving
                            ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menyimpan...</>
                            : <><Save className="h-4 w-4 mr-2" />Simpan</>
                        }
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 border-b border-slate-200">
                        <TableRow className="hover:bg-slate-50">
                            <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-600 py-3 pl-6 w-[200px]">Label</TableHead>
                            <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-600 py-3 w-[140px]">Mulai</TableHead>
                            <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-600 py-3 w-[140px]">Selesai</TableHead>
                            <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-600 py-3 w-[150px]">Tipe</TableHead>
                            <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-600 py-3 text-center pr-6 w-[80px]">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {slots.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-14 h-14 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mb-3">
                                            <Clock className="h-6 w-6 text-slate-400" />
                                        </div>
                                        <p className="text-slate-500 font-medium text-sm">Belum ada slot waktu untuk {dayLabel}</p>
                                        <Button variant="link" size="sm" onClick={handleAdd} className="text-blue-600 mt-1">
                                            + Tambah Slot Pertama
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            slots.map((slot) => (
                                <TableRow key={slot.id} className="hover:bg-blue-50/30 transition-colors border-b border-slate-100 last:border-0">
                                    <TableCell className="py-3 pl-6">
                                        <Input
                                            value={slot.label}
                                            onChange={(e) => handleChange(slot.id, 'label', e.target.value)}
                                            className="h-9 text-sm font-medium text-slate-700"
                                            placeholder="Contoh: Jam ke-1"
                                        />
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <Input
                                            type="time"
                                            value={slot.startTime}
                                            onChange={(e) => handleChange(slot.id, 'startTime', e.target.value)}
                                            className="h-9 font-mono text-sm text-slate-700"
                                        />
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <Input
                                            type="time"
                                            value={slot.endTime}
                                            onChange={(e) => handleChange(slot.id, 'endTime', e.target.value)}
                                            className="h-9 font-mono text-sm text-slate-700"
                                        />
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <Select
                                            value={slot.type}
                                            onValueChange={(val) => handleChange(slot.id, 'type', val)}
                                        >
                                            <SelectTrigger className="h-9">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="lesson">Pelajaran</SelectItem>
                                                <SelectItem value="break">Istirahat</SelectItem>
                                                <SelectItem value="ceremony">Upacara</SelectItem>
                                                <SelectItem value="ishoma">Ishoma</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-center py-3 pr-6">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-700"
                                            onClick={() => handleDelete(slot.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="text-xs text-slate-400 text-center italic py-3 border-t border-slate-100">
                * Pastikan tidak ada jam yang bentrok antar slot waktu.
            </div>
        </div>
    );
};
