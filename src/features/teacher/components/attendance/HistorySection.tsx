'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import { generateRecordKey } from '../../utils/attendanceStorage';
import { AttendanceRecord } from '../../types/teacher';
import { TeacherClass } from '../../types/teacher';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileDown,
  Edit,
  Trash2,
  ArrowDownUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConfirmationModal } from './ConfirmationModal';
import { ACADEMIC_YEARS, SEMESTERS } from '../../constants/attendance';
import { PaginationControls } from '@/features/shared/components';

interface HistorySectionProps {
  // Filter controls
  selectedClass: string;
  setSelectedClass: (value: string) => void;
  selectedSubject: string;
  setSelectedSubject: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  dateRange: { from: string; to: string };
  setDateRange: (value: { from: string; to: string }) => void;
  setToday: () => void;
  setThisWeek: () => void;
  setThisMonth: () => void;
  activeDateFilter: 'today' | 'week' | 'month' | null;
  academicYear: string;
  setAcademicYear: (value: string) => void;
  semester: string;
  setSemester: (value: string) => void;
  recentRecords: AttendanceRecord[];
  totalRecordsCount: number;
  filterSummary: {
    total: number;
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
  };
  onViewDetails: (record: AttendanceRecord) => void;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  startIndex: number;
  endIndex: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  classes: TeacherClass[];
  subjects: string[];
  isLoading: boolean;
  onEditRecord: (record: AttendanceRecord) => void;
  onDeleteRecord: (record: AttendanceRecord) => void;
  onExportData: () => void;
}

const ATTENDANCE_STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'hadir', label: 'Hadir' },
  { value: 'sakit', label: 'Sakit' },
  { value: 'izin', label: 'Izin' },
  { value: 'tanpa-keterangan', label: 'Alpa' },
];

