'use client';

import React, { useState, useMemo } from 'react';
import { MOCK_STUDENTS } from '@/features/admin/data/mockStudentData';
import { MOCK_CLASSES } from '@/features/admin/data/mockClassData';
import { Student } from '@/features/admin/types/student';
import { Class } from '@/features/admin/types/class';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
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
import { Search, Users, ArrowRight, Save, AlertCircle, UserCheck, GraduationCap, Filter, School, ChevronLeft, ChevronRight,    CheckCircle2,
    Clock,
    BookOpen
} from 'lucide-react';
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
    const [placementMode, setPlacementMode] = useState<'REGULER' | 'PEMINATAN'>('REGULER');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Derived Data: Source Students (Unassigned or Eligible for Peminatan)
    const sourceStudents = useMemo(() => {
        return students.filter((s) => {
            const isActive = s.status === 'active';
            
            // Mode Specific Logic
            let isEligible = false;
            if (placementMode === 'REGULER') {
                // Reguler: Must NOT have a class yet
                isEligible = !s.classId || s.classId === '';
            } else {
                // Peminatan: Must HAVE a Main Class (Reguler)
                const hasMainClass = s.classId && s.classId !== '';
                
                // Optional: Check duplication (Exclude if already in THIS target class)
                // Note: We need targetClass here, but it's outside useMemo dependency usually. 
                // For now, we allow selecting them, but handleAssign prevents duplicates or we show visual indicator.
                
                isEligible = !!hasMainClass; 

                // Auto-Filter: Hide Grade 10 (Gen 2025) from Peminatan
                // Peminatan is only for Grade 11 & 12
                
                // 1. Check by Class Name (Most Reliable)
                const isGradeX = s.className?.startsWith('X-') || s.className?.startsWith('X ') || s.className === 'X';
                
                // 2. Check by Generation (Backup)
                const studentGrade = 2025 - parseInt(s.generation) + 10;
                
                if (isGradeX || studentGrade === 10) return false;
            }

            // Filter Logic
            const matchesGeneration = selectedGeneration === 'all' || s.generation === selectedGeneration;
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  s.nis.includes(searchQuery);

            return isEligible && isActive && matchesGeneration && matchesSearch;
        });
    }, [students, selectedGeneration, searchQuery, placementMode]);

    // Derived Data: Paginated Students
    const paginatedStudents = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sourceStudents.slice(startIndex, startIndex + itemsPerPage);
    }, [sourceStudents, currentPage]);

    const totalPages = Math.ceil(sourceStudents.length / itemsPerPage);

    // Reset page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
        setSelectedStudentIds([]); // Clear selection on mode/filter change
        setSelectedClassId('');
    }, [selectedGeneration, searchQuery, placementMode]);

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
            // Capacity check disabled temporarily as per user request
            /*
             return {
                isValid: false,
                message: `Kapasitas terlampaui! (Isi: ${currentTotal}, Pilih: ${toAdd}, Max: ${capacity})`,
                isOverCapacity: true
            };
            */
        }

        const selectedStudents = students.filter(s => selectedStudentIds.includes(s.id));

        // 1. Gender Validation (Universal for Reguler & Peminatan)
        if (targetClass.genderCategory) {
            const invalidGenderStudents = selectedStudents.filter(s => {
                if (targetClass.genderCategory === 'PUTRA' && s.gender !== 'L') return true;
                if (targetClass.genderCategory === 'PUTRI' && s.gender !== 'P') return true;
                return false;
            });
            
            if (invalidGenderStudents.length > 0) {
                 return {
                    isValid: false,
                    message: `${invalidGenderStudents.length} siswa tidak sesuai gender kelas (${targetClass.genderCategory}).`
                };
            }
        }

        // 2. Grade Validation (Robust Logic using Generation)
        // Assumption: Academic Year start year (e.g. 2025 for 2025/2026)
        // Grade 10 = Gen 2025 (Current Year)
        // Grade 11 = Gen 2024 (Last Year)
        // Grade 12 = Gen 2023 (2 Years Ago)
        
        const currentYear = parseInt(targetClass.academicYearId.split('-')[1]); // ay-2025-2026 -> 2025
        const invalidGradeStudents = selectedStudents.filter(s => {
            const studentEntryYear = parseInt(s.generation);
            const expectedGrade = (currentYear - studentEntryYear) + 10; // 2025 - 2025 + 10 = 10
            
            // Allow slight flexibility or strict? Let's be strict for now.
            if (expectedGrade !== targetClass.grade) {
                return true; 
            }
            return false;
        });

        if (invalidGradeStudents.length > 0) {
             return {
                isValid: false,
                message: `${invalidGradeStudents.length} siswa tidak sesuai jenjang (Siswa harusnya kelas ${currentYear - parseInt(invalidGradeStudents[0].generation) + 10}).`
            };
        }

        // 3. Max Peminatan Validation (Max 3 Subjects)
        if (targetClass.type === 'PEMINATAN') {
            const studentsExceedingLimit = selectedStudents.filter(s => {
                const existingClasses = s.peminatanClasses || [];
                // Check if already enrolled in THIS class (skip check)
                if (existingClasses.some(c => c.id === targetClass.id)) return false;
                
                // Limit to 3
                return existingClasses.length >= 3;
            });

            if (studentsExceedingLimit.length > 0) {
                return {
                   isValid: false,
                   message: `${studentsExceedingLimit.length} siswa sudah mengambil batas maksimal 3 mapel peminatan.`
               };
           }
        }

        return { isValid: true, message: 'Siap ditempatkan' };
    }, [targetClass, selectedStudentIds, placementMode, students]);

    // Handlers
    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedStudentIds(sourceStudents.map(s => s.id));
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
                if (targetClass.type === 'REGULER') {
                    // Layer 1: Assign Main Class
                    return { ...s, classId: targetClass.id, className: targetClass.name };
                } else {
                    // Layer 2: Assign Peminatan Class (Append Mode)
                    const existingClasses = s.peminatanClasses || [];
                    
                    // Prevent Duplicate Enrollment in same class
                    if (existingClasses.some(c => c.id === targetClass.id)) {
                        return s; 
                    }

                    return { 
                        ...s, 
                        peminatanClasses: [
                            ...existingClasses, 
                            { id: targetClass.id, name: targetClass.name }
                        ] 
                    };
                }
            }
            return s;
        });

        // Update Class Stats
        const updatedClasses = classes.map(c => {
            if (c.id === targetClass.id) {
                // In real app, count from DB. Here manual increment.
                // For Peminatan, checks if student wasn't already there to avoid double count (mock limitation)
                return { ...c, totalStudents: c.totalStudents + selectedStudentIds.length };
            }
            return c;
        });

        setClasses(updatedClasses);
        setStudents(updatedStudents); // Always update students for both modes

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
                        Atur penempatan siswa ke dalam rombongan belajar (Reguler atau Peminatan).
                    </p>
                </div>

                {/* Mode Toggle */}
                <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200">
                    <button
                        onClick={() => setPlacementMode('REGULER')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                            placementMode === 'REGULER' 
                                ? "bg-white text-primary shadow-sm ring-1 ring-slate-200" 
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                        )}
                    >
                        <UserCheck className="w-4 h-4" />
                        <span>Kelas Reguler</span>
                    </button>
                    <button
                        onClick={() => setPlacementMode('PEMINATAN')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                            placementMode === 'PEMINATAN' 
                                ? "bg-white text-primary shadow-sm ring-1 ring-slate-200" 
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                        )}
                    >
                        <BookOpen className="w-4 h-4" />
                        <span>Kelas Peminatan</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* LEFT PANEL: SOURCE (BANK SISWA) */}
                <Card className="md:col-span-7 h-fit border-slate-200 shadow-sm">
                    <CardHeader className="pb-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                    <GraduationCap className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">
                                        {placementMode === 'REGULER' ? 'Bank Siswa' : 'Siswa Tingkat Lanjut'}
                                    </CardTitle>
                                    <CardDescription>
                                        {placementMode === 'REGULER' 
                                            ? 'Siswa aktif yang belum memiliki kelas.' 
                                            : 'Siswa XI/XII untuk ditempatkan ke mapel peminatan.'}
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge variant="secondary" className="bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-100">
                                {sourceStudents.length} Data
                            </Badge>
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
                                <TableHeader className="bg-slate-50 text-slate-700 border-b border-slate-200 sticky top-0 z-10">
                                    <TableRow>
                                        <TableHead className="w-[50px] pl-4">
                                            <Checkbox
                                                checked={sourceStudents.length > 0 && selectedStudentIds.length === sourceStudents.length}
                                                onCheckedChange={toggleSelectAll}
                                                disabled={sourceStudents.length === 0}
                                            />
                                        </TableHead>
                                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Siswa</TableHead>
                                        <TableHead className="font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">L/P</TableHead>
                                        <TableHead className="font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">Angkatan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedStudents.length === 0 ? (
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
                                        paginatedStudents.map((student) => (
                                            <TableRow
                                                key={student.id}
                                                className={cn(
                                                    "cursor-pointer transition-colors hover:bg-slate-50/80",
                                                    selectedStudentIds.includes(student.id) ? "bg-blue-50/50 hover:bg-blue-50/70" : ""
                                                )}
                                                onClick={() => toggleSelectStudent(student.id)}
                                            >
                                                <TableCell className="pl-4 py-3">
                                                    <Checkbox
                                                        checked={selectedStudentIds.includes(student.id)}
                                                        onCheckedChange={() => toggleSelectStudent(student.id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 border border-blue-100 hidden sm:block ring-2 ring-white shadow-sm">
                                                            <AvatarImage src={student.profilePicture} />
                                                            <AvatarFallback className="bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-100">
                                                                {student.name.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0">
                                                            <div className={cn(
                                                                "font-semibold text-sm truncate max-w-[180px] sm:max-w-xs transition-colors",
                                                                selectedStudentIds.includes(student.id) ? "text-slate-900" : "text-slate-700"
                                                            )}>
                                                                {student.name}
                                                            </div>
                                                            <div className="flex flex-col gap-1 mt-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="inline-flex items-center rounded-sm bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                                                                        {student.nis}
                                                                    </span>
                                                                    {student.className && (
                                                                        <span className="inline-flex items-center rounded-sm bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                                            {student.className}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                
                                                                {/* Show Peminatan Classes if any */}
                                                                {placementMode === 'PEMINATAN' && student.peminatanClasses && student.peminatanClasses.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {student.peminatanClasses.slice(0, 3).map(pc => (
                                                                            <span key={pc.id} className="inline-flex items-center rounded-sm bg-orange-50 px-1.5 py-0.5 text-[9px] font-medium text-orange-700 ring-1 ring-inset ring-orange-700/10">
                                                                                {/* Smart Title Case */}
                                                                                {pc.name.split(' ').map(w =>
                                                                                    /^(X|XI|XII|IKH|AKH|PEM|IPA|IPS)$/i.test(w)
                                                                                        ? w.toUpperCase()
                                                                                        : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
                                                                                ).join(' ')}
                                                                            </span>
                                                                        ))}
                                                                        
                                                                        {student.peminatanClasses.length > 3 && (
                                                                            <span className="inline-flex items-center rounded-sm bg-slate-50 px-1.5 py-0.5 text-[9px] font-medium text-slate-500 ring-1 ring-inset ring-slate-500/10">
                                                                                +{student.peminatanClasses.length - 3}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {selectedStudentIds.includes(student.id) && (
                                                                    <span className="text-[10px] font-medium text-slate-600 animate-in fade-in bg-slate-100 px-1.5 py-0.5 rounded-sm w-fit">
                                                                        Terpilih
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3 hidden sm:table-cell">
                                                    <Badge className="bg-blue-800 hover:bg-blue-900 text-white border-none font-medium text-xs px-2.5 py-0.5 shadow-sm">
                                                        {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-3 hidden sm:table-cell">
                                                    <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                                                        <GraduationCap className="h-4 w-4 text-slate-400" />
                                                        <span>{student.generation}</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 bg-slate-50 border-t border-slate-200">
                            {/* Left: Pagination Info */}
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span>Menampilkan</span>
                                <span className="font-medium text-slate-700">
                                    {sourceStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
                                </span>
                                <span>-</span>
                                <span className="font-medium text-slate-700">
                                    {Math.min(currentPage * itemsPerPage, sourceStudents.length)}
                                </span>
                                <span>dari</span>
                                <span className="font-medium text-slate-700">{sourceStudents.length}</span>
                                <span>data</span>
                            </div>

                            {/* Right: Pagination Controls */}
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 w-8 p-0" 
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum = i + 1;
                                    // Simple logic to show current page if > 5. For now, showing first 5.
                                    // Better logic:
                                    if (totalPages > 5) {
                                        if (currentPage > 3) {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        if (pageNum > totalPages) return null;
                                    }
                                    
                                    // Simplified for < 5 pages or simple slider
                                    // Let's implement correct sliding window later if needed, 
                                    // for now just show up to 5 pages or all if < 5
                                     if (totalPages <= 5) {
                                        pageNum = i + 1;
                                     } else {
                                        // Complex pagination logic not strictly necessary for mock, 
                                        // keeping it simpler: Show first few
                                        pageNum = i + 1;
                                     }
                                     
                                    return (
                                        <Button 
                                            key={pageNum}
                                            variant={currentPage === pageNum ? "default" : "outline"} 
                                            size="sm" 
                                            className={cn(
                                                "h-8 w-8 p-0 border-slate-300 font-medium transition-colors",
                                                currentPage === pageNum 
                                                    ? "bg-blue-800 hover:bg-blue-900 text-white border-blue-800" 
                                                    : "bg-white text-slate-700 hover:bg-slate-50"
                                            )}
                                            onClick={() => setCurrentPage(pageNum)}
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                }).filter(Boolean)}

                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* RIGHT PANEL: TARGET (KELAS TUJUAN) */}
                <div className="md:col-span-5 space-y-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-4 space-y-4">
                             <div className="flex items-center gap-3">

                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
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
                        
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                             <div className="relative flex-1">
                                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                                    <SelectTrigger className="h-10 bg-white text-sm">
                                        <SelectValue placeholder="Pilih Kelas Tujuan..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[10, 11, 12].map(grade => {
                                            const gradeClasses = classes.filter(c => c.type === placementMode && c.grade === grade);
                                            if (gradeClasses.length === 0) return null;
                                            
                                            return (
                                                <div key={grade}>
                                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-slate-50 uppercase tracking-wider">
                                                        Kelas {grade === 10 ? 'X' : grade === 11 ? 'XI' : 'XII'}
                                                    </div>
                                                    {gradeClasses.map(cls => (
                                                        <SelectItem key={cls.id} value={cls.id}>
                                                            <span className="mr-2">
                                                                {cls.name.split(' ').map(w =>
                                                                    /^(X|XI|XII|IKH|AKH|PEM|IPA|IPS)$/i.test(w)
                                                                        ? w.toUpperCase()
                                                                        : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
                                                                ).join(' ')}
                                                            </span>
                                                            {/* Capacity disabled temporarily */}
                                                        </SelectItem>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-0">

                            {targetClass ? (
                                <div className="space-y-4 border border-slate-200 p-5 rounded-xl bg-slate-50/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-base text-slate-800">
                                                {/* Helper to format Title Case but keep Roman Numerals/Abbreviations */}
                                                {targetClass.name.split(' ').map(w =>
                                                    /^(X|XI|XII|IKH|AKH|PEM|IPA|IPS)$/i.test(w)
                                                        ? w.toUpperCase()
                                                        : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
                                                ).join(' ')}
                                            </h4>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                                                <p className="text-xs text-muted-foreground">
                                                    {targetClass.type === 'PEMINATAN' ? 'Guru: ' : 'Wali: '}
                                                    {targetClass.homeroomTeacherName || '-'}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={targetClass.type === 'REGULER' ? 'outline' : 'default'} className="uppercase text-[10px]">
                                            {targetClass.type}
                                        </Badge>
                                    </div>

                                    {/* Capacity Progress Disabled temporarily */}
                                    {/* 
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
                                    */}

                                    {selectedStudentIds.length > 0 && (
                                        <div className="pt-4 border-t border-slate-200/60 mt-2 space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Akan Ditambahkan:</span>
                                                <Badge variant="secondary" className="text-blue-700 bg-blue-50 border-blue-100 font-bold">
                                                    +{selectedStudentIds.length} Siswa
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between text-sm pt-2 border-t border-slate-100 items-center">
                                                <span className="text-slate-600">Total Siswa:</span>
                                                {/* Simplified Total Display */}
                                                <span className="font-bold text-sm text-emerald-600">
                                                    {targetClass.totalStudents + selectedStudentIds.length} Siswa
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {!validation.isValid && selectedStudentIds.length > 0 && (
                                        <div className="flex items-start gap-2 text-red-600 text-xs bg-red-50 p-2.5 rounded-md border border-red-100 animate-in fade-in zoom-in-95 duration-200">
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
                                className="w-full bg-blue-800 hover:bg-blue-900 text-white shadow-sm hover:shadow transition-all font-medium"
                                size="default"
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
