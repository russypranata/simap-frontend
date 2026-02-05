'use client';

import React, { useState, useMemo } from 'react';
import { MOCK_STUDENTS } from '@/features/admin/data/mockStudentData';
import { MOCK_CLASSES } from '@/features/admin/data/mockClassData';
import { Student } from '@/features/admin/types/student';
import { Class } from '@/features/admin/types/class';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, Users, ArrowRight, Save, AlertCircle, UserCheck, GraduationCap, Filter, School } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const PlacementWorkflow: React.FC = () => {
    // Local State to simulate database
    const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
    const [classes, setClasses] = useState<Class[]>(MOCK_CLASSES);

    // Filter State
    const [selectedGeneration, setSelectedGeneration] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Selection State
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>('');

    // Derived Data: Unassigned Students
    const unassignedStudents = useMemo(() => {
        return students.filter((s) => {
            const isUnassigned = !s.classId || s.classId === '';
            const isActive = s.status === 'active';

            // Filter Logic
            const matchesGeneration = selectedGeneration === 'all' || s.generation === selectedGeneration;
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  s.nis.includes(searchQuery);

            return isUnassigned && isActive && matchesGeneration && matchesSearch;
        });
    }, [students, selectedGeneration, searchQuery]);

    // Unique Generations for Filter
    const generations = useMemo(() => {
        const gens = new Set(students.map(s => s.generation).filter(Boolean));
        return Array.from(gens).sort().reverse();
    }, [students]);

    // Derived Data: Selected Class
    const targetClass = useMemo(() => {
        return classes.find(c => c.id === selectedClassId);
    }, [classes, selectedClassId]);

    // Validation Logic
    const validation = useMemo(() => {
        if (!targetClass) return { isValid: false, message: 'Pilih kelas tujuan' };

        const currentTotal = targetClass.totalStudents;
        const toAdd = selectedStudentIds.length;
        const capacity = targetClass.capacity;
        const newTotal = currentTotal + toAdd;

        if (newTotal > capacity) {
            return {
                isValid: false,
                message: `Kapasitas terlampaui! (Isi: ${currentTotal}, Pilih: ${toAdd}, Max: ${capacity})`,
                isOverCapacity: true
            };
        }

        return { isValid: true, message: 'Siap ditempatkan' };
    }, [targetClass, selectedStudentIds]);

    // Handlers
    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedStudentIds(unassignedStudents.map(s => s.id));
        } else {
            setSelectedStudentIds([]);
        }
    };

    const toggleSelectStudent = (id: string) => {
        setSelectedStudentIds(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleAssign = () => {
        if (!targetClass || selectedStudentIds.length === 0) return;

        // Update Students
        const updatedStudents = students.map(s => {
            if (selectedStudentIds.includes(s.id)) {
                return { ...s, classId: targetClass.id, className: targetClass.name };
            }
            return s;
        });

        // Update Class
        const updatedClasses = classes.map(c => {
            if (c.id === targetClass.id) {
                return { ...c, totalStudents: c.totalStudents + selectedStudentIds.length };
            }
            return c;
        });

        setStudents(updatedStudents);
        setClasses(updatedClasses);
        setSelectedStudentIds([]);

        toast.success(`Berhasil menempatkan ${selectedStudentIds.length} siswa ke kelas ${targetClass.name}`);
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Penempatan{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Kelas
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Atur penempatan siswa baru atau siswa tanpa kelas ke dalam rombongan belajar.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* LEFT PANEL: SOURCE (BANK SISWA) */}
                <Card className="md:col-span-7 h-fit border-slate-200 shadow-sm">
                    <CardHeader className="pb-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Bank Siswa
                                    <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-700 hover:bg-slate-200">
                                        {unassignedStudents.length} Available
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    Siswa status ACTIVE yang belum memiliki kelas.
                                </CardDescription>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari Nama atau NIS..."
                                    className="pl-9 bg-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="w-full sm:w-[180px]">
                                <Select value={selectedGeneration} onValueChange={setSelectedGeneration}>
                                    <SelectTrigger>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Filter className="h-4 w-4" />
                                            <SelectValue placeholder="Pilih Angkatan" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Angkatan</SelectItem>
                                        {generations.map(gen => (
                                            <SelectItem key={gen} value={gen}>Angkatan {gen}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {/* Student List */}
                        <div className="border-t border-slate-200 overflow-hidden min-h-[500px] max-h-[600px] overflow-y-auto">
                            <Table>
                                <TableHeader className="bg-slate-50 text-slate-700 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                                    <TableRow>
                                        <TableHead className="w-[50px] pl-4">
                                            <Checkbox
                                                checked={unassignedStudents.length > 0 && selectedStudentIds.length === unassignedStudents.length}
                                                onCheckedChange={toggleSelectAll}
                                                disabled={unassignedStudents.length === 0}
                                            />
                                        </TableHead>
                                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Siswa</TableHead>
                                        <TableHead className="font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">L/P</TableHead>
                                        <TableHead className="font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">Angkatan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {unassignedStudents.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <Search className="h-6 w-6 text-slate-400" />
                                                    </div>
                                                    <p>Tidak ada siswa yang sesuai filter.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        unassignedStudents.map((student) => (
                                            <TableRow
                                                key={student.id}
                                                className={cn(
                                                    "cursor-pointer transition-colors hover:bg-slate-50/80",
                                                    selectedStudentIds.includes(student.id) ? "bg-blue-50/50 hover:bg-blue-50/70" : ""
                                                )}
                                                onClick={() => toggleSelectStudent(student.id)}
                                            >
                                                <TableCell className="pl-4">
                                                    <Checkbox
                                                        checked={selectedStudentIds.includes(student.id)}
                                                        onCheckedChange={() => toggleSelectStudent(student.id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8 border border-slate-200 hidden sm:block">
                                                            <AvatarImage src={student.profilePicture} />
                                                            <AvatarFallback className="bg-slate-100 text-slate-500 text-xs">
                                                                {student.name.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium text-slate-900">{student.name}</div>
                                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 font-normal">
                                                                    {student.nis}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    <Badge variant="secondary" className="font-normal text-xs bg-slate-100 text-slate-600">
                                                        {student.gender}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                                                    {student.generation}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-sm text-muted-foreground">
                            <span>Menampilkan {unassignedStudents.length} siswa</span>
                            <div className="flex items-center gap-2">
                                <span>Terpilih:</span>
                                <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                                    {selectedStudentIds.length}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* RIGHT PANEL: TARGET (KELAS TUJUAN) */}
                <div className="md:col-span-5 space-y-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-4">
                             <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                                    <School className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">
                                        Target Kelas
                                    </CardTitle>
                                    <CardDescription>
                                        Pilih rombel tujuan penempatan.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-slate-700">Pilih Kelas</Label>
                                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                                    <SelectTrigger className="h-11 bg-white">
                                        <SelectValue placeholder="Pilih Kelas Tujuan..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id}>
                                                <span className="font-medium mr-2">{cls.name}</span>
                                                <span className="text-muted-foreground text-xs">
                                                    ({cls.totalStudents}/{cls.capacity})
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {targetClass ? (
                                <div className="space-y-4 border border-slate-200 p-5 rounded-xl bg-slate-50/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-800">{targetClass.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                                                <p className="text-xs text-muted-foreground">
                                                    Wali: {targetClass.homeroomTeacherName || '-'}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={targetClass.type === 'REGULER' ? 'outline' : 'default'} className="uppercase text-[10px]">
                                            {targetClass.type}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-muted-foreground">Kapasitas Kelas</span>
                                            <span className="font-medium text-slate-900">
                                                {targetClass.totalStudents} / {targetClass.capacity}
                                            </span>
                                        </div>
                                        <Progress
                                            value={(targetClass.totalStudents / targetClass.capacity) * 100}
                                            className="h-2"
                                        />
                                    </div>

                                    {selectedStudentIds.length > 0 && (
                                        <div className="pt-4 border-t border-slate-200/60 mt-2 space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Akan Ditambahkan:</span>
                                                <Badge variant="secondary" className="text-blue-700 bg-blue-50 border-blue-100 font-bold">
                                                    +{selectedStudentIds.length} Siswa
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between text-sm items-center bg-white p-2 rounded border border-slate-100">
                                                <span className="font-medium text-slate-700">Estimasi Total:</span>
                                                <span className={cn(
                                                    "font-bold text-lg",
                                                    validation.isOverCapacity ? "text-red-600" : "text-emerald-600"
                                                )}>
                                                    {targetClass.totalStudents + selectedStudentIds.length} / {targetClass.capacity}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {!validation.isValid && selectedStudentIds.length > 0 && (
                                        <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-100 animate-in fade-in zoom-in-95 duration-200">
                                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                            <span className="font-medium">{validation.message}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-muted-foreground bg-slate-50/30 gap-2">
                                    <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                                        <ArrowRight className="h-5 w-5 text-slate-300" />
                                    </div>
                                    <p className="text-sm">Silakan pilih kelas tujuan</p>
                                </div>
                            )}

                            <Button
                                className="w-full bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                                size="lg"
                                disabled={!validation.isValid || selectedStudentIds.length === 0}
                                onClick={handleAssign}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Simpan Penempatan
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick Stats / Helper Info */}
                    <Card className="bg-blue-50/50 border-blue-100 shadow-none">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-full shrink-0">
                                    <UserCheck className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-semibold text-blue-900 text-sm">Tips Efisiensi</p>
                                    <p className="text-xs text-blue-700 leading-relaxed">
                                        Gunakan filter angkatan untuk mengelompokkan siswa baru. Centang "Pilih Semua" untuk memindahkan satu angkatan sekaligus ke dalam kelas sementara jika diperlukan.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
