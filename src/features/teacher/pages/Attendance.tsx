'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  ChevronDown,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

import { useSearchParams } from 'next/navigation';

export const Attendance: React.FC = () => {
  const { loading, error, classes, profile, schedule, clearError } = useTeacherData();
  const searchParams = useSearchParams();

  const [selectedClass, setSelectedClass] = useState('');
  // Use today's date as default (local timezone)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Format: YYYY-MM-DD in local timezone
  });
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

  // Independent state for Statistics Tab
  const [statsSelectedClass, setStatsSelectedClass] = useState(''); // Default to empty (Global)
  const [statsSelectedSubject, setStatsSelectedSubject] = useState(''); // Default to empty (All Subjects)

  // Calculate available subjects based on selected class for Statistics
  const statsAvailableSubjects = React.useMemo(() => {
    // If no class selected, return all teacher's subjects
    if (!statsSelectedClass) {
      return profile?.subjects || [];
    }

    // Find class name
    const className = classes.find(c => c.id === statsSelectedClass)?.name;
    if (!className) return [];

    // Filter schedule for this class to find subjects taught
    const classSchedules = schedule.filter(s => s.class === className);
    const uniqueSubjects = Array.from(new Set(classSchedules.map(s => s.subject)));

    return uniqueSubjects;
  }, [statsSelectedClass, classes, schedule, profile]);

  // Reset selected subject when class changes
  useEffect(() => {
    setStatsSelectedSubject('');
  }, [statsSelectedClass]);

  // Always use today for statistics trend
  const todayStr = new Date().toISOString().split('T')[0];

  // Fetch data specifically for Statistics tab
  const {
    students: statsStudents,
    attendanceRecords: rawStatsAttendanceRecords,
  } = useAttendanceData(statsSelectedClass, todayStr);

  // Filter records by subject if selected
  const statsAttendanceRecords = statsSelectedSubject
    ? rawStatsAttendanceRecords.filter(r => r.subject === statsSelectedSubject)
    : rawStatsAttendanceRecords;

  const statsClassData = classes.find(c => c.id === statsSelectedClass);
  // If class selected, filter students. If not (Global), use all fetched students.
  const statsFilteredStudents = statsSelectedClass
    ? statsStudents.filter(s => s.class === statsClassData?.name)
    : statsStudents;

  // Calculate statistics based on the independent stats data
  const { stats: statsTabStats, attendanceTrend: statsTabTrend, previousDayChange: statsTabChange } = useAttendanceStatistics(
    statsAttendanceRecords,
    statsFilteredStudents,
    todayStr
  );

  // Main tab data (kept for backward compatibility with existing code structure)
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

  // Calculate available subjects based on selected class, schedule AND selected date (day)
  const subjects = React.useMemo(() => {
    // If no class or date selected, fallback (though date usually has default)
    if (!selectedClass || !selectedDate) {
      return profile?.subjects || [...SUBJECTS];
    }

    // Find class name
    const className = classes.find(c => c.id === selectedClass)?.name;
    if (!className) return profile?.subjects || [...SUBJECTS];

    // Get day name from selected date
    const date = new Date(selectedDate);
    const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' });

    // Filter schedule for this class AND specific day
    const daySchedules = schedule.filter(s =>
      s.class === className &&
      s.day === dayName
    );

    // Get unique subjects
    const uniqueSubjects = Array.from(new Set(daySchedules.map(s => s.subject)));

    // If no subjects found for this specific day, return empty array 
    // (This is better than showing all subjects which leads to "No schedule" error)
    if (uniqueSubjects.length === 0) {
      return [];
    }

    return uniqueSubjects;
  }, [selectedClass, selectedDate, classes, schedule, profile]);

  // Reset selectedSubject and selectedLessonHour when class or date changes
  React.useEffect(() => {
    setSelectedSubject('');
    setSelectedLessonHour('');
  }, [selectedClass, selectedDate]);

  // Auto-select subject if only one available
  React.useEffect(() => {
    if (subjects.length === 1 && selectedSubject !== subjects[0]) {
      setSelectedSubject(subjects[0]);
    }
  }, [subjects]);

  // Reset selectedSubject if it's not in the available subjects list
  React.useEffect(() => {
    if (selectedSubject && subjects.length > 0 && !subjects.includes(selectedSubject)) {
      setSelectedSubject('');
    }
  }, [subjects, selectedSubject]);

  // Calculate available lesson hours based on schedule
  const lessonHours = React.useMemo(() => {
    if (!selectedDate || !selectedClass || !selectedSubject || !schedule.length) {
      return [];
    }

    const date = new Date(selectedDate);
    const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' });

    // Find class name from ID
    const className = classes.find(c => c.id === selectedClass)?.name;
    if (!className) return [];

    // Filter schedules
    const daySchedules = schedule.filter(s =>
      s.day === dayName &&
      s.class === className &&
      s.subject === selectedSubject
    );

    if (daySchedules.length === 0) return [];

    // Group consecutive schedules
    const sorted = [...daySchedules].sort((a, b) => a.time.localeCompare(b.time));
    const groups: { startTime: string; endTime: string; startLesson: number; endLesson: number }[] = [];

    let currentGroup: typeof daySchedules = [];

    // Helper to get lesson number from start time
    const getLessonNumber = (time: string): number => {
      const startTime = time.split(' - ')[0];
      const timeMap: Record<string, number> = {
        '07:00': 1, '07:45': 2, '08:30': 3, '09:15': 4,
        '10:15': 5, '11:00': 6, '11:45': 7,
        '13:00': 8, '13:45': 9
      };
      return timeMap[startTime] || 0;
    };

    sorted.forEach((current, index) => {
      if (currentGroup.length === 0) {
        currentGroup.push(current);
      } else {
        const lastInGroup = currentGroup[currentGroup.length - 1];
        const lastEndTime = lastInGroup.time.split(' - ')[1];
        const currentStartTime = current.time.split(' - ')[0];

        if (lastEndTime === currentStartTime &&
          current.class === lastInGroup.class &&
          current.subject === lastInGroup.subject) {
          currentGroup.push(current);
        } else {
          // Process group
          const first = currentGroup[0];
          const last = currentGroup[currentGroup.length - 1];
          groups.push({
            startTime: first.time.split(' - ')[0],
            endTime: last.time.split(' - ')[1],
            startLesson: getLessonNumber(first.time),
            endLesson: getLessonNumber(last.time)
          });
          currentGroup = [current];
        }
      }

      if (index === sorted.length - 1 && currentGroup.length > 0) {
        const first = currentGroup[0];
        const last = currentGroup[currentGroup.length - 1];
        groups.push({
          startTime: first.time.split(' - ')[0],
          endTime: last.time.split(' - ')[1],
          startLesson: getLessonNumber(first.time),
          endLesson: getLessonNumber(last.time)
        });
      }
    });

    return groups.map(g => {
      const lessonRange = g.startLesson === g.endLesson
        ? `${g.startLesson}`
        : `${g.startLesson}-${g.endLesson}`;
      return `Jam ke-${lessonRange} (${g.startTime}-${g.endTime})`;
    });
  }, [selectedDate, selectedClass, selectedSubject, schedule, classes]);

  // Auto-select lesson hour if only one available
  React.useEffect(() => {
    if (lessonHours.length === 1 && selectedLessonHour !== lessonHours[0]) {
      setSelectedLessonHour(lessonHours[0]);
    }
  }, [lessonHours]);

  // Reset selected lesson hour if not in available list
  useEffect(() => {
    if (selectedLessonHour && !lessonHours.includes(selectedLessonHour)) {
      if (lessonHours.length > 0) {
        setSelectedLessonHour(lessonHours[0]);
      } else {
        setSelectedLessonHour('');
      }
    } else if (!selectedLessonHour && lessonHours.length > 0) {
      setSelectedLessonHour(lessonHours[0]);
    }
  }, [lessonHours, selectedLessonHour]);

  // Extract URL params
  const classParam = searchParams.get('class');
  const subjectParam = searchParams.get('subject');

  // Auto-select class and subject from URL params
  useEffect(() => {
    if (classes.length > 0) {
      if (classParam) {
        // Find class by name since URL passes class name
        const foundClass = classes.find(c => c.name === classParam);
        if (foundClass && foundClass.id !== selectedClass) {
          setSelectedClass(foundClass.id);
        }
      }
      // Removed auto-select first class logic to ensure user explicitly selects a class

      if (subjectParam && subjectParam !== selectedSubject) {
        setSelectedSubject(subjectParam);
      }
    }
  }, [classes, classParam, subjectParam]);

  // Add refresh counter to force component re-render
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Reset all filters to initial state
      setSelectedClass('');
      setSelectedSubject('');
      setSelectedLessonHour('');

      // Set date to today (local timezone)
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayString = `${year}-${month}-${day}`;
      setSelectedDate(todayString);

      // Force re-render by incrementing refresh key
      setRefreshKey(prev => prev + 1);

      // Show success message
      toast.success('Halaman presensi telah di-refresh!');
    } catch (error) {
      toast.error('Gagal me-refresh halaman');
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500); // Small delay for better UX
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



  // Check if attendance is already marked
  const isAttendanceMarked = attendanceRecords.some(
    record => record.date === selectedDate &&
      record.class === selectedClassData?.name &&
      record.subject === selectedSubject &&
      (!selectedLessonHour || record.lessonHour === (selectedLessonHour.match(/Jam ke-([0-9-]+)/)?.[1] || ''))
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
        </div>
      </div>

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
            key={`filter-${refreshKey}`}
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
          {selectedClass && selectedDate && selectedSubject && selectedLessonHour && filteredStudents.length > 0 && (
            <AttendanceTable
              students={filteredStudents}
              selectedClass={selectedClassData?.name || ''}
              selectedDate={selectedDate}
              selectedSubject={selectedSubject}
              selectedLessonHour={selectedLessonHour}
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
          {/* Independent Filter for Statistics */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Filter className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-gray-900">
                    Filter Statistik
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground font-medium">
                    Sesuaikan tampilan statistik berdasarkan kelas dan mata pelajaran
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kelas</label>
                  <div className="relative">
                    <select
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background pl-3 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                      value={statsSelectedClass}
                      onChange={(e) => setStatsSelectedClass(e.target.value)}
                    >
                      <option value="">Semua Kelas</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.studentCount} Siswa)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mata Pelajaran</label>
                  <div className="relative">
                    <select
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background pl-3 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                      value={statsSelectedSubject}
                      onChange={(e) => setStatsSelectedSubject(e.target.value)}
                    >
                      <option value="">Semua Mata Pelajaran</option>
                      {statsAvailableSubjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Always show stats (Global or Class-specific) */}
          <>
            <StatsCards
              stats={statsTabStats}
              selectedClassName={statsSelectedClass ? statsClassData?.name : 'Semua Kelas'}
            />

            <StatisticSection
              stats={statsTabStats}
              attendanceTrend={statsTabTrend}
              previousDayChange={statsTabChange}
            />
          </>
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