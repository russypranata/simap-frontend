'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Calendar, BookOpen, Printer } from 'lucide-react';
import { ACADEMIC_YEARS, SEMESTERS } from '../../constants/attendance';
import { TeacherClass } from '../../types/teacher';

interface ReportsSectionProps {
    classes: TeacherClass[];
    subjects: string[];
    onExport: (type: 'monthly' | 'semester', format: 'pdf' | 'excel', filters: any) => void;
}

export const ReportsSection: React.FC<ReportsSectionProps> = ({
    classes,
    subjects,
    onExport,
}) => {
    // Monthly Report State
    const [monthlyClass, setMonthlyClass] = useState<string>('');
    const [monthlySubject, setMonthlySubject] = useState<string>('');
    const [monthlyMonth, setMonthlyMonth] = useState<string>(new Date().getMonth().toString());
    const [monthlyYear, setMonthlyYear] = useState<string>(new Date().getFullYear().toString());

    // Semester Report State
    const [semesterClass, setSemesterClass] = useState<string>('');
    const [semesterSubject, setSemesterSubject] = useState<string>('');
    const [semesterAcademicYear, setSemesterAcademicYear] = useState<string>(ACADEMIC_YEARS[0]);
    const [semesterValue, setSemesterValue] = useState<string>(SEMESTERS[0]);

    const months = [
        { value: '0', label: 'Januari' },
        { value: '1', label: 'Februari' },
        { value: '2', label: 'Maret' },
        { value: '3', label: 'April' },
        { value: '4', label: 'Mei' },
        { value: '5', label: 'Juni' },
        { value: '6', label: 'Juli' },
        { value: '7', label: 'Agustus' },
        { value: '8', label: 'September' },
        { value: '9', label: 'Oktober' },
        { value: '10', label: 'November' },
        { value: '11', label: 'Desember' },
    ];

    const years = [
        new Date().getFullYear().toString(),
        (new Date().getFullYear() - 1).toString(),
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Recap Card */}
            <Card className="flex flex-col h-full">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                Rekapitulasi Bulanan
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                                Laporan detail kehadiran harian siswa selama satu bulan penuh (Format Matriks)
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 flex-1 flex flex-col">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Bulan</Label>
                            <Select value={monthlyMonth} onValueChange={setMonthlyMonth}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((m) => (
                                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Tahun</Label>
                            <Select value={monthlyYear} onValueChange={setMonthlyYear}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((y) => (
                                        <SelectItem key={y} value={y}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Kelas</Label>
                            <Select value={monthlyClass} onValueChange={setMonthlyClass}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Mata Pelajaran</Label>
                            <Select value={monthlySubject} onValueChange={setMonthlySubject}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Mata Pelajaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3 mt-auto">
                        <Button
                            className="flex-1 gap-2"
                            variant="outline"
                            disabled={!monthlyClass || !monthlySubject}
                            onClick={() => onExport('monthly', 'pdf', { classId: monthlyClass, subject: monthlySubject, month: monthlyMonth, year: monthlyYear })}
                        >
                            <Printer className="h-4 w-4" />
                            Cetak PDF
                        </Button>
                        <Button
                            className="flex-1 gap-2"
                            disabled={!monthlyClass || !monthlySubject}
                            onClick={() => onExport('monthly', 'excel', { classId: monthlyClass, subject: monthlySubject, month: monthlyMonth, year: monthlyYear })}
                        >
                            <Download className="h-4 w-4" />
                            Download Excel
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Semester Recap Card */}
            <Card className="flex flex-col h-full">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                Rekapitulasi Semester
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                                Rekapitulasi total kehadiran siswa selama satu semester akademik (Untuk Rapor)
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 flex-1 flex flex-col">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tahun Ajaran</Label>
                            <Select value={semesterAcademicYear} onValueChange={setSemesterAcademicYear}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Tahun Ajaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ACADEMIC_YEARS.map((y) => (
                                        <SelectItem key={y} value={y}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Semester</Label>
                            <Select value={semesterValue} onValueChange={setSemesterValue}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Semester</SelectItem>
                                    {SEMESTERS.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Kelas</Label>
                            <Select value={semesterClass} onValueChange={setSemesterClass}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Mata Pelajaran</Label>
                            <Select value={semesterSubject} onValueChange={setSemesterSubject}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Mata Pelajaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3 mt-auto">
                        <Button
                            className="flex-1 gap-2"
                            variant="outline"
                            disabled={!semesterClass || !semesterSubject}
                            onClick={() => onExport('semester', 'pdf', { classId: semesterClass, subject: semesterSubject, academicYear: semesterAcademicYear, semester: semesterValue })}
                        >
                            <Printer className="h-4 w-4" />
                            Cetak PDF
                        </Button>
                        <Button
                            className="flex-1 gap-2"
                            disabled={!semesterClass || !semesterSubject}
                            onClick={() => onExport('semester', 'excel', { classId: semesterClass, subject: semesterSubject, academicYear: semesterAcademicYear, semester: semesterValue })}
                        >
                            <Download className="h-4 w-4" />
                            Download Excel
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
