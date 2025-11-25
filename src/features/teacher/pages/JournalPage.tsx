'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeacherData } from '@/features/teacher/hooks/useTeacherData';
import { 
  JournalStatsCards,
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
  Plus, 
  Printer,
  RefreshCw,
  Grid,
  List as ListIcon // Import List icon and alias it to avoid conflict
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Mock subjects
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

// Mock teaching methods
const TEACHING_METHODS = [
  'Ceramah',
  'Diskusi',
  'Demonstrasi',
  'Eksperimen',
  'Cooperative Learning',
  'Problem Based Learning',
  'Project Based Learning',
  'Inquiry Learning',
  'Simulasi',
  'Tanya Jawab',
];

// Mock media options
const MEDIA_OPTIONS = [
  'Papan Tulis',
  'LCD/Proyektor',
  'Modul',
  'Buku Teks',
  'Video',
  'Alat Peraga',
  'Komputer',
  'Internet',
  'Laboratorium',
  'Lapangan',
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
  const [viewType, setViewType] = useState('card'); // Add viewType state for card/table toggle

  // Form state - using arrays for teaching methods and media
  const [formData, setFormData] = useState({
    date: formatDate(new Date(), 'yyyy-MM-dd'),
    class: '',
    subject: '',
    lessonHour: '', // Add lessonHour field
    material: '',
    topic: '',
    teachingMethod: [], // Array for multiple selections
    media: [], // Array for multiple selections
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

  // Convert array values to comma-separated strings for API
  const formatJournalData = (data: typeof formData) => {
    return {
      ...data,
      teachingMethod: Array.isArray(data.teachingMethod) 
        ? data.teachingMethod.join(', ') 
        : data.teachingMethod,
      media: Array.isArray(data.media) 
        ? data.media.join(', ') 
        : data.media,
    };
  };

  const handleCreateJournal = async () => {
    if (!formData.class || !formData.subject || !formData.material || !formData.topic) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setIsSaving(true);
    try {
      // Format data before sending to API
      const formattedData = formatJournalData(formData);
      await saveTeachingJournal(formattedData);
      toast.success('Jurnal mengajar berhasil disimpan!');
      router.push('/journal/new');
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
    router.push(`/journal/view?id=${journal.id}`);
  };

  const handleEditJournal = (journal: TeachingJournal) => {
    router.push(`/journal/edit?id=${journal.id}`);
  };

  const resetForm = () => {
    setFormData({
      date: formatDate(new Date(), 'yyyy-MM-dd'),
      class: '',
      subject: '',
      lessonHour: '', // Add lessonHour field
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

  const handlePrint = () => {
    window.print();
  };

  // Get statistics
  const getJournalStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthJournals = teachingJournals.filter(journal => {
      const journalDate = new Date(journal.date);
      return journalDate.getMonth() === currentMonth && journalDate.getFullYear() === currentYear;
    });

    const totalAttendance = thisMonthJournals.reduce((sum, journal) => sum + journal.attendance.total, 0);
    const totalPresent = thisMonthJournals.reduce((sum, journal) => sum + journal.attendance.present, 0);

    return {
      totalJournals: thisMonthJournals.length,
      totalAttendance,
      totalPresent,
      attendanceRate: totalAttendance > 0 ? ((totalPresent / totalAttendance) * 100).toFixed(1) : '0',
    };
  };

  const stats = getJournalStats();

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>

        {/* Stats Cards Skeleton */}
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

        {/* Journal Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-5 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Jurnal Mengajar</h1>
          <p className="text-muted-foreground">
            Catatan kegiatan pembelajaran dan evaluasi proses mengajar
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center space-x-2"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak</span>
          </Button>
          
          <Button 
            className="flex items-center space-x-2"
            onClick={() => router.push('/journal/new')}
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Jurnal Baru</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <JournalStatsCards stats={stats} />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Daftar Jurnal</TabsTrigger>
          <TabsTrigger value="statistics">Statistik</TabsTrigger>
          <TabsTrigger value="reports">Laporan</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {/* View Type Selector */}
          <div className="flex justify-end">
            <Tabs value={viewType} onValueChange={setViewType} className="w-48">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="card" className="flex items-center justify-center gap-2">
                  <Grid className="h-4 w-4" />
                  Kartu
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center justify-center gap-2">
                  <ListIcon className="h-4 w-4" />
                  Tabel
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
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
                onCreateNew={() => router.push('/journal/new')}
                totalJournals={teachingJournals.length}
                filteredCount={teachingJournals.filter(journal => {
                  const matchesSearch = journal.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                       journal.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                       journal.topic.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesClass = filterClass === 'all' || journal.class === filterClass;
                  const matchesSubject = filterSubject === 'all' || journal.subject === filterSubject;
                  return matchesSearch && matchesClass && matchesSubject;
                }).length}
              />
            </CardContent>
          </Card>

          {/* Journal Content based on view type */}
          {viewType === 'card' ? (
            <JournalList
              journals={teachingJournals}
              searchTerm={searchTerm}
              filterClass={filterClass}
              filterSubject={filterSubject}
              onView={handleViewJournal}
              onEdit={handleEditJournal}
              onDelete={handleDeleteJournal}
              onCreateNew={() => router.push('/journal/new')}
              totalJournals={teachingJournals.length}
            />
          ) : (
            <JournalTable
              journals={teachingJournals}
              searchTerm={searchTerm}
              filterClass={filterClass}
              filterSubject={filterSubject}
              onView={handleViewJournal}
              onEdit={handleEditJournal}
              onDelete={handleDeleteJournal}
            />
          )}
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <JournalStatistics
            journals={teachingJournals}
            subjects={SUBJECTS}
            filterClass={filterClass}
            filterSubject={filterSubject}
            searchTerm={searchTerm}
          />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
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