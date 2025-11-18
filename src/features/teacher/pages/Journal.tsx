'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useTeacherData } from '../hooks/useTeacherData';
import { JournalCard } from '../components/JournalCard';
import { TeachingJournal } from '../types/teacher';
import { formatDate, formatTime, getRelativeTime } from '@/features/shared/utils/dateFormatter';
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  Users, 
  Search, 
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  FileText,
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
  RefreshCw,
  Printer,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export const Journal: React.FC = () => {
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
  const [isEditing, setIsEditing] = useState(false);
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

  // Mock subjects
  const subjects = [
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
  const teachingMethods = [
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
  const mediaOptions = [
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
      setIsEditing(false);
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
    setIsEditing(false);
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
    setIsEditing(true);
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

  // Filter journals
  const filteredJournals = teachingJournals.filter(journal => {
    const matchesSearch = journal.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         journal.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         journal.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || journal.class === filterClass;
    const matchesSubject = filterSubject === 'all' || journal.subject === filterSubject;
    
    return matchesSearch && matchesClass && matchesSubject;
  });

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
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
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
              <CardHeader>
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
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
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Tanggal *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      max={formatDate(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="class">Kelas *</Label>
                    <Select value={formData.class} onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.name}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Mata Pelajaran *</Label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih mata pelajaran" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Material and Topic */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material">Materi Pembelajaran *</Label>
                    <Input
                      id="material"
                      placeholder="Contoh: Turunan Fungsi"
                      value={formData.material}
                      onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topik Pembelajaran *</Label>
                    <Input
                      id="topic"
                      placeholder="Contoh: Turunan dari sin(x), cos(x), tan(x)"
                      value={formData.topic}
                      onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Teaching Method and Media */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teachingMethod">Metode Mengajar</Label>
                    <Select value={formData.teachingMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, teachingMethod: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih metode mengajar" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachingMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="media">Media Pembelajaran</Label>
                    <Select value={formData.media} onValueChange={(value) => setFormData(prev => ({ ...prev, media: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih media pembelajaran" />
                      </SelectTrigger>
                      <SelectContent>
                        {mediaOptions.map((media) => (
                          <SelectItem key={media} value={media}>
                            {media}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Attendance */}
                <div>
                  <Label>Absensi Siswa</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="total" className="text-xs">Total Siswa</Label>
                      <Input
                        id="total"
                        type="number"
                        placeholder="0"
                        value={formData.attendance.total}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          attendance: { ...prev.attendance, total: parseInt(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="present" className="text-xs">Hadir</Label>
                      <Input
                        id="present"
                        type="number"
                        placeholder="0"
                        value={formData.attendance.present}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          attendance: { ...prev.attendance, present: parseInt(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sick" className="text-xs">Sakit</Label>
                      <Input
                        id="sick"
                        type="number"
                        placeholder="0"
                        value={formData.attendance.sick}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          attendance: { ...prev.attendance, sick: parseInt(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="permit" className="text-xs">Izin</Label>
                      <Input
                        id="permit"
                        type="number"
                        placeholder="0"
                        value={formData.attendance.permit}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          attendance: { ...prev.attendance, permit: parseInt(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="absent" className="text-xs">Alpa</Label>
                      <Input
                        id="absent"
                        type="number"
                        placeholder="0"
                        value={formData.attendance.absent}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          attendance: { ...prev.attendance, absent: parseInt(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Evaluation */}
                <div className="space-y-2">
                  <Label htmlFor="evaluation">Evaluasi Pembelajaran</Label>
                  <Textarea
                    id="evaluation"
                    placeholder="Contoh: Tugas individu, Quiz singkat, Observasi partisipasi siswa"
                    value={formData.evaluation}
                    onChange={(e) => setFormData(prev => ({ ...prev, evaluation: e.target.value }))}
                    rows={3}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan Tambahan</Label>
                  <Textarea
                    id="notes"
                    placeholder="Catatan tentang proses pembelajaran, kendala yang dihadapi, atau hal lain yang perlu dicatat"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleCreateJournal} disabled={isSaving}>
                    {isSaving ? (
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Menyimpan...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Simpan Jurnal</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jurnal Bulan Ini</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJournals}</div>
            <p className="text-xs text-muted-foreground">
              Total jurnal yang dibuat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttendance}</div>
            <p className="text-xs text-muted-foreground">
              Siswa yang mengikuti pembelajaran
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Siswa Hadir</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalPresent}</div>
            <p className="text-xs text-muted-foreground">
              Siswa hadir dalam pembelajaran
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Kehadiran</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              Rata-rata kehadiran siswa
            </p>
          </CardContent>
        </Card>
      </div>

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
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari berdasarkan mata pelajaran, materi, atau topik..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select value={filterClass} onValueChange={setFilterClass}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kelas</SelectItem>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.name}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterSubject} onValueChange={setFilterSubject}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter mata pelajaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {filteredJournals.length} dari {teachingJournals.length} jurnal
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Journal Cards */}
          {filteredJournals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJournals.map((journal) => (
                <JournalCard
                  key={journal.id}
                  journal={journal}
                  onView={handleViewJournal}
                  onEdit={handleEditJournal}
                  onDelete={handleDeleteJournal}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Belum Ada Jurnal
                </h3>
                <p className="text-muted-foreground text-center max-w-md mb-4">
                  {searchTerm || filterClass !== 'all' || filterSubject !== 'all'
                    ? 'Tidak ada jurnal yang cocok dengan filter yang dipilih.'
                    : 'Belum ada jurnal mengajar yang dibuat. Mulai dengan menambah jurnal baru.'}
                </p>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Tambah Jurnal Baru</span>
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="table" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Tabel Jurnal Mengajar</span>
              </CardTitle>
              <CardDescription>
                Daftar jurnal mengajar dalam format tabel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">Tanggal</th>
                      <th className="text-left p-4 font-medium text-sm">Kelas</th>
                      <th className="text-left p-4 font-medium text-sm">Mata Pelajaran</th>
                      <th className="text-left p-4 font-medium text-sm">Materi</th>
                      <th className="text-left p-4 font-medium text-sm">Topik</th>
                      <th className="text-left p-4 font-medium text-sm">Kehadiran</th>
                      <th className="text-left p-4 font-medium text-sm">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJournals.map((journal) => (
                      <tr key={journal.id} className="border-b hover:bg-muted/30">
                        <td className="p-4 text-sm">{formatDate(journal.date, 'dd MMM yyyy')}</td>
                        <td className="p-4 text-sm">{journal.class}</td>
                        <td className="p-4 text-sm">{journal.subject}</td>
                        <td className="p-4 text-sm max-w-xs truncate">{journal.material}</td>
                        <td className="p-4 text-sm max-w-xs truncate">{journal.topic}</td>
                        <td className="p-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs">{journal.attendance.present}/{journal.attendance.total}</span>
                            <Badge variant="outline" className="text-xs">
                              {((journal.attendance.present / journal.attendance.total) * 100).toFixed(0)}%
                            </Badge>
                          </div>
                        </td>
                        <td className="p-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewJournal(journal)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditJournal(journal)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteJournal(journal)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Journal Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Statistik Jurnal</span>
                </CardTitle>
                <CardDescription>
                  Ringkasan jurnal mengajar bulan ini
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {stats.totalJournals}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Jurnal Bulan Ini
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium">Siswa Hadir</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600 mt-1">
                        {stats.totalPresent}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium">Tingkat Kehadiran</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600 mt-1">
                        {stats.attendanceRate}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subject Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Distribusi Mata Pelajaran</span>
                </CardTitle>
                <CardDescription>
                  Jumlah jurnal per mata pelajaran
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subjects.slice(0, 5).map((subject) => {
                    const count = filteredJournals.filter(j => j.subject === subject).length;
                    const percentage = filteredJournals.length > 0 ? (count / filteredJournals.length) * 100 : 0;
                    
                    return (
                      <div key={subject} className="flex items-center space-x-4">
                        <div className="w-24 text-sm font-medium truncate">{subject}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-primary"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-8 text-right">
                              {count}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* View/Edit Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Jurnal Mengajar' : 'Detail Jurnal Mengajar'}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Perbarui data jurnal mengajar' : 'Lihat detail jurnal mengajar'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedJournal && (
            <div className="space-y-6">
              {isEditing ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-date">Tanggal</Label>
                      <Input
                        id="edit-date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-class">Kelas</Label>
                      <Select value={formData.class} onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.name}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-subject">Mata Pelajaran</Label>
                      <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-material">Materi Pembelajaran</Label>
                      <Input
                        id="edit-material"
                        value={formData.material}
                        onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-topic">Topik Pembelajaran</Label>
                      <Input
                        id="edit-topic"
                        value={formData.topic}
                        onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-method">Metode Mengajar</Label>
                      <Select value={formData.teachingMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, teachingMethod: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {teachingMethods.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-media">Media Pembelajaran</Label>
                      <Select value={formData.media} onValueChange={(value) => setFormData(prev => ({ ...prev, media: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {mediaOptions.map((media) => (
                            <SelectItem key={media} value={media}>
                              {media}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-evaluation">Evaluasi Pembelajaran</Label>
                    <Textarea
                      id="edit-evaluation"
                      value={formData.evaluation}
                      onChange={(e) => setFormData(prev => ({ ...prev, evaluation: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-notes">Catatan Tambahan</Label>
                    <Textarea
                      id="edit-notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button onClick={handleUpdateJournal} disabled={isSaving}>
                      {isSaving ? (
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Memperbarui...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Save className="h-4 w-4" />
                          <span>Perbarui Jurnal</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Tanggal</Label>
                      <p className="text-sm">{formatDate(selectedJournal.date, 'dd MMMM yyyy')}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Kelas</Label>
                      <p className="text-sm">{selectedJournal.class}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Mata Pelajaran</Label>
                      <p className="text-sm">{selectedJournal.subject}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Materi Pembelajaran</Label>
                    <p className="text-sm mt-1">{selectedJournal.material}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Topik Pembelajaran</Label>
                    <p className="text-sm mt-1">{selectedJournal.topic}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Metode Mengajar</Label>
                      <p className="text-sm mt-1">{selectedJournal.teachingMethod}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Media Pembelajaran</Label>
                      <p className="text-sm mt-1">{selectedJournal.media}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Absensi Siswa</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-medium text-green-600">{selectedJournal.attendance.present}</div>
                        <div className="text-xs text-green-600">Hadir</div>
                      </div>
                      <div className="text-center p-2 bg-yellow-50 rounded">
                        <div className="font-medium text-yellow-600">{selectedJournal.attendance.sick}</div>
                        <div className="text-xs text-yellow-600">Sakit</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-medium text-blue-600">{selectedJournal.attendance.permit}</div>
                        <div className="text-xs text-blue-600">Izin</div>
                      </div>
                      <div className="text-center p-2 bg-red-50 rounded">
                        <div className="font-medium text-red-600">{selectedJournal.attendance.absent}</div>
                        <div className="text-xs text-red-600">Alpa</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Evaluasi Pembelajaran</Label>
                    <p className="text-sm mt-1">{selectedJournal.evaluation}</p>
                  </div>

                  {selectedJournal.notes && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Catatan Tambahan</Label>
                      <p className="text-sm mt-1">{selectedJournal.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                      Tutup
                    </Button>
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Jurnal
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};