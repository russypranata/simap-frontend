'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useTeacherData } from '../hooks/useTeacherData';
import { AttendanceTable } from '../components/AttendanceTable';
import { formatDate, getDayName, getRelativeTime } from '@/features/shared/utils/dateFormatter';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  Download, 
  Upload,
  Filter,
  Search,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Settings,
  Printer
} from 'lucide-react';
import { toast } from 'sonner';

export const Attendance: React.FC = () => {
  const {
    loading,
    error,
    classes,
    students,
    attendanceRecords,
    fetchStudents,
    fetchAttendanceRecords,
    saveAttendance,
    clearError,
  } = useTeacherData();

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date(), 'yyyy-MM-dd'));
  const [selectedSubject, setSelectedSubject] = useState('');
  const [activeTab, setActiveTab] = useState('attendance');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock subjects based on teacher profile
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
    'Sosiologi'
  ];

  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].id);
    }
  }, [classes, selectedClass]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
      fetchAttendanceRecords(selectedClass, selectedDate);
    }
  }, [selectedClass, selectedDate]);

  const handleSaveAttendance = async (attendanceData: {
    studentId: string;
    class: string;
    date: string;
    status: 'hadir' | 'sakit' | 'izin' | 'tanpa-keterangan';
    subject: string;
    notes?: string;
  }[]) => {
    try {
      await saveAttendance(attendanceData);
      toast.success('Data absensi berhasil disimpan!');
    } catch (error) {
      toast.error('Gagal menyimpan data absensi');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (selectedClass) {
        await fetchStudents(selectedClass);
        await fetchAttendanceRecords(selectedClass, selectedDate);
      }
      toast.success('Data berhasil diperbarui!');
    } catch (error) {
      toast.error('Gagal memperbarui data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportData = (format: 'excel' | 'pdf' | 'csv') => {
    // Mock export functionality
    toast.success(`Data absensi berhasil diunduh dalam format ${format.toUpperCase()}!`);
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedClassData = classes.find(c => c.id === selectedClass);
  const filteredStudents = selectedClass ? students.filter(s => s.class === selectedClassData?.name) : [];

  // Calculate attendance statistics
  const getAttendanceStats = () => {
    const todayRecords = attendanceRecords.filter(record => record.date === selectedDate);
    const stats = {
      total: filteredStudents.length,
      hadir: todayRecords.filter(r => r.status === 'hadir').length,
      sakit: todayRecords.filter(r => r.status === 'sakit').length,
      izin: todayRecords.filter(r => r.status === 'izin').length,
      tanpaKeterangan: todayRecords.filter(r => r.status === 'tanpa-keterangan').length,
    };
    
    return {
      ...stats,
      percentage: stats.total > 0 ? ((stats.hadir / stats.total) * 100).toFixed(1) : '0',
    };
  };

  const stats = getAttendanceStats();

  // Get recent attendance records
  const recentRecords = attendanceRecords
    .filter(record => record.date === selectedDate)
    .slice(0, 5);

  // Get attendance trend (mock data)
  const attendanceTrend = [
    { date: 'Senin', hadir: 28, total: 32 },
    { date: 'Selasa', hadir: 30, total: 32 },
    { date: 'Rabu', hadir: 29, total: 32 },
    { date: 'Kamis', hadir: 31, total: 32 },
    { date: 'Jumat', hadir: 27, total: 32 },
  ];

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

        {/* Filter Skeleton */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-5 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Card className="animate-pulse">
          <CardContent className="p-4">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Presensi Siswa</h1>
          <p className="text-muted-foreground">
            Kelola presensi siswa untuk setiap mata pelajaran
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {selectedClassData?.name || 'Pilih kelas'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hadir</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.hadir}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.hadir / stats.total) * 100).toFixed(1)}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sakit</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.sakit}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.sakit / stats.total) * 100).toFixed(1)}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Izin</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.izin}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.izin / stats.total) * 100).toFixed(1)}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tanpa Keterangan</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.tanpaKeterangan}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.tanpaKeterangan / stats.total) * 100).toFixed(1)}% dari total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attendance">Presensi</TabsTrigger>
          <TabsTrigger value="statistics">Statistik</TabsTrigger>
          <TabsTrigger value="history">Riwayat</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filter Presensi</span>
              </CardTitle>
              <CardDescription>
                Pilih kelas, tanggal, dan mata pelajaran untuk mengelola presensi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class">Kelas</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name} ({cls.studentCount} siswa)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Tanggal</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={formatDate(new Date(), 'yyyy-MM-dd')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Mata Pelajaran</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
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

              {selectedClass && selectedDate && selectedSubject && (
                <div className="mt-4 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="text-sm text-muted-foreground">
                    Menampilkan {filteredStudents.length} siswa untuk kelas {selectedClassData?.name} pada {formatDate(selectedDate, 'dd MMMM yyyy')}
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
                      onClick={() => handleExportData('csv')}
                      className="flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Export CSV</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attendance Table */}
          {selectedClass && selectedDate && selectedSubject && filteredStudents.length > 0 && (
            <AttendanceTable
              students={filteredStudents}
              selectedClass={selectedClassData?.name || ''}
              selectedDate={selectedDate}
              selectedSubject={selectedSubject}
              onSave={handleSaveAttendance}
              existingRecords={attendanceRecords}
              isLoading={loading}
            />
          )}

          {/* Empty State */}
          {(!selectedClass || !selectedDate || !selectedSubject) && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Pilih Filter untuk Memulai
                </h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Silakan pilih kelas, tanggal, dan mata pelajaran untuk mulai mengelola presensi siswa.
                </p>
              </CardContent>
            </Card>
          )}

          {/* No Students State */}
          {selectedClass && selectedDate && selectedSubject && filteredStudents.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Tidak Ada Siswa
                </h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Tidak ada siswa yang ditemukan untuk kelas {selectedClassData?.name}.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Trend Kehadiran Mingguan</span>
                </CardTitle>
                <CardDescription>
                  Persentase kehadiran siswa minggu ini
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendanceTrend.map((day, index) => {
                    const percentage = (day.hadir / day.total) * 100;
                    return (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-16 text-sm font-medium">{day.date}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  percentage >= 90 ? 'bg-green-500' :
                                  percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground w-16 text-right">
                          {day.hadir}/{day.total}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Attendance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Ringkasan Presensi</span>
                </CardTitle>
                <CardDescription>
                  Statistik presensi hari ini
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {stats.percentage}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tingkat Kehadiran Hari Ini
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium">Hadir</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600 mt-1">
                        {stats.hadir}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <span className="text-sm font-medium">Tidak Hadir</span>
                      </div>
                      <div className="text-2xl font-bold text-red-600 mt-1">
                        {stats.sakit + stats.izin + stats.tanpaKeterangan}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Riwayat Presensi Terbaru</span>
              </CardTitle>
              <CardDescription>
                Daftar presensi yang telah dicatat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentRecords.length > 0 ? (
                  recentRecords.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-muted">
                          {record.status === 'hadir' && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {record.status === 'sakit' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                          {record.status === 'izin' && <Clock className="h-4 w-4 text-blue-500" />}
                          {record.status === 'tanpa-keterangan' && <XCircle className="h-4 w-4 text-red-500" />}
                        </div>
                        <div>
                          <p className="font-medium">{record.studentName}</p>
                          <p className="text-sm text-muted-foreground">
                            {record.class} • {record.subject}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          record.status === 'hadir' ? 'default' :
                          record.status === 'sakit' ? 'secondary' :
                          record.status === 'izin' ? 'outline' : 'destructive'
                        }>
                          {record.status === 'tanpa-keterangan' ? 'Tanpa Keterangan' : record.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {getRelativeTime(record.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Belum ada riwayat presensi</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};