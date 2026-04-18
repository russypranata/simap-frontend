'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Student, AttendanceRecord } from '../../types/teacher';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Save,
  Search,
  Eye,
  RefreshCw,
  Users,
  Calendar,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  PieChart,
  Percent
} from 'lucide-react';

interface AttendanceTableProps {
  students: Student[];
  selectedClass: string;
  selectedDate: string;
  selectedSubject: string;
  selectedLessonHour: string; // Added prop
  onSave: (attendanceData: {
    studentId: string;
    class: string;
    date: string;
    status: 'hadir' | 'sakit' | 'izin' | 'tanpa-keterangan';
    subject: string;
    notes?: string;
    lessonHour?: string; // Added optional field for saving
  }[]) => Promise<void>;
  existingRecords?: AttendanceRecord[];
  isLoading?: boolean;
  onUnsavedChanges?: (hasChanges: boolean) => void;
  hasUnsavedChanges?: boolean;
}

interface StudentAttendanceData {
  studentId: string;
  status: 'hadir' | 'sakit' | 'izin' | 'tanpa-keterangan';
  notes: string;
  previousRecord?: AttendanceRecord;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  students,
  selectedClass,
  selectedDate,
  selectedSubject,
  selectedLessonHour,
  onSave,
  existingRecords = [],
  isLoading = false,
  onUnsavedChanges,
  hasUnsavedChanges = false,
}) => {
  const [attendanceData, setAttendanceData] = useState<Record<string, StudentAttendanceData>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'hadir' | 'sakit' | 'izin' | 'tanpa-keterangan'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isSaving, setIsSaving] = useState(false);
  const [_isSaved, setIsSaved] = useState(false);
  // Removed internal hasUnsavedChanges state as it's now controlled by parent
  const [_selectedStudentHistory, setSelectedStudentHistory] = useState<Student | null>(null);
  const [_showHistory, setShowHistory] = useState(false);

  // Extract lesson hour code from display string (e.g., "Jam ke-1-2 (07:00-08:30)" -> "1-2")
  const lessonHourCode = useMemo(() => {
    const match = selectedLessonHour.match(/Jam ke-([0-9-]+)/);
    return match ? match[1] : '';
  }, [selectedLessonHour]);

  // Track the last initialized context to prevent unwanted resets
  const initializedContextRef = React.useRef<string>('');
  const currentContextKey = `${selectedClass}-${selectedDate}-${selectedSubject}-${lessonHourCode}`;

  // Initialize attendance data with existing records or default values
  React.useEffect(() => {
    // Skip initialization if:
    // 1. We have unsaved changes (user is editing)
    // 2. AND the context (class/date/subject) hasn't changed
    // This prevents the parent's re-render (triggered by onUnsavedChanges) from resetting our local state
    if (hasUnsavedChanges && initializedContextRef.current === currentContextKey) {
      return;
    }

    const initialData: Record<string, StudentAttendanceData> = {};

    students.forEach(student => {
      const existingRecord = existingRecords.find(
        record => record.studentId === student.id &&
          record.date === selectedDate &&
          record.subject === selectedSubject &&
          (!lessonHourCode || record.lessonHour === lessonHourCode)
      );

      const previousRecord = existingRecords.find(
        record => record.studentId === student.id &&
          record.date !== selectedDate
      );

      initialData[student.id] = {
        studentId: student.id,
        status: existingRecord?.status || 'hadir',
        notes: existingRecord?.notes || '',
        previousRecord,
      };
    });

    setAttendanceData(initialData);
    initializedContextRef.current = currentContextKey;
  }, [students, existingRecords, selectedDate, selectedSubject, lessonHourCode, hasUnsavedChanges, currentContextKey]);

  // Reset save status when filters change
  React.useEffect(() => {
    setIsSaved(false);
    onUnsavedChanges?.(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass, selectedDate, selectedSubject, selectedLessonHour]);

  // Filter and paginate students
  const filteredStudents = useMemo(() => {
    const filtered = students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nis.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
        attendanceData[student.id]?.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return filtered;
  }, [students, searchTerm, statusFilter, attendanceData]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const handleStatusChange = (studentId: string, status: 'hadir' | 'sakit' | 'izin' | 'tanpa-keterangan') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
    onUnsavedChanges?.(true);
    setIsSaved(false);
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes,
      },
    }));
    onUnsavedChanges?.(true);
    setIsSaved(false);
  };

  const handleQuickStatusSet = (status: 'hadir' | 'sakit' | 'izin' | 'tanpa-keterangan') => {
    setAttendanceData(prev => {
      const updated: Record<string, StudentAttendanceData> = {};
      students.forEach(student => {
        updated[student.id] = {
          ...prev[student.id],
          status,
        };
      });
      return updated;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const attendanceArray = students.map(student => ({
        studentId: student.id,
        class: selectedClass,
        date: selectedDate,
        status: attendanceData[student.id]?.status || 'hadir',
        subject: selectedSubject,
        notes: attendanceData[student.id]?.notes || '',
        lessonHour: lessonHourCode,
      }));

      await onSave(attendanceArray);

      // Update save status
      setIsSaved(true);
      onUnsavedChanges?.(false);
    } catch (error) {
      console.error('Error saving attendance:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const _handleReset = () => {
    setAttendanceData(prev => {
      const updated: Record<string, StudentAttendanceData> = {};
      students.forEach(student => {
        updated[student.id] = {
          ...prev[student.id],
          status: 'hadir',
          notes: '',
        };
      });
      return updated;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hadir':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'sakit':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'izin':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'tanpa-keterangan':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      hadir: 'default',
      sakit: 'secondary',
      izin: 'outline',
      'tanpa-keterangan': 'destructive',
    };

    return (
      <Badge variant={variants[status] || 'outline'} className="flex items-center space-x-1">
        {getStatusIcon(status)}
        <span className="capitalize">
          {status === 'tanpa-keterangan' ? 'Alpa' : status}
        </span>
      </Badge>
    );
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      'hadir': 'Hadir',
      'sakit': 'Sakit',
      'izin': 'Izin',
      'tanpa-keterangan': 'Alpa',
      'all': 'Semua'
    };
    return labels[status] || status;
  };

  const getAttendanceStats = () => {
    const stats = {
      hadir: 0,
      sakit: 0,
      izin: 0,
      'tanpa-keterangan': 0,
    };

    Object.values(attendanceData).forEach(data => {
      stats[data.status as keyof typeof stats]++;
    });

    return stats;
  };

  const getAttendancePercentage = () => {
    const stats = getAttendanceStats();
    const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
    return total > 0 ? ((stats.hadir / total) * 100).toFixed(1) : '0';
  };

  const stats = getAttendanceStats();
  const attendancePercentage = getAttendancePercentage();

  const handleViewHistory = (student: Student) => {
    setSelectedStudentHistory(student);
    setShowHistory(true);
  };

  const getStudentHistory = (studentId: string) => {
    return existingRecords.filter(record => record.studentId === studentId);
  };

  return (
    <div className="space-y-6" >
      {/* Header with stats and actions */}
      < Card >
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-semibold text-gray-900">Presensi Siswa</h3>
                  <Badge variant="outline">{formatDate(selectedDate)}</Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  {selectedClass} • {selectedSubject}
                </p>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mt-2">
              {/* Quick Selection Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Pilih Semua:
                </span>

                <div className="flex flex-wrap items-center gap-1 p-1 bg-muted/40 rounded-lg border border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickStatusSet('hadir')}
                    className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50 font-medium"
                  >
                    <CheckCircle className="h-4 w-4 mr-1.5" />
                    Hadir
                  </Button>
                  <div className="w-px h-4 bg-border/50 mx-0.5" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickStatusSet('sakit')}
                    className="h-8 px-3 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 font-medium"
                  >
                    <AlertCircle className="h-4 w-4 mr-1.5" />
                    Sakit
                  </Button>
                  <div className="w-px h-4 bg-border/50 mx-0.5" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickStatusSet('izin')}
                    className="h-8 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium"
                  >
                    <Clock className="h-4 w-4 mr-1.5" />
                    Izin
                  </Button>
                  <div className="w-px h-4 bg-border/50 mx-0.5" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickStatusSet('tanpa-keterangan')}
                    className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 font-medium"
                  >
                    <XCircle className="h-4 w-4 mr-1.5" />
                    Alpa
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{stats.hadir}</div>
              <div className="text-sm text-green-600">Hadir</div>
              <div className="text-xs text-green-500 mt-1">{((stats.hadir / students.length) * 100).toFixed(1)}%</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">{stats.sakit}</div>
              <div className="text-sm text-yellow-600">Sakit</div>
              <div className="text-xs text-yellow-500 mt-1">{((stats.sakit / students.length) * 100).toFixed(1)}%</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{stats.izin}</div>
              <div className="text-sm text-blue-600">Izin</div>
              <div className="text-xs text-blue-500 mt-1">{((stats.izin / students.length) * 100).toFixed(1)}%</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">{stats['tanpa-keterangan']}</div>
              <div className="text-sm text-red-600">Alpa</div>
              <div className="text-xs text-red-500 mt-1">{((stats['tanpa-keterangan'] / students.length) * 100).toFixed(1)}%</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{attendancePercentage}%</div>
              <div className="text-sm text-purple-600">Kehadiran</div>
              <div className="text-xs text-purple-500 mt-1">Total {students.length} siswa</div>
            </div>
          </div>
        </CardContent>
      </Card >

      {/* Filters and Search */}
      < Card >
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau NIS siswa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    title="Clear search"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="status-filter" className="text-sm whitespace-nowrap">
                Filter Status:
              </Label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'hadir' | 'sakit' | 'izin' | 'tanpa-keterangan')}>
                <SelectTrigger className="w-32 bg-white border-slate-200 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="hadir">Hadir</SelectItem>
                  <SelectItem value="sakit">Sakit</SelectItem>
                  <SelectItem value="izin">Izin</SelectItem>
                  <SelectItem value="tanpa-keterangan">Alpa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="items-per-page" className="text-sm whitespace-nowrap">
                Tampilkan:
              </Label>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
                <SelectTrigger className="w-20 bg-white border-slate-200 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Menampilkan {paginatedStudents.length} dari {filteredStudents.length} siswa
              {searchTerm && ` (hasil pencarian: "${searchTerm}")`}
            </div>
          </div>
        </CardContent>
      </Card >



      {/* Attendance Table */}
      < Card >
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-12">No</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-24">NIS</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 min-w-48">Nama Siswa</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-32">Jenis Kelamin</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-40">Status Kehadiran</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 min-w-64">Catatan</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-24">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student, index) => {
                    const currentData = attendanceData[student.id];
                    const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;

                    return (
                      <tr
                        key={student.id}
                        className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${currentData?.status === 'tanpa-keterangan' ? 'bg-red-50/30' : ''}`}
                      >
                        <td className="p-4 text-sm font-medium">{globalIndex}</td>
                        <td className="p-4 text-sm font-mono">{student.nis}</td>
                        <td className="p-4">
                          <div>
                            <div className="text-sm font-medium">{student.name}</div>
                            <div className="text-xs text-muted-foreground">{student.class}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={student.gender === 'L' ? 'default' : 'secondary'} className="text-xs">
                            {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Select
                            value={currentData?.status || 'hadir'}
                            onValueChange={(value: string) => handleStatusChange(student.id, value as 'hadir' | 'sakit' | 'izin' | 'tanpa-keterangan')}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hadir">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span>Hadir</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="sakit">
                                <div className="flex items-center space-x-2">
                                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                                  <span>Sakit</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="izin">
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-blue-500" />
                                  <span>Izin</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="tanpa-keterangan">
                                <div className="flex items-center space-x-2">
                                  <XCircle className="h-4 w-4 text-red-500" />
                                  <span>Alpa</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Input
                              placeholder="Catatan (opsional)"
                              value={currentData?.notes || ''}
                              onChange={(e) => handleNotesChange(student.id, e.target.value)}
                              className="flex-1 min-w-48"
                            />
                            {currentData?.previousRecord && (
                              <Badge variant="outline" className="text-xs whitespace-nowrap">
                                Ada catatan sebelumnya
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewHistory(student)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Riwayat Presensi - {student.name}</DialogTitle>
                                  <DialogDescription>
                                    Riwayat presensi siswa untuk mata pelajaran {selectedSubject}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                  {getStudentHistory(student.id).length > 0 ? (
                                    getStudentHistory(student.id).map((record, index) => (
                                      <div key={index} className="p-3 border rounded-lg">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-2">
                                            {getStatusBadge(record.status)}
                                            <span className="text-sm font-medium">
                                              {formatDate(record.date, 'dd MMMM yyyy')}
                                            </span>
                                          </div>
                                          <span className="text-xs text-muted-foreground">
                                            {record.subject}
                                          </span>
                                        </div>
                                        {record.notes && (
                                          <p className="text-sm text-muted-foreground mt-2">
                                            Catatan: {record.notes}
                                          </p>
                                        )}
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                      <p className="text-sm">Belum ada riwayat presensi</p>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="p-12">
                      <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="rounded-full bg-muted p-6">
                          <Search className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            Tidak Ada Data Ditemukan
                          </h3>
                          <p className="text-sm text-muted-foreground max-w-md">
                            {searchTerm ? (
                              <>
                                Tidak ada siswa yang cocok dengan pencarian <strong>&quot;{searchTerm}&quot;</strong>
                                {statusFilter !== 'all' && <> dan status <strong>{getStatusLabel(statusFilter)}</strong></>}.
                              </>
                            ) : statusFilter !== 'all' ? (
                              <>
                                Tidak ada siswa dengan status <strong>{getStatusLabel(statusFilter)}</strong>.
                              </>
                            ) : (
                              'Tidak ada data siswa yang tersedia untuk ditampilkan.'
                            )}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          {(searchTerm || statusFilter !== 'all') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                              }}
                              className="flex items-center gap-2"
                            >
                              <RefreshCw className="h-4 w-4" />
                              Reset Pencarian & Filter
                            </Button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Halaman {currentPage} dari {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Sebelumnya
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="text-sm text-muted-foreground">...</span>
                      <Button
                        variant={currentPage === totalPages ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-8 h-8 p-0"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Selanjutnya
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card >

      {/* Save Button - Between Table and Summary */}
      < div className="flex justify-end" >
        <Button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="px-6"
        >
          <Save className="h-4 w-4 mr-2" />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Presensi'}</span>
        </Button>
      </div >

      {/* Summary Card */}
      < Card >
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Ringkasan Presensi</h3>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Composition Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <PieChart className="h-4 w-4" />
                  <span>Komposisi Kehadiran</span>
                </div>
                <span className="font-medium">
                  {students.length} Siswa
                </span>
              </div>

              {/* Multi-colored Progress Bar */}
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden flex">
                {/* Hadir - Green */}
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${(Object.values(attendanceData).filter(d => d.status === 'hadir').length / students.length) * 100}%` }}
                />
                {/* Sakit - Yellow */}
                <div
                  className="h-full bg-yellow-500 transition-all duration-500"
                  style={{ width: `${(Object.values(attendanceData).filter(d => d.status === 'sakit').length / students.length) * 100}%` }}
                />
                {/* Izin - Blue */}
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${(Object.values(attendanceData).filter(d => d.status === 'izin').length / students.length) * 100}%` }}
                />
                {/* Alpa - Red */}
                <div
                  className="h-full bg-red-500 transition-all duration-500"
                  style={{ width: `${(Object.values(attendanceData).filter(d => d.status === 'tanpa-keterangan').length / students.length) * 100}%` }}
                />
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Hadir: {Object.values(attendanceData).filter(d => d.status === 'hadir').length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>Sakit: {Object.values(attendanceData).filter(d => d.status === 'sakit').length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Izin: {Object.values(attendanceData).filter(d => d.status === 'izin').length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Alpa: {Object.values(attendanceData).filter(d => d.status === 'tanpa-keterangan').length}</span>
                </div>
              </div>
            </div>

            {/* Class Info */}
            <div className="space-y-2 text-sm border-l pl-6">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Kelas</span>
                </div>
                <span className="font-medium text-right">{selectedClass}</span>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>Mapel</span>
                </div>
                <span className="font-medium text-right truncate" title={selectedSubject}>{selectedSubject}</span>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Tanggal</span>
                </div>
                <span className="font-medium text-right">{formatDate(selectedDate, 'dd MMM yyyy')}</span>
              </div>
            </div>

            {/* Status Info */}
            <div className="space-y-2 text-sm border-l pl-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Save className="h-4 w-4" />
                  <span>Status Simpan</span>
                </div>
                <Badge
                  variant={hasUnsavedChanges ? "destructive" : (existingRecords.length > 0 ? "default" : "secondary")}
                  className="text-xs"
                >
                  {hasUnsavedChanges ? 'Perubahan Belum Disimpan' : (existingRecords.length > 0 ? 'Tersimpan' : 'Belum Disimpan')}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Percent className="h-4 w-4" />
                  <span>Kehadiran</span>
                </div>
                <span className="font-medium">
                  {((Object.values(attendanceData).filter(d => d.status === 'hadir').length / students.length) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card >
    </div >
  );
};
