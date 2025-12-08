'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AttendanceRecord } from '../../types/teacher';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import { formatLessonHourWithTime } from '../../utils/lessonHourFormatter';
import {
    ArrowLeft,
    Save,
    CheckCircle,
    AlertCircle,
    XCircle,
    Clock,
    Edit,
    User,
    BookOpen
} from 'lucide-react';

interface EditAttendanceViewProps {
    record: AttendanceRecord;
    onSave: (record: AttendanceRecord) => Promise<boolean>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const EditAttendanceView: React.FC<EditAttendanceViewProps> = ({
    record,
    onSave,
    onCancel,
    isLoading = false,
}) => {
    const [status, setStatus] = useState(record.status);
    const [notes, setNotes] = useState(record.notes || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        const updatedRecord = { ...record, status, notes };
        await onSave(updatedRecord);
        setIsSaving(false);
    };

    const statusOptions = [
        {
            value: 'hadir',
            label: 'Hadir',
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            selectedBorder: 'border-green-500',
            selectedBg: 'bg-green-100'
        },
        {
            value: 'sakit',
            label: 'Sakit',
            icon: AlertCircle,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            selectedBorder: 'border-yellow-500',
            selectedBg: 'bg-yellow-100'
        },
        {
            value: 'izin',
            label: 'Izin',
            icon: Clock,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            selectedBorder: 'border-blue-500',
            selectedBg: 'bg-blue-100'
        },
        {
            value: 'tanpa-keterangan',
            label: 'Alpa',
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            selectedBorder: 'border-red-500',
            selectedBg: 'bg-red-100'
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onCancel}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Edit Presensi</h1>
                        <p className="text-muted-foreground">
                            Perbarui data kehadiran untuk {record.studentName}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <Edit className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                Formulir Edit Presensi
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                                Ubah status kehadiran dan tambahkan catatan untuk {record.studentName} - {record.class}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left Column: Context Info */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
                                        <User className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    Informasi Siswa
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Nama Siswa</p>
                                        <p className="font-medium text-foreground">{record.studentName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Kelas</p>
                                        <p className="font-medium text-foreground">{record.class}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4 space-y-4">
                                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
                                        <BookOpen className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    Detail Pelajaran
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Mata Pelajaran</p>
                                        <p className="font-medium text-foreground">{record.subject}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Tanggal</p>
                                        <p className="font-medium text-foreground">{formatDate(record.date, 'dd MMMM yyyy')}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Jam Pelajaran</p>
                                        <p className="font-medium text-foreground">{formatLessonHourWithTime(record.lessonHour)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Tahun Ajaran</p>
                                        <p className="font-medium text-foreground">{record.academicYear}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Semester</p>
                                        <p className="font-medium text-foreground">{record.semester}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Edit Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Status Selection */}
                            <div className="space-y-4">
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    Status Kehadiran
                                    <span className="text-red-500">*</span>
                                </Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {statusOptions.map((option) => {
                                        const Icon = option.icon;
                                        const isSelected = status === option.value;
                                        return (
                                            <div
                                                key={option.value}
                                                onClick={() => setStatus(option.value as any)}
                                                className={`
                          relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200
                          flex items-center gap-4 group
                          ${isSelected
                                                        ? `${option.selectedBorder} ${option.selectedBg} shadow-sm`
                                                        : `border-gray-100 hover:border-gray-200 bg-white`
                                                    }
                        `}
                                            >
                                                <div className={`
                          p-3 rounded-full flex-shrink-0 transition-colors
                          ${isSelected ? 'bg-white shadow-sm' : option.bgColor}
                        `}>
                                                    <Icon className={`h-6 w-6 ${option.color}`} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`font-bold ${isSelected ? 'text-gray-900' : 'text-gray-700'} group-hover:text-gray-900 transition-colors`}>
                                                        {option.label}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        Set status siswa sebagai {option.label.toLowerCase()}
                                                    </p>
                                                </div>
                                                {isSelected && (
                                                    <div className={`
                            absolute top-3 right-3 h-5 w-5 rounded-full flex items-center justify-center
                            ${option.color.replace('text-', 'bg-')} text-white
                          `}>
                                                        <CheckCircle className="h-3.5 w-3.5" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Notes Input */}
                            <div className="space-y-4">
                                <Label htmlFor="notes" className="text-base font-semibold">
                                    Catatan Tambahan
                                    <span className="text-xs font-normal text-muted-foreground ml-2">(Opsional)</span>
                                </Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Tuliskan alasan ketidakhadiran, keterangan sakit, atau catatan penting lainnya..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="min-h-[150px] resize-y text-base p-4 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-4 pt-8 mt-4 border-t">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={onCancel}
                                    disabled={isSaving || isLoading}
                                    className="px-8 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                                >
                                    Batal
                                </Button>
                                <Button
                                    size="lg"
                                    onClick={handleSave}
                                    disabled={isSaving || isLoading}
                                    className="px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                                >
                                    {isSaving || isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Menyimpan...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-5 w-5" />
                                            Simpan Perubahan
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
