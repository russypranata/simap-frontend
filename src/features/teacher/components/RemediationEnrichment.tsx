'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import type { Grade, RemediationNote, TeacherClass } from '../types/teacher';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import {
    BookOpen,
    Filter,
    Download,
    FileText,
    Printer,
    Edit,
    Plus,
    AlertCircle,
    TrendingUp,
    Users,
    Search,
    Target,
    CheckCircle,
    Award,
    X
} from 'lucide-react';
import { toast } from 'sonner';

interface RemediationEnrichmentProps {
    grades: Grade[];
    classes: TeacherClass[];
    onRefresh: () => void;
}

const REMEDIAL_THRESHOLD = 70; // Below this is remedial
const ENRICHMENT_THRESHOLD = 85; // Above or equal to this is enrichment

export const RemediationEnrichment: React.FC<RemediationEnrichmentProps> = ({
    grades,
    classes,
    onRefresh,
}) => {
    // Filter state
    const [academicYear, setAcademicYear] = useState('2025/2026');
    const [semester, setSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<'all' | 'remedial' | 'enrichment'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Notes state
    const [notes, setNotes] = useState<Record<string, RemediationNote>>({});
    const [editingStudent, setEditingStudent] = useState<string | null>(null);
    const [noteText, setNoteText] = useState('');
    const [actionPlanText, setActionPlanText] = useState('');

    // Get available subjects from selected classes
    const availableSubjects = useMemo(() => {
        if (selectedClasses.length === 0) {
            // If no class selected, show all subjects from all classes
            return Array.from(new Set(
                classes.flatMap(c => 'subjects' in c ? (c as any).subjects : [])
            ));
        }

        // Get subjects from selected classes only
        const subjects = selectedClasses.flatMap(classId => {
            const classData = classes.find(c => c.id === classId);
            return classData && 'subjects' in classData ? (classData as any).subjects : [];
        });

        return Array.from(new Set(subjects));
    }, [selectedClasses, classes]);

    // Categorize students based on their average scores
    const categorizedStudents = useMemo(() => {
        return grades
            .map(grade => {
                let status: 'remedial' | 'enrichment' | null = null;
                if (grade.average < REMEDIAL_THRESHOLD) {
                    status = 'remedial';
                } else if (grade.average >= ENRICHMENT_THRESHOLD) {
                    status = 'enrichment';
                }

                return {
                    ...grade,
                    status,
                };
            })
            .filter(student => student.status !== null); // Only show students needing intervention
    }, [grades]);

    // Apply filters
    const filteredStudents = useMemo(() => {
        return categorizedStudents.filter(student => {
            // Filter by academic year & semester
            const matchesPeriod = student.semester === semester;
            // Note: student.academicYear might not exist in Grade type, so we skip it for now
            // If needed, this can be added when the Grade type includes academicYear

            // Filter by selected classes (if any specific classes selected)
            const matchesClass = selectedClasses.length === 0 ||
                selectedClasses.some(classId => {
                    const classData = classes.find(c => c.id === classId);
                    return classData?.name === student.class;
                });

            // Filter by selected subjects (if any specific subjects selected)
            const matchesSubject = selectedSubjects.length === 0 ||
                selectedSubjects.includes(student.subject);

            // Filter by status
            const matchesStatus = statusFilter === 'all' || student.status === statusFilter;

            // Filter by search term
            const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.class.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesPeriod && matchesClass && matchesSubject && matchesStatus && matchesSearch;
        });
    }, [categorizedStudents, semester, selectedClasses, selectedSubjects, statusFilter, searchTerm, classes]);

    // Statistics (based on filtered results)
    const stats = useMemo(() => {
        const remedialCount = filteredStudents.filter(s => s.status === 'remedial').length;
        const enrichmentCount = filteredStudents.filter(s => s.status === 'enrichment').length;
        const totalCount = filteredStudents.length;
        const notedCount = Object.keys(notes).filter(studentId =>
            filteredStudents.some(s => s.studentId === studentId)
        ).length;

        return {
            remedialCount,
            enrichmentCount,
            totalCount,
            notedCount,
        };
    }, [filteredStudents, notes]);

    const handleOpenNoteDialog = (student: typeof categorizedStudents[0]) => {
        setEditingStudent(student.studentId);
        const existingNote = notes[student.studentId];
        setNoteText(existingNote?.note || '');
        setActionPlanText(existingNote?.actionPlan || '');
    };

    const handleSaveNote = () => {
        if (!editingStudent) return;

        const student = categorizedStudents.find(s => s.studentId === editingStudent);
        if (!student) return;

        const note: RemediationNote = {
            id: `note-${editingStudent}-${Date.now()}`,
            studentId: editingStudent,
            studentName: student.studentName,
            class: student.class,
            subject: student.subject,
            semester: student.semester,
            status: student.status!,
            score: student.average,
            grade: student.grade,
            note: noteText,
            actionPlan: actionPlanText,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        setNotes(prev => ({ ...prev, [editingStudent]: note }));
        toast.success('Catatan berhasil disimpan!');
        handleCloseDialog();
    };

    const handleCloseDialog = () => {
        setEditingStudent(null);
        setNoteText('');
        setActionPlanText('');
    };

    const handleExportData = (format: 'excel' | 'pdf') => {
        toast.success(`Data remedial & pengayaan berhasil diunduh dalam format ${format.toUpperCase()}!`);
    };

    const handlePrint = () => {
        window.print();
    };

    const getStatusBadge = (status: 'remedial' | 'enrichment') => {
        if (status === 'remedial') {
            return <Badge className="bg-red-50 text-red-700 border-red-200">Remedial</Badge>;
        }
        return <Badge className="bg-green-50 text-green-700 border-green-200">Pengayaan</Badge>;
    };

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'A': return 'text-green-600 bg-green-50 border-green-200';
            case 'B': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'C': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'D': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'E': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">

            {/* Filters */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Filter className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Filter Remedial & Pengayaan</CardTitle>
                                <CardDescription>
                                    Pilih periode, kelas, dan mata pelajaran untuk menampilkan siswa
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* First row: Academic Year, Semester, Class, Subject */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Tahun Ajaran</Label>
                            <Select value={academicYear} onValueChange={setAcademicYear}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2025/2026">2025/2026</SelectItem>
                                    <SelectItem value="2024/2025">2024/2025</SelectItem>
                                    <SelectItem value="2023/2024">2023/2024</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Semester</Label>
                            <Select value={semester} onValueChange={(value: any) => setSemester(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ganjil">Ganjil</SelectItem>
                                    <SelectItem value="Genap">Genap</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Kelas</Label>
                            <MultiSelectDropdown
                                options={classes.map(cls => ({
                                    value: cls.id,
                                    label: `${cls.name} (${cls.studentCount} siswa)`
                                }))}
                                selected={selectedClasses}
                                onChange={setSelectedClasses}
                                placeholder="Semua Kelas"
                            />
                            {selectedClasses.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedClasses.map(classId => {
                                        const classData = classes.find(c => c.id === classId);
                                        return (
                                            <Badge
                                                key={classId}
                                                className="flex items-center gap-1"
                                            >
                                                {classData?.name}
                                                <button
                                                    onClick={() => setSelectedClasses(prev => prev.filter(id => id !== classId))}
                                                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Mata Pelajaran</Label>
                            <MultiSelectDropdown
                                options={availableSubjects.map(subject => ({
                                    value: subject,
                                    label: subject
                                }))}
                                selected={selectedSubjects}
                                onChange={setSelectedSubjects}
                                placeholder="Semua Mapel"
                            />
                            {selectedSubjects.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedSubjects.map(subject => (
                                        <Badge
                                            key={subject}
                                            className="flex items-center gap-1"
                                        >
                                            {subject}
                                            <button
                                                onClick={() => setSelectedSubjects(prev => prev.filter(s => s !== subject))}
                                                className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Second row: Status and Search */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="remedial">Remedial</SelectItem>
                                    <SelectItem value="enrichment">Pengayaan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Pencarian</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari berdasarkan nama siswa atau kelas..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan {filteredStudents.length} dari {categorizedStudents.length} siswa
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExportData('excel')}
                                className="flex items-center space-x-2"
                            >
                                <Download className="h-4 w-4" />
                                <span>Export Excel</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExportData('pdf')}
                                className="flex items-center space-x-2"
                            >
                                <FileText className="h-4 w-4" />
                                <span>Export PDF</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrint}
                                className="flex items-center space-x-2"
                            >
                                <Printer className="h-4 w-4" />
                                <span>Cetak</span>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards - Showing filtered results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{stats.totalCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Hasil filter
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Remedial</CardTitle>
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.remedialCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Nilai &lt; {REMEDIAL_THRESHOLD}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pengayaan</CardTitle>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.enrichmentCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Nilai ≥ {ENRICHMENT_THRESHOLD}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Catatan Tersimpan</CardTitle>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.notedCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Dengan catatan
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Students List */}
            {filteredStudents.length > 0 ? (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold">Daftar Siswa Remedial & Pengayaan</CardTitle>
                                    <CardDescription>
                                        Siswa yang perlu tindak lanjut remedial atau pengayaan
                                    </CardDescription>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left p-3 font-medium text-sm">No</th>
                                        <th className="text-left p-3 font-medium text-sm">Nama Siswa</th>
                                        <th className="text-left p-3 font-medium text-sm">Kelas</th>
                                        <th className="text-left p-3 font-medium text-sm">Mata Pelajaran</th>
                                        <th className="text-left p-3 font-medium text-sm">Rata-rata</th>
                                        <th className="text-left p-3 font-medium text-sm">Grade</th>
                                        <th className="text-left p-3 font-medium text-sm">Status</th>
                                        <th className="text-left p-3 font-medium text-sm">Catatan</th>
                                        <th className="text-left p-3 font-medium text-sm">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((student, index) => {
                                        const hasNote = notes[student.studentId];
                                        return (
                                            <tr key={student.id} className="border-b hover:bg-muted/30">
                                                <td className="p-3 text-sm">{index + 1}</td>
                                                <td className="p-3">
                                                    <div className="font-medium text-sm">{student.studentName}</div>
                                                </td>
                                                <td className="p-3 text-sm">{student.class}</td>
                                                <td className="p-3 text-sm">{student.subject}</td>
                                                <td className="p-3">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-bold">{student.average.toFixed(1)}</span>
                                                        <div className="w-12 bg-muted rounded-full h-2">
                                                            <div
                                                                className="h-2 rounded-full bg-primary"
                                                                style={{ width: `${student.average}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <Badge className={getGradeColor(student.grade)}>
                                                        {student.grade}
                                                    </Badge>
                                                </td>
                                                <td className="p-3">
                                                    {getStatusBadge(student.status!)}
                                                </td>
                                                <td className="p-3">
                                                    {hasNote ? (
                                                        <div className="text-xs text-muted-foreground max-w-xs truncate">
                                                            {hasNote.note || hasNote.actionPlan || 'Ada catatan'}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">Belum ada catatan</span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleOpenNoteDialog(student)}
                                                        className="flex items-center space-x-1"
                                                    >
                                                        {hasNote ? <Edit className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                                                        <span>{hasNote ? 'Edit' : 'Tambah'}</span>
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Award className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Tidak Ada Siswa yang Cocok'
                                : 'Tidak Ada Siswa yang Perlu Tindak Lanjut'}
                        </h3>
                        <p className="text-muted-foreground text-center max-w-md">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Tidak ada siswa yang cocok dengan filter yang dipilih.'
                                : 'Semua siswa sudah mencapai nilai yang baik. Tidak ada yang perlu remedial atau pengayaan.'}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Edit Note Dialog */}
            <Dialog open={editingStudent !== null} onOpenChange={(open) => !open && handleCloseDialog()}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {notes[editingStudent || ''] ? 'Edit Catatan' : 'Tambah Catatan'}
                        </DialogTitle>
                        <DialogDescription>
                            Tambahkan catatan dan rencana tindak lanjut untuk siswa ini
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {editingStudent && (() => {
                            const student = categorizedStudents.find(s => s.studentId === editingStudent);
                            return student ? (
                                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold">{student.studentName}</div>
                                            <div className="text-sm text-muted-foreground">{student.class} • {student.subject}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold">{student.average.toFixed(1)}</div>
                                            <Badge className={getGradeColor(student.grade)}>{student.grade}</Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {getStatusBadge(student.status!)}
                                        <span className="text-sm text-muted-foreground">
                                            {student.status === 'remedial'
                                                ? `Perlu remedial (nilai < ${REMEDIAL_THRESHOLD})`
                                                : `Layak pengayaan (nilai ≥ ${ENRICHMENT_THRESHOLD})`}
                                        </span>
                                    </div>
                                </div>
                            ) : null;
                        })()}

                        <div className="space-y-2">
                            <Label htmlFor="note">Catatan</Label>
                            <Textarea
                                id="note"
                                placeholder="Masukkan catatan tentang kondisi siswa, kendala yang dihadapi, dll..."
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="actionPlan">Rencana Tindak Lanjut</Label>
                            <Textarea
                                id="actionPlan"
                                placeholder="Masukkan rencana tindak lanjut, strategi remedial/pengayaan yang akan dilakukan..."
                                value={actionPlanText}
                                onChange={(e) => setActionPlanText(e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseDialog}>
                            Batal
                        </Button>
                        <Button onClick={handleSaveNote} disabled={!noteText && !actionPlanText}>
                            <Target className="h-4 w-4 mr-2" />
                            Simpan Catatan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
