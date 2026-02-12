'use client';

import React, { useState } from 'react';
import {
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    School,
    Users,
    Save,
    Search,
    Filter,
    ArrowUpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { cn } from '@/lib/utils';

// Mock Data
const MOCK_CLASSES = [
    { id: '1', name: 'X-A', grade: 10, totalStudents: 32 },
    { id: '2', name: 'X-B', grade: 10, totalStudents: 30 },
    { id: '3', name: 'XI-A', grade: 11, totalStudents: 28 },
];

const MOCK_STUDENTS = [
    { id: '1', name: 'Aditya Pratama', nis: '2023001', class: 'X-A', status: 'active' },
    { id: '2', name: 'Budi Santoso', nis: '2023002', class: 'X-A', status: 'active' },
    { id: '3', name: 'Citra Dewi', nis: '2023003', class: 'X-A', status: 'active' },
    { id: '4', name: 'Dewi Lestari', nis: '2023004', class: 'X-A', status: 'active' },
    { id: '5', name: 'Eko Prasetyo', nis: '2023005', class: 'X-A', status: 'active' },
];

const STEPS = [
    { id: 1, title: 'Setup Periode', description: 'Pilih tahun ajaran' },
    { id: 2, title: 'Pemetaan Kelas', description: 'Atur target kelas' },
    { id: 3, title: 'Verifikasi Siswa', description: 'Cek kelayakan siswa' },
    { id: 4, title: 'Eksekusi', description: 'Proses kenaikan' },
];

export const PromotionWorkflow: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedSourceYear, setSelectedSourceYear] = useState('2024/2025');
    const [selectedTargetYear, setSelectedTargetYear] = useState('2025/2026');
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedStudents(MOCK_STUDENTS.map(s => s.id));
        } else {
            setSelectedStudents([]);
        }
    };

    const toggleSelectStudent = (id: string) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter(s => s !== id));
        } else {
            setSelectedStudents([...selectedStudents, id]);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                 <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                            Kenaikan{' '}
                        </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                            Kelas
                        </span>
                    </h1>
                    <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <ArrowUpCircle className="h-5 w-5" />
                    </div>
                </div>
                <p className="text-muted-foreground">
                    Workflow proses kenaikan kelas siswa secara massal untuk tahun ajaran baru.
                </p>
            </div>

            {/* Stepper */}
            <div className="relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2" />
                <div className="flex justify-between max-w-4xl mx-auto">
                    {STEPS.map((step) => {
                        const isCompleted = currentStep > step.id;
                        const isCurrent = currentStep === step.id;

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                        isCompleted
                                            ? "bg-green-500 border-green-500 text-white"
                                            : isCurrent
                                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                                            : "bg-white border-slate-200 text-slate-400"
                                    )}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-6 h-6" />
                                    ) : (
                                        <span className="font-bold">{step.id}</span>
                                    )}
                                </div>
                                <div className="text-center">
                                    <p
                                        className={cn(
                                            "text-xs font-bold uppercase tracking-wider mb-0.5",
                                            isCurrent ? "text-blue-700" : "text-slate-500"
                                        )}
                                    >
                                        {step.title}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-5xl mx-auto">
                {currentStep === 1 && (
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>Setup Periode Akademik</CardTitle>
                            <CardDescription>
                                Tentukan tahun ajaran asal dan tahun ajaran tujuan untuk proses kenaikan kelas.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Tahun Ajaran Asal (Current)</Label>
                                    <Select value={selectedSourceYear} onValueChange={setSelectedSourceYear}>
                                        <SelectTrigger className="h-10 bg-slate-50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2024/2025">2024/2025</SelectItem>
                                            <SelectItem value="2023/2024">2023/2024</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tahun Ajaran Tujuan (Next)</Label>
                                    <Select value={selectedTargetYear} onValueChange={setSelectedTargetYear}>
                                        <SelectTrigger className="h-10 bg-slate-50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2025/2026">2025/2026</SelectItem>
                                            <SelectItem value="2026/2027">2026/2027</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Informasi Penting</p>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Pastikan Tahun Ajaran Tujuan sudah aktif dan data master kelas sudah tersedia.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {currentStep === 2 && (
                    <Card className="border-slate-200 shadow-sm">
                         <CardHeader>
                            <CardTitle>Pemetaan Kelas</CardTitle>
                            <CardDescription>
                                Hubungkan kelas asal dengan kelas tujuan secara otomatis.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="w-[50px] font-semibold text-slate-700">No</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Kelas Asal ({selectedSourceYear})</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                        <TableHead className="font-semibold text-slate-700">Kelas Tujuan ({selectedTargetYear})</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Wali Kelas Baru</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_CLASSES.map((cls, index) => (
                                        <TableRow key={cls.id} className="hover:bg-slate-50/50">
                                            <TableCell className="font-medium text-slate-500">{index + 1}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-900">{cls.name}</span>
                                                    <span className="text-xs text-slate-500">{cls.totalStudents} Siswa</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <ArrowRight className="w-4 h-4 text-slate-400" />
                                            </TableCell>
                                            <TableCell>
                                                 <Select defaultValue={`${parseInt(cls.name.split('-')[0]) === 10 ? 'XI' : 'XII'}-${cls.name.split('-')[1]}`}>
                                                    <SelectTrigger className="h-9 w-[180px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="XI-A">XI-A</SelectItem>
                                                        <SelectItem value="XI-B">XI-B</SelectItem>
                                                        <SelectItem value="XII-A">XII-A</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-slate-600 italic">Belum ditentukan</span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {currentStep === 3 && (
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Verifikasi Siswa</CardTitle>
                                    <CardDescription>
                                        Pilih siswa yang BERHAK naik kelas. Uncheck siswa yang tinggal kelas.
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                     <div className="relative">
                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="Cari siswa..."
                                            className="pl-9 w-[250px] h-9 bg-white"
                                        />
                                    </div>
                                    <Button variant="outline" size="sm" className="h-9">
                                        <Filter className="w-4 h-4 mr-2" />
                                        Filter
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="border-t border-slate-200">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead className="w-[50px] pl-4">
                                                <Checkbox
                                                    checked={selectedStudents.length === MOCK_STUDENTS.length}
                                                    onCheckedChange={toggleSelectAll}
                                                />
                                            </TableHead>
                                            <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Nama Siswa</TableHead>
                                            <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">NIS</TableHead>
                                            <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Kelas Asal</TableHead>
                                            <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Status Akademik</TableHead>
                                            <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Keputusan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {MOCK_STUDENTS.map((student) => (
                                            <TableRow key={student.id} className="hover:bg-slate-50/50">
                                                <TableCell className="pl-4">
                                                    <Checkbox
                                                        checked={selectedStudents.includes(student.id)}
                                                        onCheckedChange={() => toggleSelectStudent(student.id)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-medium text-slate-900">{student.name}</span>
                                                </TableCell>
                                                <TableCell className="text-slate-600 font-mono text-xs">{student.nis}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="bg-slate-50">{student.class}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 shadow-none">
                                                        Lulus KKM
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {selectedStudents.includes(student.id) ? (
                                                        <span className="text-sm font-medium text-blue-600 flex items-center gap-1">
                                                            <ArrowUpCircle className="w-4 h-4" /> Naik Kelas
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm font-medium text-red-600 flex items-center gap-1">
                                                            <AlertCircle className="w-4 h-4" /> Tinggal Kelas
                                                        </span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                             <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
                                <span>Menampilkan {MOCK_STUDENTS.length} siswa</span>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" disabled>Previous</Button>
                                    <Button variant="outline" size="sm" disabled>Next</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {currentStep === 4 && (
                    <Card className="border-slate-200 shadow-sm text-center py-12">
                        <CardContent className="flex flex-col items-center justify-center space-y-6">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                                <School className="w-10 h-10 text-blue-600" />
                            </div>
                            <div className="space-y-2 max-w-md">
                                <h3 className="text-2xl font-bold text-slate-900">Siap untuk Eksekusi?</h3>
                                <p className="text-slate-500">
                                    Anda akan memproses kenaikan kelas untuk <strong>{selectedStudents.length} siswa</strong> dari Tahun Ajaran <strong>{selectedSourceYear}</strong> ke <strong>{selectedTargetYear}</strong>.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button variant="outline" onClick={handlePrev} className="w-full sm:w-auto">
                                    Periksa Kembali
                                </Button>
                                <Button className="w-full sm:w-auto bg-blue-800 hover:bg-blue-900 text-white shadow-lg shadow-blue-900/20">
                                    <Save className="w-4 h-4 mr-2" />
                                    Proses Kenaikan Kelas
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-slate-200 mt-8">
                    <Button
                        variant="ghost"
                        onClick={handlePrev}
                        disabled={currentStep === 1}
                        className="text-slate-500 hover:text-slate-900"
                    >
                        Kembali
                    </Button>

                    {currentStep < 4 && (
                        <Button
                            onClick={handleNext}
                            className="bg-blue-800 hover:bg-blue-900 text-white min-w-[120px]"
                        >
                            Lanjut
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
