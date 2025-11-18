'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeacherData } from '../hooks/useTeacherData';
import { useAttendanceData } from '../hooks/useAttendanceData';
import { useAttendanceStatistics } from '../hooks/useAttendanceStatistics';
import { useAttendanceHistory } from '../hooks/useAttendanceHistory';
import { 
  AttendanceTable,
  FilterSection,
  StatisticSection,
  HistorySection,
  MonthlyRecap,
  ModalDetailPresensi,
  StatsCards
} from '../components/attendance';
import { SUBJECTS, LESSON_HOURS } from '../constants/attendance';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import { 
  Users, 
  RefreshCw,
  Printer
} from 'lucide-react';
import { toast } from 'sonner';

export const Attendance: React.FC = () => {
  const { loading, error, classes, clearError } = useTeacherData();

  const [selectedClass, setSelectedClass] = useState('');
  // Use static date to avoid hydration errors (matches mock data)
  const [selectedDate, setSelectedDate] = useState('2025-11-10');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLessonHour, setSelectedLessonHour] = useState('');
  const [activeTab, setActiveTab] = useState('attendance');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Custom hooks for data management
  const {
    students,
    attendanceRecords,
    isSaved,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    handleSaveAttendance,
    handleMarkAllPresent,
  } = useAttendanceData(selectedClass, selectedDate);

  const selectedClassData = classes.find(c => c.id === selectedClass);
  const filteredStudents = selectedClass ? students.filter(s => s.class === selectedClassData?.name) : [];

  const { stats, attendanceTrend, previousDayChange } = useAttendanceStatistics(
    attendanceRecords,
    filteredStudents,
    selectedDate
  );

  const {
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    recentRecords,
    selectedHistoryRecord,
    showHistoryModal,
    openHistoryModal,
    closeHistoryModal,
  } = useAttendanceHistory(attendanceRecords);

  // Mock lesson hours
  const subjects = [...SUBJECTS];
  const lessonHours = [...LESSON_HOURS];

  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].id);
    }
  }, [classes, selectedClass]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh will be handled automatically by the custom hook
      toast.success('Data berhasil diperbarui!');
    } catch (error) {
      toast.error('Gagal memperbarui data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportData = (format: 'excel' | 'pdf') => {
    toast.success(`Data absensi berhasil diunduh dalam format ${format.toUpperCase()}!`);
  };

  const handleTabChange = (newTab: string) => {
    if (hasUnsavedChanges && activeTab === 'attendance') {
      toast.warning('⚠️ Anda memiliki perubahan yang belum disimpan!');
    }
    setActiveTab(newTab);
  };

  const handleFilterChange = () => {
    if (hasUnsavedChanges) {
      toast.warning('⚠️ Filter berubah. Pastikan menyimpan data sebelumnya!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Check if attendance is already marked
  const isAttendanceMarked = attendanceRecords.some(
    record => record.date === selectedDate && 
    record.class === selectedClassData?.name && 
    record.subject === selectedSubject
  );

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
      <StatsCards stats={stats} selectedClassName={selectedClassData?.name} />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attendance">Presensi</TabsTrigger>
          <TabsTrigger value="statistics">Statistik</TabsTrigger>
          <TabsTrigger value="history">Riwayat</TabsTrigger>
          <TabsTrigger value="monthly">Rekap Bulanan</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-6">
          <FilterSection
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            selectedLessonHour={selectedLessonHour}
            setSelectedLessonHour={setSelectedLessonHour}
            classes={classes}
            subjects={subjects}
            lessonHours={lessonHours}
            filteredStudents={filteredStudents}
            selectedClassData={selectedClassData}
            isAttendanceMarked={isAttendanceMarked}
            isSaved={isSaved}
            hasUnsavedChanges={hasUnsavedChanges}
            onFilterChange={handleFilterChange}
            onMarkAllPresent={() => handleMarkAllPresent(filteredStudents, selectedClassData, selectedSubject)}
            onExportData={handleExportData}
          />

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
          <StatisticSection
            stats={stats}
            attendanceTrend={attendanceTrend}
            previousDayChange={previousDayChange}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <HistorySection
            recentRecords={recentRecords}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onViewDetails={openHistoryModal}
          />
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <MonthlyRecap
            selectedClassData={selectedClassData}
            stats={stats}
          />
        </TabsContent>
      </Tabs>

      {/* History Detail Modal */}
      <ModalDetailPresensi
        isOpen={showHistoryModal}
        record={selectedHistoryRecord}
        onClose={closeHistoryModal}
      />
    </div>
  );
};