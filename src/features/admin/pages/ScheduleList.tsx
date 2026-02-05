'use client';

import React, { useState } from 'react';
import {
    Calendar,
    Search,
    Plus,
    Filter,
    Clock,
    User,
    MapPin,
    MoreHorizontal,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MOCK_SCHEDULES } from '../data/mockScheduleData';
import { DayOfWeek, Schedule } from '../types/schedule';
import { ScheduleForm } from '../components/forms/ScheduleForm';
import { ScheduleFormValues } from '../schemas/scheduleSchema';
import { toast } from 'sonner';

export const ScheduleList: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<Schedule[]>(MOCK_SCHEDULES);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const days: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    const filteredData = data.filter((item) => {
        const matchesDay = selectedDay === 'all' || item.day === selectedDay;
        const matchesSearch =
            item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesDay && matchesSearch;
    });

    const handleCreate = (values: ScheduleFormValues) => {
        const newItem: Schedule = {
            id: `sch-${Date.now()}`,
            ...values,
        };
        setData([newItem, ...data]);
        toast.success('Jadwal berhasil ditambahkan');
    };

    const handleUpdate = (values: ScheduleFormValues) => {
        if (!editingId) return;
        setData(prev => prev.map(item => item.id === editingId ? { ...item, ...values } : item));
        toast.success('Jadwal berhasil diperbarui');
        setEditingId(null);
    };

    const handleDelete = (id: string) => {
        if (confirm('Hapus jadwal ini?')) {
            setData(prev => prev.filter(item => item.id !== id));
            toast.success('Jadwal berhasil dihapus');
        }
    };

    const openEdit = (item: Schedule) => {
        setEditingId(item.id);
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Jadwal{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Pelajaran
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Calendar className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola jadwal mata pelajaran per kelas dan guru.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Import Jadwal</Button>
                    <Button
                        onClick={() => { setEditingId(null); setIsFormOpen(true); }}
                        className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Buat Jadwal
                    </Button>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Daftar Jadwal Pelajaran
                                </CardTitle>
                                <CardDescription>
                                    Tahun Ajaran 2024/2025 - Semester Ganjil
                                </CardDescription>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari mapel, kelas, atau guru..."
                                className="pl-9 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={selectedDay} onValueChange={setSelectedDay}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Pilih Hari" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Hari</SelectItem>
                                {days.map((day) => (
                                    <SelectItem key={day} value={day}>
                                        {day}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto border-t border-slate-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Hari & Jam</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Mata Pelajaran</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Kelas</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Guru Pengampu</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Ruangan</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                                    <Calendar className="h-8 w-8 text-slate-300" />
                                                </div>
                                                <p className="text-slate-500 font-medium">Jadwal tidak ditemukan</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{item.day}</div>
                                                <div className="text-[11px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded w-fit mt-1 border border-slate-200">
                                                    {item.startTime} - {item.endTime}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-blue-700">
                                                {item.subjectName}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="bg-white text-slate-700 border-slate-300 font-normal">
                                                    {item.className}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-3.5 w-3.5 text-slate-400" />
                                                    <span className="text-xs">{item.teacherName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                    <span className="text-xs font-mono">{item.room}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEdit(item)}>Edit Jadwal</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(item.id)}>Hapus</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <ScheduleForm
                open={isFormOpen}
                onOpenChange={(open) => {
                    setIsFormOpen(open);
                    if (!open) setEditingId(null);
                }}
                initialData={editingId ? data.find(d => d.id === editingId) : null}
                onSubmit={editingId ? handleUpdate : handleCreate}
            />
        </div>
    );
};
