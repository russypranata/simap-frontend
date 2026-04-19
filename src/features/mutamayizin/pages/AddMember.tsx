'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
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
    Users,
    Calendar,
    ArrowLeft,
    Save,
    Loader2,
    UserPlus,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    createMember,
    getStudents,
    getAcademicYears,
    getExtracurricularsForMember,
} from '../services/mutamayizinService';
import type {
    StudentOption,
    AcademicYear,
    ExtracurricularOption,
} from '../services/mutamayizinService';

export const AddMember: React.FC = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [students, setStudents] = useState<StudentOption[]>([]);
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [extracurriculars, setExtracurriculars] = useState<ExtracurricularOption[]>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);

    const [formData, setFormData] = useState({
        studentProfileId: '',
        ekstrakurikulerId: '',
        academicYearId: '',
        joinDate: '',
    });

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [studentsData, yearsData, ekskulData] = await Promise.all([
                    getStudents(),
                    getAcademicYears(),
                    getExtracurricularsForMember(),
                ]);
                setStudents(studentsData);
                setAcademicYears(yearsData);
                setExtracurriculars(ekskulData);
            } catch (error) {
                console.error('Failed to load options:', error);
                toast.error('Gagal memuat data siswa, ekskul, dan tahun ajaran');
            } finally {
                setIsLoadingOptions(false);
            }
        };
        loadOptions();
    }, []);

    const validateForm = (): boolean => {
        if (!formData.studentProfileId) {
            toast.error('Silakan pilih siswa!');
            return false;
        }

        if (!formData.ekstrakurikulerId) {
            toast.error('Silakan pilih ekstrakurikuler!');
            return false;
        }

        if (!formData.academicYearId) {
            toast.error('Silakan pilih tahun ajaran!');
            return false;
        }

        if (!formData.joinDate) {
            toast.error('Silakan pilih tanggal masuk!');
            return false;
        }

        const today = new Date().toISOString().split('T')[0];
        if (formData.joinDate > today) {
            toast.error('Tanggal masuk tidak boleh melebihi hari ini!');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const result = await createMember({
                student_profile_id: parseInt(formData.studentProfileId),
                ekstrakurikuler_id: parseInt(formData.ekstrakurikulerId),
                academic_year_id: parseInt(formData.academicYearId),
                join_date: formData.joinDate,
            });

            if (!result.success) {
                // Extract error message
                let errorMessage = 'Gagal menambahkan anggota. Silakan coba lagi!';
                if (result.error?.errors) {
                    const allErrors = Object.values(result.error.errors).flat();
                    if (allErrors.length > 0) {
                        errorMessage = allErrors[0];
                    }
                } else if (result.error?.message) {
                    errorMessage = result.error.message;
                }
                toast.error(errorMessage);
                setIsSubmitting(false);
                return;
            }

            console.log('Member created successfully:', result.data);

            toast.success('Anggota berhasil ditambahkan!');

            router.push('/mutamayizin-coordinator/members');
        } catch (error) {
            console.error('Unexpected error:', error);
            toast.error('Gagal menambahkan anggota. Silakan coba lagi!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        const hasChanges =
            formData.studentProfileId ||
            formData.ekstrakurikulerId ||
            formData.academicYearId ||
            formData.joinDate;

        if (hasChanges) {
            const confirmLeave = window.confirm(
                'Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar?',
            );
            if (!confirmLeave) return;
        }

        router.push('/mutamayizin-coordinator/members');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="h-8 w-8 p-0"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-linear-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Tambah{' '}
                            </span>
                            <span className="bg-linear-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Anggota
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <UserPlus className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Isi formulir di bawah untuk menambahkan anggota ekstrakurikuler
                    </p>
                </div>
            </div>

            {/* Form Card with Decorative Header */}
            <Card className="overflow-hidden p-0">
                {/* Decorative Header Section */}
                <div className="bg-blue-800 p-5 relative overflow-hidden">
                    {/* Decorative Geometric Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 border-20 border-white rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 right-1/3 w-20 h-20 border-8 border-white rounded-full translate-y-1/2" />
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Users className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Form Input Anggota
                            </h2>
                            <p className="text-blue-100 text-sm">
                                Lengkapi semua field yang ditandai dengan tanda
                                bintang (*)
                            </p>
                        </div>
                    </div>
                </div>

                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nama Siswa */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="studentProfileId"
                                    className="text-sm font-medium"
                                >
                                    Nama Siswa{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.studentProfileId}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            studentProfileId: value,
                                        })
                                    }
                                    required
                                    disabled={isSubmitting || isLoadingOptions}
                                >
                                    <SelectTrigger id="studentProfileId">
                                        <SelectValue
                                            placeholder={
                                                isLoadingOptions
                                                    ? 'Memuat...'
                                                    : 'Pilih siswa'
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {students.map((student) => (
                                            <SelectItem
                                                key={student.id}
                                                value={String(student.id)}
                                            >
                                                {student.name} - {student.nis} (
                                                {student.class})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Ekstrakurikuler */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="ekstrakurikulerId"
                                    className="text-sm font-medium"
                                >
                                    Ekstrakurikuler{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.ekstrakurikulerId}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            ekstrakurikulerId: value,
                                        })
                                    }
                                    required
                                    disabled={isSubmitting || isLoadingOptions}
                                >
                                    <SelectTrigger id="ekstrakurikulerId">
                                        <SelectValue
                                            placeholder={
                                                isLoadingOptions
                                                    ? 'Memuat...'
                                                    : 'Pilih ekstrakurikuler'
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {extracurriculars.map((ekskul) => (
                                            <SelectItem
                                                key={ekskul.id}
                                                value={String(ekskul.id)}
                                            >
                                                {ekskul.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Tahun Ajaran */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="academicYearId"
                                    className="text-sm font-medium"
                                >
                                    Tahun Ajaran{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.academicYearId}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            academicYearId: value,
                                        })
                                    }
                                    required
                                    disabled={isSubmitting || isLoadingOptions}
                                >
                                    <SelectTrigger id="academicYearId">
                                        <SelectValue
                                            placeholder={
                                                isLoadingOptions
                                                    ? 'Memuat...'
                                                    : 'Pilih tahun ajaran'
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicYears.map((year) => (
                                            <SelectItem
                                                key={year.id}
                                                value={String(year.id)}
                                            >
                                                {year.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Tanggal Masuk */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="joinDate"
                                    className="text-sm font-medium"
                                >
                                    Tanggal Masuk{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="joinDate"
                                        type="date"
                                        className="pl-10"
                                        value={formData.joinDate}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                joinDate: e.target.value,
                                            })
                                        }
                                        required
                                        disabled={isSubmitting}
                                        aria-label="Tanggal masuk"
                                        max={
                                            new Date()
                                                .toISOString()
                                                .split('T')[0]
                                        }
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Tanggal bergabung siswa ke ekstrakurikuler
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-800 hover:bg-blue-900"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Simpan Anggota
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};