export const HistorySection: React.FC<HistorySectionProps> = ({
  selectedClass,
  setSelectedClass,
  selectedSubject,
  setSelectedSubject,
  selectedStatus,
  setSelectedStatus,
  searchTerm,
  setSearchTerm,
  dateRange,
  setDateRange,
  setToday,
  setThisWeek,
  setThisMonth,
  activeDateFilter,
  academicYear,
  setAcademicYear,
  semester,
  setSemester,
  recentRecords,
  totalRecordsCount,
  filterSummary,
  onViewDetails,
  currentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
  startIndex,
  endIndex,
  goToPage,
  nextPage,
  previousPage,
  classes,
  subjects,
  isLoading,
  onEditRecord,
  onDeleteRecord,
  onExportData,
}) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [recordToDelete, setRecordToDelete] = React.useState<AttendanceRecord | null>(null);

  const handleDeleteClick = (record: AttendanceRecord) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (recordToDelete) {
      onDeleteRecord(recordToDelete);
      setShowDeleteModal(false);
      setRecordToDelete(null);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  // Helper to get time range from lesson hour
  const getLessonTimeRange = (lessonHour: string) => {
    // Map of lesson hours to time ranges
    // Based on LESSON_HOURS constant:
    // 1: 07:00-07:45, 2: 07:45-08:30, 3: 08:30-09:15, 4: 09:15-10:00
    // 5: 10:15-11:00, 6: 11:00-11:45, 7: 12:00-12:45, 8: 12:45-13:30
    const timeMap: Record<string, string> = {
      '1': '07:00-07:45',
      '2': '07:45-08:30',
      '3': '08:30-09:15',
      '4': '09:15-10:00',
      '5': '10:15-11:00',
      '6': '11:00-11:45',
      '7': '12:00-12:45',
      '8': '12:45-13:30',
    };

    // Handle single hour (e.g., "1")
    if (timeMap[lessonHour]) {
      return `Jam ke-${lessonHour} (${timeMap[lessonHour]})`;
    }

    // Handle range (e.g., "1-2")
    if (lessonHour.includes('-')) {
      const [start, end] = lessonHour.split('-');
      const startTime = timeMap[start]?.split('-')[0];
      const endTime = timeMap[end]?.split('-')[1];

      if (startTime && endTime) {
        return `Jam ke-${lessonHour} (${startTime}-${endTime})`;
      }
    }

    // Fallback
    return `Jam ke-${lessonHour}`;
  };

  return (
    <>
      {/* Enhanced Filter Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Filter className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Filter Riwayat
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Sesuaikan tampilan riwayat berdasarkan kriteria
              </CardDescription>
            </div>
            <div className="ml-auto">
              <Button variant="outline" size="sm" onClick={onExportData} className="gap-2">
                <FileDown className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Row 1: Academic Year and Semester */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Tahun Ajaran</Label>
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger className="bg-white border-slate-200 shadow-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ACADEMIC_YEARS.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Semester</Label>
                <Select value={semester || 'all'} onValueChange={(v) => setSemester(v === 'all' ? '' : v)}>
                  <SelectTrigger className="bg-white border-slate-200 shadow-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Semester</SelectItem>
                    {SEMESTERS.map((sem) => <SelectItem key={sem} value={sem}>{sem}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Class, Subject, Status, Search */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Kelas</Label>
                <Select value={selectedClass || 'all'} onValueChange={(v) => setSelectedClass(v === 'all' ? '' : v)}>
                  <SelectTrigger className="bg-white border-slate-200 shadow-sm"><SelectValue placeholder="Semua Kelas" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelas</SelectItem>
                    {classes.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Mata Pelajaran</Label>
                <Select value={selectedSubject || 'all'} onValueChange={(v) => setSelectedSubject(v === 'all' ? '' : v)}>
                  <SelectTrigger className="bg-white border-slate-200 shadow-sm"><SelectValue placeholder="Semua Mapel" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                    {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Status</Label>
                <Select value={selectedStatus || 'all'} onValueChange={(v) => setSelectedStatus(v === 'all' ? '' : v)}>
                  <SelectTrigger className="bg-white border-slate-200 shadow-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ATTENDANCE_STATUS_OPTIONS.map((opt) => <SelectItem key={opt.value || 'all'} value={opt.value || 'all'}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Cari</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Nama siswa..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                </div>
              </div>
            </div>

            {/* Row 3: Date Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Filter Cepat</Label>
                <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/50">
                  {([
                    { key: 'today' as const, label: 'Hari Ini', fn: setToday },
                    { key: 'week' as const, label: 'Minggu Ini', fn: setThisWeek },
                    { key: 'month' as const, label: 'Bulan Ini', fn: setThisMonth },
                  ]).map(({ key, label, fn }, i) => (
                    <React.Fragment key={key}>
                      {i > 0 && <div className="w-px h-4 bg-border/50 mx-1" />}
                      <button onClick={fn} className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex-1",
                        activeDateFilter === key ? "bg-blue-800 text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}>{label}</button>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Rentang Tanggal</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="date" value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })} className="bg-white border-slate-200" />
                  <Input type="date" value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })} className="bg-white border-slate-200" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Riwayat Presensi
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Daftar catatan presensi yang telah direkam
                </CardDescription>
              </div>
            </div>

            {/* Filter Summary Badge */}
            {!isLoading && filterSummary.total > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-sm bg-muted/50 p-2 rounded-lg border">
                <span className="font-medium text-muted-foreground mr-1">
                  Total: {filterSummary.total}
                </span>
                <div className="h-4 w-px bg-border mx-1" />
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <CheckCircle className="h-3 w-3" /> {filterSummary.hadir}
                </span>
                <span className="flex items-center gap-1 text-yellow-600 font-medium ml-2">
                  <AlertCircle className="h-3 w-3" /> {filterSummary.sakit}
                </span>
                <span className="flex items-center gap-1 text-blue-600 font-medium ml-2">
                  <Clock className="h-3 w-3" /> {filterSummary.izin}
                </span>
                <span className="flex items-center gap-1 text-red-600 font-medium ml-2">
                  <XCircle className="h-3 w-3" /> {filterSummary.alpa}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Sorting Info */}
              <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                <ArrowDownUp className="h-4 w-4" />
                <span>Data yang tertampil diurutkan dari yang terbaru</span>
              </div>

              <div className="space-y-3">
                {recentRecords.length > 0 ? (
                  <>
                    {recentRecords.map((record) => (
                      <div key={generateRecordKey(record)} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
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
                              {record.class} • {record.subject} • {getLessonTimeRange(record.lessonHour)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <Badge
                              variant={
                                record.status === 'hadir' ? 'default' :
                                  record.status === 'sakit' ? 'secondary' :
                                    record.status === 'izin' ? 'outline' :
                                      'destructive'
                              }
                              className={
                                record.status === 'hadir' ? 'bg-green-500 hover:bg-green-600 text-white' :
                                  record.status === 'sakit' ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500' :
                                    record.status === 'izin' ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500' :
                                      'bg-red-500 hover:bg-red-600 text-white'
                              }
                            >
                              {record.status === 'tanpa-keterangan' ? 'Alpa' :
                                record.status === 'hadir' ? 'Hadir' :
                                  record.status === 'sakit' ? 'Sakit' :
                                    'Izin'}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(record.date, 'dd MMM yyyy')}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => onViewDetails(record)}
                              className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => onEditRecord(record)}
                              className="h-8 w-8 p-0 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteClick(record)}
                              className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalRecordsCount}
                        startIndex={totalRecordsCount > 0 ? startIndex : 0}
                        endIndex={endIndex}
                        itemsPerPage={itemsPerPage}
                        itemLabel="data"
                        onPageChange={goToPage}
                        onItemsPerPageChange={setItemsPerPage}
                      />
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Tidak ada riwayat presensi yang sesuai dengan filter</p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Data Presensi"
        description="Apakah Anda yakin ingin menghapus data presensi ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        variant="destructive"
        isLoading={isLoading}
        record={recordToDelete || undefined}
      />
    </>
  );
};
