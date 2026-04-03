'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeacherData } from '@/features/teacher/hooks/useTeacherData';
import { useAcademicYear } from '@/context/AcademicYearContext';
import {
    JournalFilterSection,
    JournalList,
    JournalTable,
    JournalStatistics,
    JournalForm,
    JournalReports,
    JournalPeriodSelector,
} from '@/features/teacher/components/journal';
import type { QuickDateFilter } from '@/features/teacher/components/journal';
import { TeachingJournal } from '@/features/teacher/types/teacher';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import { LESSON_HOURS } from '@/features/teacher/constants/attendance';
import {
    BookOpen,
    FilePen,
    RefreshCw,
    Calendar,
    BarChart3,
    FileText,
    ClipboardCheck,
    Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { PageHeader, StatCard } from '@/features/shared/components';

const SUBJECTS = [
    'Matematika',
    'Fisika',
    'Kimia',
    'Biologi',
    'Bahasa Indonesia',
    'Bahasa Inggris',
    'Sejarah',
    'Geografi',
    'Ekonomi',
    'Sosiologi',
];

export const JournalPage: React.FC = () => {
    const router = useRouter();
    const {
        loading,
        error,
        classes,
        teachingJournals,
        fetchTeachingJournals,
        saveTeachingJournal,
        updateTeachingJournal,
        deleteTeachingJournal,
        clearError,
    } = useTeacherData();

    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('all');
    const [filterSubject, setFilterSubject] = useState('all');
    const [activeDateFilter, setActiveDateFilter] = useState<'today' | 'week' | 'month' | null>(null);
    const [activeTab, setActiveTab] = useState('list');
    const [viewType, setViewType] = useState('card');

    // Filter periode untuk tab Daftar — default dari context, independen dari tab lain
    const { academicYear: academicYearCtx } = useAcademicYear();
    const defaultAcademicYear = academicYearCtx.academicYear;
    const defaultSemester = academicYearCtx.semester === '1' ? 'Ganjil' : 'Genap';
    const [listAcademicYear, setListAcademicYear] = useState(defaultAcademicYear);
    const [listSemester, setListSemester] = useState<'Ganjil' | 'Genap'>(defaultSemester as 'Ganjil' | 'Genap');

    const formatLocalDate = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    const getDateRangeForFilter = (filter: 'today' | 'week' | 'month' | null) => {
        if (!filter) return null;
        const today = new Date();
        if (filter === 'today') { const d = formatLocalDate(today); return { from: d, to: d }; }
        if (filter === 'week') {
            const dow = today.getDay();
            const diff = dow === 0 ? -6 : 1 - dow;
            const first = new Date(today); first.setDate(today.getDate() + diff); first.setHours(12);
            const last = new Date(first); last.setDate(first.getDate() + 6); last.setHours(12);
            return { from: formatLocalDate(first), to: formatLocalDate(last) };
        }
        const first = new Date(today.getFullYear(), today.getMonth(), 1, 12);
        const last = new Date(today.getFullYear(), today.getMonth() + 1, 0, 12);
        return { from: formatLocalDate(first), to: formatLocalDate(last) };
    };

    const handleApplyListFilter = (cls: string, subject: string, dateFilter: QuickDateFilter) => {
        setFilterClass(cls);
        setFilterSubject(subject);
        setActiveDateFilter(dateFilter);
    };

    const handleResetListFilter = () => {
        setFilterClass('all');
        setFilterSubject('all');
        setActiveDateFilter(null);
    };

    const [formData, setFormData] = useState({
        date: formatDate(new Date(), 'yyyy-MM-dd'),
        class: '',
        subject: '',
        lessonHour: '',
        material: '',
        topic: '',
        teachingMethod: [],
        media: [],
        evaluation: '',
        notes: '',
        attendance: {
            total: 0,
            present: 0,
            sick: 0,
            permit: 0,
            absent: 0,
        },
    });

    useEffect(() => {
        fetchTeachingJournals();
    }, []);

    const formatJournalData = (data: typeof formData) => {
        return {
            ...data,
            teachingMethod: Array.isArray(data.teachingMethod)
                ? data.teachingMethod.join(', ')
                : data.teachingMethod,
            media: Array.isArray(data.media)
                ? data.media.join(', ')
                : data.media,
            academicYear: defaultAcademicYear,
            semester: defaultSemester as 'Ganjil' | 'Genap',
        };
    };

    const handleCreateJournal = async () => {
        if (!formData.class || !formData.subject || !formData.material || !formData.topic) {
            toast.error('Mohon lengkapi semua field yang wajib diisi');
            return;
        }
        setIsSaving(true);
        try {
            const formattedData = formatJournalData(formData);
            await saveTeachingJournal(formattedData);
            toast.success('Jurnal mengajar berhasil disimpan!');
            router.push('/teacher/journal/new');
            resetForm();
            fetchTeachingJournals();
        } catch (error) {
            toast.error('Gagal menyimpan jurnal mengajar');
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateJournal = async (updatedJournal: TeachingJournal) => {
        setIsSaving(true);
        try {
            await updateTeachingJournal(updatedJournal.id, updatedJournal);
            toast.success('Jurnal mengajar berhasil diperbarui!');
            fetchTeachingJournals();
        } catch (error) {
            toast.error('Gagal memperbarui jurnal mengajar');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteJournal = async (journal: TeachingJournal) => {
        if (!confirm('Apakah Anda yakin ingin menghapus jurnal ini?')) return;
        try {
            await deleteTeachingJournal(journal.id);
            toast.success('Jurnal mengajar berhasil dihapus!');
            fetchTeachingJournals();
        } catch (error) {
            toast.error('Gagal menghapus jurnal mengajar');
        }
    };

    const handleViewJournal = (journal: TeachingJournal) => {
        router.push(`/teacher/journal/view?id=${journal.id}`);
    };

    const handleEditJournal = (journal: TeachingJournal) => {
        router.push(`/teacher/journal/edit?id=${journal.id}`);
    };

    const resetForm = () => {
        setFormData({
            date: formatDate(new Date(), 'yyyy-MM-dd'),
            class: '',
            subject: '',
            lessonHour: '',
            material: '',
            topic: '',
            teachingMethod: [],
            media: [],
            evaluation: '',
            notes: '',
            attendance: {
                total: 0,
                present: 0,
                sick: 0,
                permit: 0,
                absent: 0,
            },
        });
    };





    // Filter hanya periode — untuk stats card (tidak terpengaruh search/kelas/mapel)
    const periodJournals = useMemo(() =>
        teachingJournals.filter(j =>
            j.academicYear === listAcademicYear && j.semester === listSemester
        ), [teachingJournals, listAcademicYear, listSemester]);

    // Filter lengkap — untuk daftar jurnal
    const filteredJournals = useMemo(() => {
        const dateRange = getDateRangeForFilter(activeDateFilter);
        return periodJournals.filter(journal => {
            const matchesSearch = journal.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                journal.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
                journal.topic.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesClass = filterClass === 'all' || journal.class === filterClass;
            const matchesSubject = filterSubject === 'all' || journal.subject === filterSubject;
            let matchesDate = true;
            if (dateRange) {
                const d = new Date(journal.date); d.setHours(0, 0, 0, 0);
                const from = new Date(dateRange.from); from.setHours(0, 0, 0, 0);
                const to = new Date(dateRange.to); to.setHours(0, 0, 0, 0);
                matchesDate = d >= from && d <= to;
            }
            return matchesSearch && matchesClass && matchesSubject && matchesDate;
        });
    }, [periodJournals, searchTerm, filterClass, filterSubject, activeDateFilter]);

    const stats = useMemo(() => {
        const uniqueClasses = new Set(periodJournals.map(j => j.class));
        const totalHours = periodJournals.reduce((total, journal) => {
            const hourStr = journal.lessonHour;
            if (!hourStr) return total;
            if (hourStr.includes('-')) {
                const [start, end] = hourStr.split('-').map(Number);
                if (!isNaN(start) && !isNaN(end)) return total + (end - start + 1);
            }
            if (hourStr.includes(',')) return total + hourStr.split(',').length;
            return total + 1;
        }, 0);
        const totalPresent = periodJournals.reduce((sum, j) => sum + (j.attendance?.present || 0), 0);
        const totalStudents = periodJournals.reduce((sum, j) => sum + (j.attendance?.total || 0), 0);
        const avgAttendance = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;
        return {
            totalJournals: periodJournals.length,
            totalClasses: uniqueClasses.size,
            avgAttendance,
            totalHours,
        };
    }, [periodJournals]);    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-4">
                                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                                <div className="h-3 bg-muted rounded w-full"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Jurnal"
                titleHighlight="Mengajar"
                icon={BookOpen}
                description="Catatan kegiatan pembelajaran dan evaluasi proses mengajar"
            >
                <Button className="bg-blue-800 hover:bg-blue-900 text-white flex items-center space-x-2" onClick={() => router.push('/teacher/journal/new')}>
                    <FilePen className="h-4 w-4" />
                    <span>Tambah Jurnal Baru</span>
                </Button>
            </PageHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="inline-flex h-auto items-center justify-center rounded-full bg-muted/50 p-1 gap-0.5">
                    <TabsTrigger value="list" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                        <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                        Daftar Jurnal
                    </TabsTrigger>
                    <TabsTrigger value="statistics" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                        <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                        Statistik
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        Laporan
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                    <JournalPeriodSelector
                        academicYear={listAcademicYear}
                        semester={listSemester}
                        defaultAcademicYear={defaultAcademicYear}
                        defaultSemester={defaultSemester}
                        onApply={(year, sem) => {
                            setListAcademicYear(year);
                            setListSemester(sem as 'Ganjil' | 'Genap');
                        }}
                        onClear={() => {
                            setListAcademicYear(defaultAcademicYear);
                            setListSemester(defaultSemester as 'Ganjil' | 'Genap');
                        }}
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <StatCard title="Total Jurnal" value={stats.totalJournals} subtitle={`${listAcademicYear} • ${listSemester}`} icon={BookOpen} color="blue" />
                        <StatCard title="Kelas Diajar" value={stats.totalClasses} subtitle="Kelas unik" icon={BarChart3} color="purple" />
                        <StatCard title="Rata-rata Kehadiran" value={`${stats.avgAttendance}%`} subtitle="Kehadiran siswa" icon={Users} color="green" />
                        <StatCard title="Jam Mengajar" value={`${stats.totalHours} JP`} subtitle="Total jam pelajaran" icon={ClipboardCheck} color="amber" />
                    </div>

                    <JournalFilterSection
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterClass={filterClass}
                        filterSubject={filterSubject}
                        activeDateFilter={activeDateFilter}
                        classes={classes}
                        subjects={SUBJECTS}
                        filteredCount={filteredJournals.length}
                        viewType={viewType}
                        onViewTypeChange={setViewType}
                        onApplyFilter={handleApplyListFilter}
                        onResetFilter={handleResetListFilter}
                    >
                        {viewType === 'card' ? (
                            <JournalList
                                journals={filteredJournals}
                                searchTerm={searchTerm}
                                filterClass={filterClass}
                                filterSubject={filterSubject}
                                onView={handleViewJournal}
                                onEdit={handleEditJournal}
                                onDelete={handleDeleteJournal}
                                onCreateNew={() => router.push('/teacher/journal/new')}
                                totalJournals={teachingJournals.length}
                            />
                        ) : (
                            <JournalTable
                                journals={filteredJournals}
                                searchTerm={searchTerm}
                                filterClass={filterClass}
                                filterSubject={filterSubject}
                                onView={handleViewJournal}
                                onEdit={handleEditJournal}
                                onDelete={handleDeleteJournal}
                            />
                        )}
                    </JournalFilterSection>
                </TabsContent>

                <TabsContent value="statistics" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                    <JournalStatistics
                        journals={teachingJournals}
                        subjects={SUBJECTS}
                        classes={classes}
                        initialAcademicYear={defaultAcademicYear}
                        initialSemester={defaultSemester as 'Ganjil' | 'Genap'}
                    />
                </TabsContent>

                <TabsContent value="reports" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                    <JournalReports
                        journals={teachingJournals}
                        classes={classes}
                        subjects={SUBJECTS}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};