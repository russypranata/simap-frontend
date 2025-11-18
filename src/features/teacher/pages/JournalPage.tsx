'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTeacherData } from '@/features/teacher/hooks/useTeacherData';
import { 
  JournalStatsCards,
  JournalFilterSection,
  JournalList,
  JournalTable,
  JournalStatistics,
  JournalForm,
  JournalViewModal
} from '@/features/teacher/components/journal';
import { TeachingJournal } from '@/features/teacher/types/teacher';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import { 
  BookOpen, 
  Plus, 
  Printer,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

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

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<TeachingJournal | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [activeTab, setActiveTab] = useState('list');

  // Form state
  const [formData, setFormData] = useState({
    date: formatDate(new Date(), 'yyyy-MM-dd'),
    class: '',
    subject: '',
    material: '',
    topic: '',
    teachingMethod: '',
    media: '',
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

  const handleCreateJournal = async () => {
    if (!formData.class || !formData.subject || !formData.material || !formData.topic) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setIsSaving(true);
    try {
      await saveTeachingJournal(formData);
      toast.success('Jurnal mengajar berhasil disimpan!');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchTeachingJournals();
    } catch (error) {
      toast.error('Gagal menyimpan jurnal mengajar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateJournal = async () => {
    if (!selectedJournal) return;

    setIsSaving(true);
    try {
      await updateTeachingJournal(selectedJournal.id, formData);
      toast.success('Jurnal mengajar berhasil diperbarui!');
      setIsViewDialogOpen(false);
      resetForm();
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
    setSelectedJournal(journal);
    setIsViewDialogOpen(true);
  };

  const handleEditJournal = (journal: TeachingJournal) => {
    setSelectedJournal(journal);
    setFormData({
      date: journal.date,
      class: journal.class,
      subject: journal.subject,
      material: journal.material,
      topic: journal.topic,
      teachingMethod: journal.teachingMethod,
      media: journal.media,
      evaluation: journal.evaluation,
      notes: journal.notes,
      attendance: journal.attendance,
    });
    setIsViewDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      date: formatDate(new Date(), 'yyyy-MM-dd'),
      class: '',
      subject: '',
      material: '',
      topic: '',
      teachingMethod: '',
      media: '',
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
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Tambah Jurnal Baru</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tambah Jurnal Mengajar Baru</DialogTitle>
                <DialogDescription>
                  Isi data jurnal mengajar untuk mencatat kegiatan pembelajaran
                </DialogDescription>
              </DialogHeader>
              
              <JournalForm
                classes={classes}
                subjects={SUBJECTS}
                teachingMethods={TEACHING_METHODS}
                mediaOptions={MEDIA_OPTIONS}
                isSaving={isSaving}
                onSave={handleCreateJournal}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <JournalStatsCards stats={stats} />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Daftar Jurnal</TabsTrigger>
          <TabsTrigger value="table">Tabel</TabsTrigger>
          <TabsTrigger value="statistics">Statistik</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
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
                onCreateNew={() => setIsCreateDialogOpen(true)}
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

          {/* Journal List */}
          <JournalList
            journals={teachingJournals}
            searchTerm={searchTerm}
            filterClass={filterClass}
            filterSubject={filterSubject}
            onView={handleViewJournal}
            onEdit={handleEditJournal}
            onDelete={handleDeleteJournal}
            onCreateNew={() => setIsCreateDialogOpen(true)}
            totalJournals={teachingJournals.length}
          />
        </TabsContent>

        <TabsContent value="table" className="space-y-6">
          <JournalTable
            journals={teachingJournals}
            searchTerm={searchTerm}
            filterClass={filterClass}
            filterSubject={filterSubject}
            onView={handleViewJournal}
            onEdit={handleEditJournal}
            onDelete={handleDeleteJournal}
          />
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
      </Tabs>

      {/* View/Edit Dialog */}
      {selectedJournal && (
        <JournalViewModal
          isOpen={isViewDialogOpen}
          journal={selectedJournal}
          onClose={() => setIsViewDialogOpen(false)}
          onEdit={handleEditJournal}
        />
      )}
    </div>
  );
};