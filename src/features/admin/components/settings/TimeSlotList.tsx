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
import { Trash2, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import { TimeSlot } from '@/features/admin/data/mockTimeSlots';

interface TimeSlotListProps {
    day: string;
    initialSlots: TimeSlot[];
    onSave: (day: string, slots: TimeSlot[]) => void;
}

export const TimeSlotList: React.FC<TimeSlotListProps> = ({ day, initialSlots, onSave }) => {
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
        const newId = `${day.toLowerCase()}-${Date.now()}`;
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
        // Basic validation
        for (const slot of slots) {
            if (slot.endTime <= slot.startTime) {
                toast.error(`Jam selesai harus lebih besar dari jam mulai pada ${slot.label}`);
                return;
            }
        }
        
        onSave(day, slots);
        setIsDirty(false);
        toast.success(`Jadwal hari ${day} berhasil disimpan`);
    };

    return (
        <div className="space-y-4">
            {/* Header with gradient removed, keeping it clean as per SubjectList style (Card embedded) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                        <span className="text-xs font-bold">{day.substring(0, 3)}</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">Konfigurasi {day}</h3>
                        <p className="text-xs text-slate-500">Atur urutan dan durasi jam pelajaran.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleAdd} 
                        className="h-9 border-dashed border-slate-300 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Slot
                    </Button>
                    {isDirty && (
                        <Button 
                            onClick={handleSave} 
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all animate-in fade-in zoom-in duration-300"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Simpan
                        </Button>
                    )}
                </div>
            </div>

            <div className="border rounded-md overflow-hidden bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50 border-b border-slate-200">
                        <TableRow className="hover:bg-slate-50">
                            <TableHead className="w-[50px] text-center font-semibold text-xs uppercase tracking-wider text-slate-600">No</TableHead>
                            <TableHead className="w-[200px] font-semibold text-xs uppercase tracking-wider text-slate-600">Label</TableHead>
                            <TableHead className="w-[150px] font-semibold text-xs uppercase tracking-wider text-slate-600">Mulai</TableHead>
                            <TableHead className="w-[150px] font-semibold text-xs uppercase tracking-wider text-slate-600">Selesai</TableHead>
                            <TableHead className="w-[150px] font-semibold text-xs uppercase tracking-wider text-slate-600">Tipe</TableHead>
                            <TableHead className="w-[100px] text-center font-semibold text-xs uppercase tracking-wider text-slate-600">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {slots.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground italic bg-slate-50/30">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <Save className="h-6 w-6 opacity-50" /> 
                                            {/* Reuse generic icon or clock */}
                                        </div>
                                        <p>Belum ada slot waktu untuk hari {day}</p>
                                        <Button variant="link" size="sm" onClick={handleAdd} className="text-blue-600">
                                            + Tambah Slot Pertama
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            slots.map((slot, index) => (
                                <TableRow key={slot.id} className="hover:bg-slate-50/60 transition-colors group border-b border-slate-100 last:border-0">
                                    <TableCell className="text-center font-medium text-slate-500 text-xs">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            value={slot.label} 
                                            onChange={(e) => handleChange(slot.id, 'label', e.target.value)}
                                            className="h-8 border-transparent hover:border-slate-300 focus:border-blue-500 bg-transparent focus:bg-white transition-all shadow-none font-medium text-slate-700"
                                            placeholder="Contoh: Jam Ke-1"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            type="time" 
                                            value={slot.startTime} 
                                            onChange={(e) => handleChange(slot.id, 'startTime', e.target.value)}
                                            className="h-8 w-full font-mono text-xs text-slate-600 border-slate-200 focus:border-blue-500 bg-slate-50/50 focus:bg-white"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            type="time" 
                                            value={slot.endTime} 
                                            onChange={(e) => handleChange(slot.id, 'endTime', e.target.value)}
                                            className="h-8 w-full font-mono text-xs text-slate-600 border-slate-200 focus:border-blue-500 bg-slate-50/50 focus:bg-white"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Select 
                                            value={slot.type} 
                                            onValueChange={(val) => handleChange(slot.id, 'type', val)}
                                        >
                                            <SelectTrigger className="h-8 border-transparent hover:border-slate-300 focus:border-blue-500 bg-transparent focus:bg-white shadow-none data-[placeholder]:text-muted-foreground">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="lesson">
                                                    <span className="flex items-center gap-2">
                                                        <span className="h-2 w-2 rounded-full bg-blue-500" /> Pelajaran
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="break">
                                                    <span className="flex items-center gap-2">
                                                        <span className="h-2 w-2 rounded-full bg-amber-500" /> Istirahat
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="ceremony">
                                                    <span className="flex items-center gap-2">
                                                        <span className="h-2 w-2 rounded-full bg-slate-500" /> Upacara
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="ishoma">
                                                    <span className="flex items-center gap-2">
                                                        <span className="h-2 w-2 rounded-full bg-emerald-500" /> Ishoma
                                                    </span>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-slate-300 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
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
