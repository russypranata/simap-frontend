'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTeacherData } from '../hooks/useTeacherData';
import { AnnouncementList } from '../components/AnnouncementList';
import { Announcement } from '../types/teacher';
import { formatDate, formatTime, getRelativeTime } from '@/features/shared/utils/dateFormatter';
import { 
  Megaphone, 
  Plus, 
  Search, 
  Filter,
  RefreshCw,
  Download,
  Upload,
  FileText,
  Printer,
  Eye,
  Edit,
  Trash2,
  Bell,
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  TrendingUp,
  BarChart3,
  Target,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

export const Announcements: React.FC = () => {
  const {
    loading,
    error,
    announcements,
    fetchAnnouncements,
    clearError,
  } = useTeacherData();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general' as 'academic' | 'event' | 'general' | 'holiday',
    priority: 'medium' as 'high' | 'medium' | 'low',
    targetAudience: ['guru', 'siswa'] as ('guru' | 'siswa' | 'admin' | 'orang_tua')[],
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchAnnouncements();
      toast.success('Data pengumuman berhasil diperbarui!');
    } catch (error) {
      toast.error('Gagal memperbarui data pengumuman');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!formData.title || !formData.content) {
      toast.error('Mohon lengkapi judul dan konten pengumuman');
      return;
    }

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Pengumuman berhasil dibuat!');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      toast.error('Gagal membuat pengumuman');
    }
  };

  const handleUpdateAnnouncement = async () => {
    if (!selectedAnnouncement || !formData.title || !formData.content) {
      toast.error('Mohon lengkapi judul dan konten pengumuman');
      return;
    }

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Pengumuman berhasil diperbarui!');
      setIsViewDialogOpen(false);
      setIsEditing(false);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      toast.error('Gagal memperbarui pengumuman');
    }
  };

  const handleDeleteAnnouncement = async (announcement: Announcement) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) return;

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Pengumuman berhasil dihapus!');
      fetchAnnouncements();
    } catch (error) {
      toast.error('Gagal menghapus pengumuman');
    }
  };

  const handleViewAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsViewDialogOpen(true);
    setIsEditing(false);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      targetAudience: announcement.targetAudience,
    });
    setIsViewDialogOpen(true);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
    content: '',
    type: 'general',
    priority: 'medium',
    targetAudience: ['guru', 'siswa'],
  });
  };

  const handleExportData = (format: 'excel' | 'pdf' | 'csv') => {
    toast.success(`Data pengumuman berhasil diunduh dalam format ${format.toUpperCase()}!`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter announcements
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || announcement.type === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || announcement.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Get statistics
  const getAnnouncementStats = () => {
    const total = announcements.length;
    const academic = announcements.filter(a => a.type === 'academic').length;
    const event = announcements.filter(a => a.type === 'event').length;
    const general = announcements.filter(a => a.type === 'general').length;
    const high = announcements.filter(a => a.priority === 'high').length;
    const medium = announcements.filter(a => a.priority === 'medium').length;
    const low = announcements.filter(a => a.priority === 'low').length;
    
    // Get recent announcements (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recent = announcements.filter(a => a.timestamp >= sevenDaysAgo).length;

    return {
      total,
      academic,
      event,
      general,
      high,
      medium,
      low,
      recent,
    };
  };

  const stats = getAnnouncementStats();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'event':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'general':
        return <Info className="h-4 w-4 text-gray-500" />;
      default:
        return <Megaphone className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'event':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'general':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'academic':
        return 'Akademik';
      case 'event':
        return 'Acara';
      case 'general':
        return 'Umum';
      default:
        return 'Umum';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Penting';
      case 'medium':
        return 'Sedang';
      case 'low':
        return 'Biasa';
      default:
        return 'Biasa';
    }
  };

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

        {/* Announcement Cards Skeleton */}
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
          <h1 className="text-3xl font-bold text-foreground">Pengumuman</h1>
          <p className="text-muted-foreground">
            Kelola dan lihat pengumuman terkini dari sekolah
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Buat Pengumuman</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Buat Pengumuman Baru</DialogTitle>
                <DialogDescription>
                  Buat pengumuman baru untuk disebarkan ke seluruh warga sekolah
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Judul Pengumuman *</Label>
                    <Input
                      id="title"
                      placeholder="Masukkan judul pengumuman"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori *</Label>
                    <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Akademik</SelectItem>
                        <SelectItem value="event">Acara</SelectItem>
                        <SelectItem value="general">Umum</SelectItem>
                        <SelectItem value="holiday">Libur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Konten Pengumuman *</Label>
                  <Textarea
                    id="content"
                    placeholder="Masukkan konten pengumuman"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioritas</Label>
                    <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih prioritas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Penting</SelectItem>
                        <SelectItem value="medium">Sedang</SelectItem>
                        <SelectItem value="low">Biasa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="target">Target Audiens</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="guru"
                          checked={formData.targetAudience.includes('guru')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({ ...prev, targetAudience: [...prev.targetAudience, 'guru'] }));
                            } else {
                              setFormData(prev => ({ ...prev, targetAudience: prev.targetAudience.filter(a => a !== 'guru') }));
                            }
                          }}
                        />
                        <Label htmlFor="guru" className="text-sm">Guru</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="siswa"
                          checked={formData.targetAudience.includes('siswa')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({ ...prev, targetAudience: [...prev.targetAudience, 'siswa'] }));
                            } else {
                              setFormData(prev => ({ ...prev, targetAudience: prev.targetAudience.filter(a => a !== 'siswa') }));
                            }
                          }}
                        />
                        <Label htmlFor="siswa" className="text-sm">Siswa</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="admin"
                          checked={formData.targetAudience.includes('admin')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({ ...prev, targetAudience: [...prev.targetAudience, 'admin'] }));
                            } else {
                              setFormData(prev => ({ ...prev, targetAudience: prev.targetAudience.filter(a => a !== 'admin') }));
                            }
                          }}
                        />
                        <Label htmlFor="admin" className="text-sm">Administrator</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="orang_tua"
                          checked={formData.targetAudience.includes('orang_tua')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({ ...prev, targetAudience: [...prev.targetAudience, 'orang_tua'] }));
                            } else {
                              setFormData(prev => ({ ...prev, targetAudience: prev.targetAudience.filter(a => a !== 'orang_tua') }));
                            }
                          }}
                        />
                        <Label htmlFor="orang_tua" className="text-sm">Orang Tua</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleCreateAnnouncement}>
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Pengumuman
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center space-x-2"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengumuman</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Semua pengumuman
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengumuman Baru</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.recent}</div>
            <p className="text-xs text-muted-foreground">
              7 hari terakhir
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengumuman Penting</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.high}</div>
            <p className="text-xs text-muted-foreground">
              Prioritas tinggi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengumuman Akademik</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.academic}</div>
            <p className="text-xs text-muted-foreground">
              Kategori akademik
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Daftar Pengumuman</TabsTrigger>
          <TabsTrigger value="create">Buat Pengumuman</TabsTrigger>
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
                      placeholder="Cari pengumuman..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      <SelectItem value="academic">Akademik</SelectItem>
                      <SelectItem value="event">Acara</SelectItem>
                      <SelectItem value="general">Umum</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Filter prioritas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Prioritas</SelectItem>
                      <SelectItem value="high">Penting</SelectItem>
                      <SelectItem value="medium">Sedang</SelectItem>
                      <SelectItem value="low">Biasa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {filteredAnnouncements.length} dari {announcements.length} pengumuman
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

          {/* Announcements List */}
          {filteredAnnouncements.length > 0 ? (
            <AnnouncementList
              announcements={filteredAnnouncements}
              onView={handleViewAnnouncement}
              onEdit={handleEditAnnouncement}
              onDelete={handleDeleteAnnouncement}
              showActions={true}
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Megaphone className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Belum Ada Pengumuman
                </h3>
                <p className="text-muted-foreground text-center max-w-md mb-4">
                  {searchTerm || selectedCategory !== 'all' || selectedPriority !== 'all'
                    ? 'Tidak ada pengumuman yang cocok dengan filter yang dipilih.'
                    : 'Belum ada pengumuman yang dibuat. Mulai dengan membuat pengumuman baru.'}
                </p>
                <Button onClick={() => setActiveTab('create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Pengumuman
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Buat Pengumuman Baru</span>
              </CardTitle>
              <CardDescription>
                Buat pengumuman baru untuk disebarkan ke seluruh warga sekolah
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Megaphone className="h-16 w-16 text-muted-foreground mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Gunakan Tab "Daftar Pengumuman"
                </h3>
                <p className="text-muted-foreground text-center max-w-md mb-4">
                  Untuk membuat pengumuman baru, silakan kembali ke tab "Daftar Pengumuman" dan klik tombol "Buat Pengumuman".
                </p>
                <Button onClick={() => setActiveTab('list')}>
                  <Megaphone className="h-4 w-4 mr-2" />
                  Lihat Daftar Pengumuman
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Distribusi Kategori</span>
                </CardTitle>
                <CardDescription>
                  Sebaran pengumuman berdasarkan kategori
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Akademik</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">{stats.academic}</span>
                      <span className="text-xs text-muted-foreground">
                        ({((stats.academic / stats.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Acara</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">{stats.event}</span>
                      <span className="text-xs text-muted-foreground">
                        ({((stats.event / stats.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Umum</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">{stats.general}</span>
                      <span className="text-xs text-muted-foreground">
                        ({((stats.general / stats.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Distribusi Prioritas</span>
                </CardTitle>
                <CardDescription>
                  Sebaran pengumuman berdasarkan prioritas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium">Penting</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">{stats.high}</span>
                      <span className="text-xs text-muted-foreground">
                        ({((stats.high / stats.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium">Sedang</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">{stats.medium}</span>
                      <span className="text-xs text-muted-foreground">
                        ({((stats.medium / stats.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Biasa</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">{stats.low}</span>
                      <span className="text-xs text-muted-foreground">
                        ({((stats.low / stats.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Pengumuman Terbaru</span>
              </CardTitle>
              <CardDescription>
                Pengumuman yang dibuat dalam 7 hari terakhir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnnouncementList
                announcements={announcements.filter(a => {
                  const sevenDaysAgo = new Date();
                  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                  return a.timestamp >= sevenDaysAgo;
                })}
                maxItems={5}
                showActions={false}
                compact={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View/Edit Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Pengumuman' : 'Detail Pengumuman'}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Perbarui informasi pengumuman' : 'Lihat detail pengumuman'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAnnouncement && (
            <div className="space-y-6">
              {isEditing ? (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-title">Judul Pengumuman</Label>
                        <Input
                          id="edit-title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-category">Kategori</Label>
                        <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="academic">Akademik</SelectItem>
                            <SelectItem value="event">Acara</SelectItem>
                            <SelectItem value="general">Umum</SelectItem>
                            <SelectItem value="holiday">Libur</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-content">Konten</Label>
                      <Textarea
                        id="edit-content"
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        rows={6}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-priority">Prioritas</Label>
                        <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">Penting</SelectItem>
                            <SelectItem value="medium">Sedang</SelectItem>
                            <SelectItem value="low">Biasa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button onClick={handleUpdateAnnouncement}>
                      <Edit className="h-4 w-4 mr-2" />
                      Perbarui
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-2 rounded-lg ${getCategoryColor(selectedAnnouncement.type)}`}>
                      {getCategoryIcon(selectedAnnouncement.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedAnnouncement.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getPriorityColor(selectedAnnouncement.priority)}>
                          {getPriorityLabel(selectedAnnouncement.priority)}
                        </Badge>
                        <Badge className={getCategoryColor(selectedAnnouncement.type)}>
                          {getCategoryLabel(selectedAnnouncement.type)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedAnnouncement.content}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-muted-foreground">Pengirim</div>
                      <div className="text-foreground">{selectedAnnouncement.sender}</div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">Tanggal</div>
                      <div className="text-foreground">
                        {formatDate(selectedAnnouncement.timestamp, 'dd MMMM yyyy HH:mm')}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">Target Audiens</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedAnnouncement.targetAudience.map((audience) => (
                          <Badge key={audience} variant="outline" className="text-xs">
                            {audience === 'guru' ? 'Guru' : 
                             audience === 'siswa' ? 'Siswa' : 
                             audience === 'admin' ? 'Admin' : 'Orang Tua'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                      Tutup
                    </Button>
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
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