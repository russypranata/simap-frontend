'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeacherData } from '@/features/teacher/hooks/useTeacherData';
import {
    JournalFilterSection,
    JournalList,
    JournalTable,
    JournalStatistics,
    JournalForm,
    JournalReports,
} from '@/features/teacher/components/journal';
import { TeachingJournal } from '@/features/teacher/types/teacher';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import { LESSON_HOURS } from '@/features/teacher/constants/attendance';
import {
    BookOpen,
    FilePen,
    RefreshCw,
    Grid,
    List as ListIcon,
    Calendar,
    BarChart3,
    FileText,
    ClipboardCheck,
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
    const [activeTab, setActiveTab] = useState('list');
    const [viewType, setViewType] = useState('card');

    // PRIMARY FILTERS (Mandatory - always applied)
    const [academicYear, setAcademicYear] = useState('2025/2026');
    const [semester, setSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');

    // SECONDARY FILTERS (Optional - only applied when user explicitly sets them)
    const [dateRange, setDateRange] = useState({
        from: '', // Empty = not set (will show placeholder)
        to: ''
    });
    const [activeDateFilter, setActiveDateFilter] = useState<'today' | 'week' | 'month' | null>(null);
    const [isDateFilterActive, setIsDateFilterActive] = useState(false);

    // Quick date filter helpers
    const formatLocalDate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const setToday = () => {
        const today = new Date();
        const formatted = formatLocalDate(today);
        setDateRange({ from: formatted, to: formatted });
        setActiveDateFilter('today');
        setIsDateFilterActive(true);
    };

    const setThisWeek = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

        const firstDay = new Date(today);
        firstDay.setDate(today.getDate() + diff);
        firstDay.setHours(12, 0, 0, 0); // Set to noon to avoid timezone shifts

        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);
        lastDay.setHours(12, 0, 0, 0);

        setDateRange({
            from: formatLocalDate(firstDay),
            to: formatLocalDate(lastDay)
        });
        setActiveDateFilter('week');
        setIsDateFilterActive(true);
    };

    const setThisMonth = () => {
        const date = new Date();
        // Set to noon to avoid timezone shifts
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 12, 0, 0);

        setDateRange({
            from: formatLocalDate(firstDay),
            to: formatLocalDate(lastDay)
        });
        setActiveDateFilter('month');
        setIsDateFilterActive(true);
    };

    // Custom setDateRange wrapper to track manual changes
    const handleDateRangeChange = (newRange: { from: string; to: string }) => {
        setDateRange(newRange);
        setActiveDateFilter(null);
        // Activate date filter if user has set both dates
        setIsDateFilterActive(newRange.from !== '' && newRange.to !== '');
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
            academicYear: academicYear,
            semester: semester,
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

    const handleExportData = (format: 'excel' | 'pdf' | 'csv') => {
        toast.success(`Data jurnal berhasil diunduh dalam format ${format.toUpperCase()}!`);
    };



    // HIERARCHICAL FILTER LOGIC
    const filteredJournals = teachingJournals.filter(journal => {
        // Basic filters (always applied)
        const matchesSearch = journal.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            journal.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
            journal.topic.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = filterClass === 'all' || journal.class === filterClass;
        const matchesSubject = filterSubject === 'all' || journal.subject === filterSubject;

        // PRIMARY FILTERS (Mandatory)
        const matchesAcademicYear = journal.academicYear === academicYear;
        const matchesSemester = journal.semester === semester;

        // SECONDARY FILTER (Optional - only if user explicitly set it)
        let matchesDate = true; // Default to true (disabled)
        if (isDateFilterActive) {
            const journalDate = new Date(journal.date);
            const fromDate = new Date(dateRange.from);
            const toDate = new Date(dateRange.to);
            journalDate.setHours(0, 0, 0, 0);
            fromDate.setHours(0, 0, 0, 0);
            toDate.setHours(0, 0, 0, 0);
            matchesDate = journalDate >= fromDate && journalDate <= toDate;
        }

        return matchesSearch && matchesClass && matchesSubject &&
            matchesAcademicYear && matchesSemester && matchesDate;
    });

    const getJournalStats = () => {
        const uniqueClasses = new Set(filteredJournals.map(j => j.class));
        const uniqueSubjects = new Set(filteredJournals.map(j => j.subject));

        const totalHours = filteredJournals.reduce((total, journal) => {
            const hourStr = journal.lessonHour;
            if (!hourStr) return total;

            // Try range format "1-3"
            if (hourStr.includes('-')) {
                const [start, end] = hourStr.split('-').map(Number);
                if (!isNaN(start) && !isNaN(end)) {
                    return total + (end - start + 1);
                }
            }

            // Try comma format "1,2,3"
            if (hourStr.includes(',')) {
                return total + hourStr.split(',').length;
            }

            // Single hour or fallback
            return total + 1;
        }, 0);

        return {
            totalJournals: filteredJournals.length,
            totalClasses: uniqueClasses.size,
            totalSubjects: uniqueSubjects.size,
            totalHours: totalHours,
        };
    };

    const stats = getJournalStats();

    if (loading) {
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
                <Button variant="outline" onClick={() => router.push('/teacher/attendance')}>
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    Presensi Mapel
                </Button>
                <Button className="bg-blue-800 hover:bg-blue-900 text-white flex items-center space-x-2" onClick={() => router.push('/teacher/journal/new')}>
                    <FilePen className="h-4 w-4" />
                    <span>Tambah Jurnal Baru</span>
                </Button>
            </PageHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="inline-flex h-auto items-center justify-center rounded-full bg-muted/50 p-1.5 gap-1">
                    <TabsTrigger value="list" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 h-9 py-2 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Daftar Jurnal
                    </TabsTrigger>
                    <TabsTrigger value="statistics" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 h-9 py-2 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Statistik
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 h-9 py-2 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                        <FileText className="h-4 w-4 mr-2" />
                        Laporan
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <StatCard title="Total Jurnal" value={stats.totalJournals} subtitle="Jurnal yang dibuat" icon={BookOpen} color="blue" />
                        <StatCard title="Kelas Diajar" value={stats.totalClasses} subtitle="Kelas unik" icon={BarChart3} color="purple" />
                        <StatCard title="Mata Pelajaran" value={stats.totalSubjects} subtitle="Mapel unik" icon={FileText} color="green" />
                        <StatCard title="Jam Mengajar" value={`${stats.totalHours} JP`} subtitle="Total jam pelajaran" icon={ClipboardCheck} color="amber" />
                    </div>

                    <div className="flex justify-end">
                        <Tabs value={viewType} onValueChange={setViewType}>
                            <TabsList className="inline-flex h-auto items-center justify-center rounded-full bg-muted/50 p-1.5 gap-1">
                                <TabsTrigger value="card" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                                    <Grid className="h-4 w-4 mr-1.5" />
                                    Kartu
                                </TabsTrigger>
                                <TabsTrigger value="table" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                                    <ListIcon className="h-4 w-4 mr-1.5" />
                                    Tabel
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <JournalFilterSection
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterClass={filterClass}
                        setFilterClass={setFilterClass}
                        filterSubject={filterSubject}
                        setFilterSubject={setFilterSubject}
                        classes={classes}
                        subjects={SUBJECTS}
                        onExportData={handleExportData}
                        onCreateNew={() => router.push('/teacher/journal/new')}
                        totalJournals={teachingJournals.length}
                        filteredCount={filteredJournals.length}
                        academicYear={academicYear}
                        setAcademicYear={setAcademicYear}
                        semester={semester}
                        setSemester={setSemester}
                        dateRange={dateRange}
                        setDateRange={handleDateRangeChange}
                        activeDateFilter={activeDateFilter}
                        setToday={setToday}
                        setThisWeek={setThisWeek}
                        setThisMonth={setThisMonth}
                    />

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
                </TabsContent>

                <TabsContent value="statistics" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                    <JournalStatistics
                        journals={teachingJournals}
                        subjects={SUBJECTS}
                        classes={classes}
                        initialAcademicYear={academicYear}
                        initialSemester={semester}
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