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
import { Trash2, Plus, Save, Calendar, PlusCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { TimeSlot } from '@/features/admin/data/mockTimeSlots';
import { timeSlotSchema } from '@/features/admin/schemas/timeSlotSchema';
import { TimeSlotSkeleton } from './TimeSlotSkeleton';

interface TimeSlotListProps {
    day: string;
    initialSlots: TimeSlot[];
    onSave: (day: string, slots: TimeSlot[]) => void;
    isLoading?: boolean;
}

export const TimeSlotList: React.FC<TimeSlotListProps> = ({ day, initialSlots, onSave, isLoading = false }) => {
    const [slots, setSlots] = useState<TimeSlot[]>(initialSlots);
    const [isDirty, setIsDirty] = useState(false);

    // Reset when day changes
    useEffect(() => {
        setSlots(initialSlots);
        setIsDirty(false);
    }, [initialSlots, day]);

    const handleChange = (id: string, field: keyof TimeSlot, value: any) => {
        setSlots(prev => prev.map(slot => 
            slot.id === id ? { ...slot, [field]: value } : slot
        ));
        setIsDirty(true);
    };

    const handleDelete = (id: string) => {
        setSlots(prev => prev.filter(slot => slot.id !== id));
        setIsDirty(true);
    };

    const handleAdd = () => {
        const newId = `${day.toLowerCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const lastSlot = slots[slots.length - 1];
        
        // Simple logic to guess next start time (add 40 mins)
        let newStart = "07:00";
        if (lastSlot) {
            // Very basic parse, assuming HH:MM
            const [h, m] = lastSlot.endTime.split(':').map(Number);
            const date = new Date();
            date.setHours(h, m);
            // newStart is same as last end time
            newStart = lastSlot.endTime; 
        }

        const newSlot: TimeSlot = {
            id: newId,
            label: `Jam Baru`,
            startTime: newStart,
            endTime: newStart, // User needs to edit
            order: slots.length + 1,
            type: 'lesson',
            day: day
        };
        
        setSlots(prev => [...prev, newSlot]);
        setIsDirty(true);
    };

    const handleSave = () => {
        // Robust Validation with Zod
        for (const slot of slots) {
            const result = timeSlotSchema.safeParse(slot);
            if (!result.success) {
                // Get the first error message
                const errorMessage = result.error.issues[0].message;
                toast.error(`Error pada ${slot.label}: ${errorMessage}`);
                return;
            }
        }
        
        onSave(day, slots);
        setIsDirty(false);
    };

    if (isLoading) {
        return <TimeSlotSkeleton />;
    }

    return (
        <div>
            {/* Header with gradient removed, keeping it clean as per SubjectList style (Card embedded) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-slate-100 bg-slate-50/30">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-600 flex items-center justify-center border border-blue-200/50 shadow-sm">
                        <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 tracking-tight">Konfigurasi Hari {day}</h3>
                        <p className="text-sm text-slate-500">Atur urutan dan durasi jam pelajaran.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        onClick={handleAdd} 
                        size="sm"
                        className="bg-blue-800 hover:bg-blue-900 text-white shadow-sm transition-all"
                    >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Tambah Slot
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        size="sm"
                        disabled={!isDirty || isLoading}
                        className="bg-blue-800 hover:bg-blue-900 text-white shadow-sm transition-all"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Simpan
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 border-b border-slate-200">
                        <TableRow className="hover:bg-slate-50">
                            <TableHead className="w-[200px] font-semibold text-xs uppercase tracking-wider text-slate-700 py-3 pl-6">Label</TableHead>
                            <TableHead className="w-[150px] font-semibold text-xs uppercase tracking-wider text-slate-700 py-3">Mulai</TableHead>
                            <TableHead className="w-[150px] font-semibold text-xs uppercase tracking-wider text-slate-700 py-3">Selesai</TableHead>
                            <TableHead className="w-[150px] font-semibold text-xs uppercase tracking-wider text-slate-700 py-3">Tipe</TableHead>
                            <TableHead className="w-[100px] text-center font-semibold text-xs uppercase tracking-wider text-slate-700 py-3 pr-6">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {slots.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                                            <Save className="h-6 w-6 text-slate-300" />
                                        </div>
                                        <p className="text-slate-500 font-medium text-sm">Belum ada slot waktu untuk {day}</p>
                                        <Button variant="link" size="sm" onClick={handleAdd} className="text-blue-600 mt-1">
                                            + Tambah Slot Pertama
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            slots.map((slot, index) => (
                                <TableRow key={slot.id} className="hover:bg-blue-50/30 transition-colors group border-b border-slate-100 last:border-0">
                                    <TableCell className="py-3 pl-6">
                                        <Input 
                                            value={slot.label} 
                                            onChange={(e) => handleChange(slot.id, 'label', e.target.value)}
                                            className="h-9 border-slate-100 focus:border-blue-500 bg-white hover:border-slate-200 transition-all shadow-sm focus:shadow-md font-semibold text-slate-700 placeholder:text-slate-300"
                                            placeholder="Contoh: Jam Pelajaran 1"
                                        />
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <div className="relative">
                                            <Input 
                                                type="time" 
                                                value={slot.startTime} 
                                                onChange={(e) => handleChange(slot.id, 'startTime', e.target.value)}
                                                className="h-9 w-full font-mono text-sm text-slate-700 border-slate-100 focus:border-blue-500 bg-white hover:border-slate-200 transition-all pl-3 shadow-sm focus:shadow-md"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <div className="relative">
                                            <Input 
                                                type="time" 
                                                value={slot.endTime} 
                                                onChange={(e) => handleChange(slot.id, 'endTime', e.target.value)}
                                                className="h-9 w-full font-mono text-sm text-slate-700 border-slate-100 focus:border-blue-500 bg-white hover:border-slate-200 transition-all pl-3 shadow-sm focus:shadow-md"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <Select 
                                            value={slot.type} 
                                            onValueChange={(val) => handleChange(slot.id, 'type', val)}
                                        >
                                            <SelectTrigger className="h-9 border-slate-100 focus:border-blue-500 bg-white hover:border-slate-200 shadow-sm focus:shadow-md transition-all">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="lesson" className="focus:bg-blue-50">
                                                    <span className="text-sm font-medium text-slate-700">Pelajaran</span>
                                                </SelectItem>
                                                <SelectItem value="break" className="focus:bg-amber-50">
                                                    <span className="text-sm font-medium text-slate-700">Istirahat</span>
                                                </SelectItem>
                                                <SelectItem value="ceremony" className="focus:bg-slate-100">
                                                    <span className="text-sm font-medium text-slate-700">Upacara</span>
                                                </SelectItem>
                                                <SelectItem value="ishoma" className="focus:bg-emerald-50">
                                                    <span className="text-sm font-medium text-slate-700">Ishoma</span>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-center py-3 pr-6">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-9 w-9 text-red-500 bg-red-50/50 border-red-100/50 border hover:text-red-700 hover:bg-red-100 hover:border-red-200 transition-all"
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
            
            <div className="text-xs text-slate-400 text-center italic mt-4">
                * Pastikan tidak ada jam yang bentrok antar slot waktu.
            </div>
        </div>
    );
};
