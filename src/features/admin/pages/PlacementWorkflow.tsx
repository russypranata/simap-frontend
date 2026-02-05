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
import { Search, Users, ArrowRight, Save, AlertCircle, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Penempatan Kelas
                    </h2>
                    <p className="text-muted-foreground">
                        Kelola penempatan siswa baru atau siswa tanpa kelas ke dalam rombongan belajar.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* LEFT PANEL: SOURCE (BANK SISWA) */}
                <Card className="md:col-span-7 h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Bank Siswa
                            <Badge variant="secondary" className="ml-2">
                                {unassignedStudents.length} Siswa
                            </Badge>
                        </CardTitle>
                        <CardDescription>
                            Siswa status ACTIVE yang belum memiliki kelas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Filters */}
                        <div className="flex gap-4">
                            <div className="w-1/3">
                                <Select value={selectedGeneration} onValueChange={setSelectedGeneration}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Angkatan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Angkatan</SelectItem>
                                        {generations.map(gen => (
                                            <SelectItem key={gen} value={gen}>Angkatan {gen}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-2/3 relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari Nama atau NIS..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Student List */}
                        <div className="border rounded-md overflow-hidden h-[500px] overflow-y-auto">
                            <Table>
                                <TableHeader className="bg-slate-50 sticky top-0 z-10">
                                    <TableRow>
                                        <TableHead className="w-[50px]">
                                            <Checkbox
                                                checked={unassignedStudents.length > 0 && selectedStudentIds.length === unassignedStudents.length}
                                                onCheckedChange={toggleSelectAll}
                                                disabled={unassignedStudents.length === 0}
                                            />
                                        </TableHead>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead>NIS</TableHead>
                                        <TableHead>L/P</TableHead>
                                        <TableHead>Angkatan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {unassignedStudents.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                Tidak ada siswa yang sesuai filter.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        unassignedStudents.map((student) => (
                                            <TableRow key={student.id} className="hover:bg-slate-50">
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedStudentIds.includes(student.id)}
                                                        onCheckedChange={() => toggleSelectStudent(student.id)}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">{student.name}</TableCell>
                                                <TableCell>{student.nis}</TableCell>
                                                <TableCell>{student.gender}</TableCell>
                                                <TableCell>{student.generation}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <span>Terpilih: {selectedStudentIds.length} siswa</span>
                        </div>
                    </CardContent>
                </Card>

                {/* RIGHT PANEL: TARGET (KELAS TUJUAN) */}
                <div className="md:col-span-5 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ArrowRight className="h-5 w-5" />
                                Target Kelas
                            </CardTitle>
                            <CardDescription>
                                Pilih kelas tujuan untuk siswa terpilih.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Pilih Kelas</Label>
                                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Kelas..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id}>
                                                {cls.name} ({cls.totalStudents}/{cls.capacity})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {targetClass ? (
                                <div className="space-y-4 border p-4 rounded-lg bg-slate-50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-lg">{targetClass.name}</h4>
                                            <p className="text-sm text-muted-foreground">Wali Kelas: {targetClass.homeroomTeacherName}</p>
                                        </div>
                                        <Badge variant={targetClass.totalStudents >= targetClass.capacity ? "destructive" : "outline"}>
                                            {targetClass.type}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Kapasitas:</span>
                                            <span className="font-medium">
                                                {targetClass.totalStudents} / {targetClass.capacity} Siswa
                                            </span>
                                        </div>
                                        <Progress value={(targetClass.totalStudents / targetClass.capacity) * 100} />
                                    </div>

                                    {selectedStudentIds.length > 0 && (
                                        <div className="pt-2 border-t mt-2">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span>Akan Ditambahkan:</span>
                                                <span className="font-bold text-blue-600">+{selectedStudentIds.length} Siswa</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Total Estimasi:</span>
                                                <span className={`font-bold ${validation.isOverCapacity ? 'text-red-600' : 'text-green-600'}`}>
                                                    {targetClass.totalStudents + selectedStudentIds.length} / {targetClass.capacity}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {!validation.isValid && selectedStudentIds.length > 0 && (
                                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
                                            <AlertCircle className="h-4 w-4" />
                                            {validation.message}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-40 flex items-center justify-center border border-dashed rounded-lg text-muted-foreground bg-slate-50/50">
                                    <p>Pilih kelas terlebih dahulu</p>
                                </div>
                            )}

                            <Button
                                className="w-full"
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
                    <Card className="bg-blue-50/50 border-blue-100">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <UserCheck className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="font-medium text-blue-900">Tips Penempatan</p>
                                    <p className="text-sm text-blue-700">
                                        Pastikan Anda memfilter berdasarkan angkatan untuk menghindari percampuran siswa baru dan siswa lama yang tidak naik kelas.
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
