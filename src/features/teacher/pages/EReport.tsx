'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/app/context/RoleContext';
import { useTeacherData } from '../hooks/useTeacherData';
import type { EReport as EReportType } from '../types/teacher';
import { formatDate, formatTime, getRelativeTime } from '@/features/shared/utils/dateFormatter';
import { 
  FileText, 
  Download, 
  Upload, 
  Search, 
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  Users,
  BarChart3,
  TrendingUp,
  Target,
  FileCheck,
  Printer,
  Settings,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';

export const EReport: React.FC = () => {
  const { role, isHomeroomTeacher } = useRole();
  const {
    loading,
    error,
    ereports,
    fetchEReports,
    clearError,
  } = useTeacherData();

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedReport, setSelectedReport] = useState<EReportType | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchEReports();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchEReports();
      toast.success('Data E-Rapor berhasil diperbarui!');
    } catch (error) {
      toast.error('Gagal memperbarui data E-Rapor');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewReport = (report: EReportType) => {
    setSelectedReport(report);
    setIsViewDialogOpen(true);
  };

  const handleExportData = (format: 'excel' | 'pdf' | 'csv') => {
    toast.success(`Data E-Rapor berhasil diunduh dalam format ${format.toUpperCase()}!`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter E-Reports
  const filteredReports = ereports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || report.class === selectedClass;
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    const matchesType = selectedType === 'all' || report.type === selectedType;
    
    return matchesSearch && matchesClass && matchesStatus && matchesType;
  });

  // Get statistics
  const getEReportStats = () => {
    const total = ereports.length;
    const completed = ereports.filter(r => r.status === 'completed').length;
    const inProgress = ereports.filter(r => r.status === 'in_progress').length;
    const pending = ereports.filter(r => r.status === 'pending').length;
    const semester = ereports.filter(r => r.semester === 'Ganjil').length;
    const kenaikan = ereports.filter(r => r.type === 'kenaikan').length;
    const kelulusan = ereports.filter(r => r.type === 'kelulusan').length;
    
    return {
      total,
      completed,
      inProgress,
      pending,
      semester,
      kenaikan,
      kelulusan,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : '0',
    };
  };

  const stats = getEReportStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'in_progress':
        return 'Dalam Proses';
      case 'pending':
        return 'Menunggu';
      default:
        return 'Tidak Diketahui';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'semester':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'kenaikan':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'kelulusan':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'semester':
        return 'Semester';
      case 'kenaikan':
        return 'Kenaikan';
      case 'kelulusan':
        return 'Kelulusan';
      default:
        return 'Lainnya';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getProgressPercentage = (report: EReportType) => {
    if (report.studentCount === 0) return 0;
    return (report.completedCount / report.studentCount) * 100;
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

        {/* E-Report Cards Skeleton */}
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
          <h1 className="text-3xl font-bold text-foreground">E-Rapor</h1>
          <p className="text-muted-foreground">
            Kelola dan generate E-Rapor siswa secara digital
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
            <CardTitle className="text-sm font-medium">Total E-Rapor</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Total E-Rapor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selesai</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              E-Rapor selesai
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dalam Proses</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Sedang dikerjakan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Menunggu persetujuan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Daftar E-Rapor</TabsTrigger>
          <TabsTrigger value="statistics">Statistik</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileCheck className="h-5 w-5" />
                  <span>E-Rapor Terbaru</span>
                </CardTitle>
                <CardDescription>
                  E-Rapor yang baru dibuat atau diperbarui
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ereports.slice(0, 5).map((report) => (
                    <div
                      key={report.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleViewReport(report)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-sm line-clamp-1">
                              {report.title}
                            </h4>
                            <div className="flex items-center space-x-1">
                              <Badge className={getTypeColor(report.type)}>
                                {getTypeLabel(report.type)}
                              </Badge>
                              <Badge className={getStatusColor(report.status)}>
                                {getStatusLabel(report.status)}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {report.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{report.class}</span>
                            <span>{report.semester}</span>
                            <span>{report.academicYear}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {report.completedCount}/{report.studentCount}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Siswa selesai
                            </div>
                          </div>
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-green-500"
                              style={{ width: `${getProgressPercentage(report)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Ringkasan E-Rapor</span>
                </CardTitle>
                <CardDescription>
                  Status kelengkapan E-Rapor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {stats.completionRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tingkat Kelengkapan
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                      <div className="text-xs text-green-600">Selesai</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                      <div className="text-xs text-blue-600">Proses</div>
                    </div>
                    
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                      <div className="text-xs text-yellow-600">Menunggu</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Distribusi Jenis E-Rapor</span>
              </CardTitle>
              <CardDescription>
                Sebaran E-Rapor berdasarkan jenis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getTypeColor('semester')}`} />
                    <span className="text-sm font-medium">Semester</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold">{stats.semester}</span>
                    <span className="text-xs text-muted-foreground">
                      ({((stats.semester / stats.total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getTypeColor('kenaikan')}`} />
                    <span className="text-sm font-medium">Kenaikan</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold">{stats.kenaikan}</span>
                    <span className="text-xs text-muted-foreground">
                      ({((stats.kenaikan / stats.total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getTypeColor('kelulusan')}`} />
                    <span className="text-sm font-medium">Kelulusan</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold">{stats.kelulusan}</span>
                    <span className="text-xs text-muted-foreground">
                      ({((stats.kelulusan / stats.total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari E-Rapor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kelas</SelectItem>
                      <SelectItem value="XII IPA 1">XII IPA 1</SelectItem>
                      <SelectItem value="XI IPA 2">XI IPA 2</SelectItem>
                      <SelectItem value="X IPA 3">X IPA 3</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="completed">Selesai</SelectItem>
                      <SelectItem value="in_progress">Dalam Proses</SelectItem>
                      <SelectItem value="pending">Menunggu</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Filter jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Jenis</SelectItem>
                      <SelectItem value="semester">Semester</SelectItem>
                      <SelectItem value="kenaikan">Kenaikan</SelectItem>
                      <SelectItem value="kelulusan">Kelulusan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {filteredReports.length} dari {ereports.length} E-Rapor
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

          {/* E-Reports List */}
          {filteredReports.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Daftar E-Rapor</span>
                </CardTitle>
                <CardDescription>
                  Daftar E-Rapor yang tersedia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium text-sm">Judul</th>
                        <th className="text-left p-3 font-medium text-sm">Kelas</th>
                        <th className="text-left p-3 font-medium text-sm">Semester</th>
                        <th className="text-left p-3 font-medium text-sm">Tahun Ajaran</th>
                        <th className="text-left p-3 font-medium text-sm">Status</th>
                        <th className="text-left p-3 font-medium text-sm">Progress</th>
                        <th className="text-left p-3 font-medium text-sm">Deadline</th>
                        <th className="text-left p-3 font-medium text-sm">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.map((report) => (
                        <tr key={report.id} className="border-b hover:bg-muted/30">
                          <td className="p-3">
                            <div className="font-medium text-sm line-clamp-1">
                              {report.title}
                            </div>
                          </td>
                          <td className="p-3 text-sm">{report.class}</td>
                          <td className="p-3 text-sm">{report.semester}</td>
                          <td className="p-3 text-sm">{report.academicYear}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(report.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(report.status)}
                                <span className="text-xs">{getStatusLabel(report.status)}</span>
                              </div>
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div
                                  className="h-2 rounded-full bg-green-500"
                                  style={{ width: `${getProgressPercentage(report)}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium">
                                {report.completedCount}/{report.studentCount}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-sm">
                            {formatDate(report.dueDate, 'dd MMM yyyy')}
                          </td>
                          <td className="p-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewReport(report)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Belum Ada E-Rapor
                </h3>
                <p className="text-muted-foreground text-center max-w-md mb-4">
                  {searchTerm || selectedClass !== 'all' || selectedStatus !== 'all' || selectedType !== 'all'
                    ? 'Tidak ada E-Rapor yang cocok dengan filter yang dipilih.'
                    : 'Belum ada E-Rapor yang tersedia. Mulai dengan membuat E-Rapor baru.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Completion Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Overview Kelengkapan</span>
                </CardTitle>
                <CardDescription>
                  Status kelengkapan E-Rapor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {stats.completionRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tingkat Kelengkapan
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                      <div className="text-xs text-green-600">Selesai</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                      <div className="text-xs text-blue-600">Dalam Proses</div>
                    </div>
                    
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                      <div className="text-xs text-yellow-600">Menunggu</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Type Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Statistik Jenis E-Rapor</span>
                </CardTitle>
                <CardDescription>
                  Statistik berdasarkan jenis E-Rapor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getTypeColor('semester')}`} />
                      <span className="text-sm font-medium">Semester</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">{stats.semester}</span>
                      <span className="text-xs text-muted-foreground">
                        ({((stats.semester / stats.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getTypeColor('kenaikan')}`} />
                      <span className="text-sm font-medium">Kenaikan</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">{stats.kenaikan}</span>
                      <span className="text-xs text-muted-foreground">
                        ({((stats.kenaikan / stats.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getTypeColor('kelulusan')}`} />
                      <span className="text-sm font-medium">Kelulusan</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">{stats.kelulusan}</span>
                      <span className="text-xs text-muted-foreground">
                        ({((stats.kelulusan / stats.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Class Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Distribusi per Kelas</span>
                </CardTitle>
                <CardDescription>
                  Sebaran E-Rapor per kelas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['XII IPA 1', 'XI IPA 2', 'X IPA 3'].map((className) => {
                  const classReports = ereports.filter(r => r.class === className);
                  const totalStudents = classReports.reduce((sum, report) => sum + report.studentCount, 0);
                  const completedStudents = classReports.reduce((sum, report) => sum + report.completedCount, 0);
                  const completionRate = totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0;
                  
                  return (
                    <div key={className} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                          <span className="text-primary-foreground font-bold text-xs">
                            {className.split(' ')[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{className}</div>
                          <div className="text-xs text-muted-foreground">
                            {totalStudents} siswa
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{completedStudents}</div>
                          <div className="text-xs text-muted-foreground">
                            dari {totalStudents}
                          </div>
                        </div>
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {completionRate.toFixed(1)}% selesai
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Aktivitas Terbaru</span>
              </CardTitle>
              <CardDescription>
                Aktivitas E-Rapor terbaru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ereports.slice(0, 5).map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                      </div>
                      <div>
                        <div className="font-medium text-sm line-clamp-1">
                          {report.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {report.class} • {report.semester}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(report.status)}>
                        {getStatusLabel(report.status)}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">
                        {getRelativeTime(report.generatedDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail E-Rapor</DialogTitle>
            <DialogDescription>
              Lihat detail lengkap E-Rapor
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6">
              {/* Header Information */}
              <div className="bg-muted/30 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {selectedReport.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getTypeColor(selectedReport.type)}>
                        {getTypeLabel(selectedReport.type)}
                      </Badge>
                      <Badge className={getStatusColor(selectedReport.status)}>
                        {getStatusLabel(selectedReport.status)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(selectedReport.generatedDate, 'dd MMMM yyyy HH:mm')}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Informasi Umum</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Kelas:</span>
                      <span className="text-sm font-medium">{selectedReport.class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Semester:</span>
                      <span className="text-sm font-medium">{selectedReport.semester}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tahun Ajaran:</span>
                      <span className="text-sm font-medium">{selectedReport.academicYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Deadline:</span>
                      <span className="text-sm font-medium">
                        {formatDate(selectedReport.dueDate, 'dd MMMM yyyy')}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Statistik Siswa</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Siswa:</span>
                      <span className="text-sm font-medium">{selectedReport.studentCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Selesai:</span>
                      <span className="text-sm font-medium">{selectedReport.completedCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Progress:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{ width: `${getProgressPercentage(selectedReport)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {getProgressPercentage(selectedReport).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Deskripsi</h4>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedReport.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleExportData('pdf')}
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePrint()}
                    className="flex items-center space-x-2"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Cetak</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};