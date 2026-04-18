/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeacherData } from '../hooks/useTeacherData';
import { useAttendanceData } from '../hooks/useAttendanceData';
import { useAttendanceStatistics } from '../hooks/useAttendanceStatistics';
import { useAttendanceHistory } from '../hooks/useAttendanceHistory';
import { useAttendanceStats } from '../hooks/useAttendanceStats';

import {
  AttendanceTable,
  FilterSection,
  StatisticSection,
  HistorySection,
  ModalDetailPresensi,
  StatsCards,
  EditAttendanceView,
  DuplicateConfirmModal,
  UnsavedChangesDialog,
  DailySummary
} from '../components/attendance';
import { SUBJECTS, ACADEMIC_YEARS, SEMESTERS } from '../constants/attendance';
import { getHolidayInfo } from '../constants/holidays';

import { PageHeader } from '@/features/shared/components';
import {
  Users,
  RefreshCw,
  ChevronDown,
  Filter,
  Save,
  AlertTriangle,
  Calendar,
  Clock,
    ClipboardCheck,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';


import { useSearchParams } from 'next/navigation';

interface AttendanceProps {
  isEmbedded?: boolean;
}

export const Attendance: React.FC<AttendanceProps> = ({ isEmbedded = false }) => {
  // const { toast } = useToast(); // Removed shadcn toast
  const router = useRouter();
  const {
    loading,
    classes,
    profile,
    schedule,
  } = useTeacherData();
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
  // State
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
    checkDuplicate,
    refresh: refreshAttendance,
  } = useAttendanceData(selectedClass, selectedDate);

  // Independent state for Statistics Tab
  const [statsSelectedClass, setStatsSelectedClass] = useState(''); // Default to empty (Global)
  const [statsSelectedSubject, setStatsSelectedSubject] = useState(''); // Default to empty (All Subjects)
  const [statsAcademicYear, setStatsAcademicYear] = useState<string>(ACADEMIC_YEARS[0]);
  const [statsSemester, setStatsSemester] = useState<string>('Genap'); // April 2026 = Semester Genap

  // Hook baru: fetch semua data attendance untuk statistik
  const {
    allRecords: statsAllRecords,
    classes: statsClasses,
    isLoading: statsLoading,
    isFetching: statsFetching,
    getSubjectsForClass,
    refresh: refreshStats,
  } = useAttendanceStats();

  // Subjects available for selected class in stats
  const statsAvailableSubjects = React.useMemo(() => {
    const subjects = getSubjectsForClass(statsSelectedClass).map(s => s.name);
    return Array.from(new Set(subjects)); // deduplicate
  }, [statsSelectedClass, getSubjectsForClass]);

  // Reset selected subject when class changes
  useEffect(() => {
    setStatsSelectedSubject('');
  }, [statsSelectedClass]);

  // Auto-select class if only one is available (Statistics Tab)
  useEffect(() => {
    if (statsClasses.length === 1 && !statsSelectedClass) {
      setStatsSelectedClass(statsClasses[0].id);
    }
  }, [statsClasses, statsSelectedClass]);

  // Auto-select subject if only one is available (Statistics Tab)
  useEffect(() => {
    if (statsAvailableSubjects.length === 1 && !statsSelectedSubject) {
      setStatsSelectedSubject(statsAvailableSubjects[0]);
    }
  }, [statsAvailableSubjects, statsSelectedSubject]);

  const statsAttendanceRecords = React.useMemo(() => {
    return statsAllRecords.filter(r => {
      if (statsAcademicYear && r.academicYear !== statsAcademicYear) return false;
      if (statsSemester && r.semester !== statsSemester) return false;
      if (statsSelectedClass && r.classId !== statsSelectedClass) return false;
      if (statsSelectedSubject && r.subject !== statsSelectedSubject) return false;
      return true;
    });
  }, [statsAllRecords, statsAcademicYear, statsSemester, statsSelectedClass, statsSelectedSubject]);

  const statsTabStats = React.useMemo(() => {
    const records = statsAttendanceRecords;
    const uniqueStudents = new Set(records.map(r => r.studentId));
    const total = uniqueStudents.size;
    const totalRecords = records.length;
    const hadir = records.filter(r => r.status === 'hadir').length;
    const sakit = records.filter(r => r.status === 'sakit').length;
    const izin = records.filter(r => r.status === 'izin').length;
    const tanpaKeterangan = records.filter(r => r.status === 'tanpa-keterangan').length;
    const percentage = totalRecords > 0 ? ((hadir / totalRecords) * 100).toFixed(1) : '0.0';
    return { total, totalRecords, hadir, sakit, izin, tanpaKeterangan, percentage };
  }, [statsAttendanceRecords]);

  const statsTabTrend = React.useMemo(() => {
    const monthlyData: Record<string, { total: number; hadir: number; sakit: number; izin: number; tanpaKeterangan: number }> = {};
    statsAttendanceRecords.forEach(record => {
      const date = new Date(record.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[monthKey]) monthlyData[monthKey] = { total: 0, hadir: 0, sakit: 0, izin: 0, tanpaKeterangan: 0 };
      monthlyData[monthKey].total += 1;
      if (record.status === 'hadir') monthlyData[monthKey].hadir += 1;
      else if (record.status === 'sakit') monthlyData[monthKey].sakit += 1;
      else if (record.status === 'izin') monthlyData[monthKey].izin += 1;
      else if (record.status === 'tanpa-keterangan') monthlyData[monthKey].tanpaKeterangan += 1;
    });
    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const FULL_MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return Object.keys(monthlyData).sort().map(monthKey => {
      const [, month] = monthKey.split('-');
      const data = monthlyData[monthKey];
      const pct = (count: number) => data.total > 0 ? parseFloat(((count / data.total) * 100).toFixed(1)) : 0;
      return {
        name: MONTH_NAMES[parseInt(month) - 1],
        fullName: FULL_MONTH_NAMES[parseInt(month) - 1],
        percentage: pct(data.hadir),
        percentageSakit: pct(data.sakit),
        percentageIzin: pct(data.izin),
        percentageAlpha: pct(data.tanpaKeterangan),
        total: data.total, hadir: data.hadir, sakit: data.sakit, izin: data.izin, tanpaKeterangan: data.tanpaKeterangan,
      };
    });
  }, [statsAttendanceRecords]);

  const statsClassData = statsClasses.find(c => c.id === statsSelectedClass);
  const statsFilteredStudents = React.useMemo(() => {
    const uniqueStudents = new Map<string, { id: string; class: string }>();
    statsAttendanceRecords.forEach(r => {
      if (!uniqueStudents.has(r.studentId)) uniqueStudents.set(r.studentId, { id: r.studentId, class: r.class });
    });
    return Array.from(uniqueStudents.values());
  }, [statsAttendanceRecords]);

  // Main tab data (kept for backward compatibility with existing code structure)
  const selectedClassData = classes.find(c => c.id === selectedClass);
  const filteredStudents = selectedClass ? students.filter(s => s.class === selectedClassData?.name) : [];

  const { _stats, _attendanceTrend } = useAttendanceStatistics(
    attendanceRecords,
    filteredStudents,
    selectedDate
  );

  // History Tab - Independent data source from localStorage
  const {
    // Filter states
    selectedClass: historySelectedClass,
    setSelectedClass: setHistorySelectedClass,
    selectedSubject: historySelectedSubject,
    setSelectedSubject: setHistorySelectedSubject,
    selectedStatus: historySelectedStatus,
    setSelectedStatus: setHistorySelectedStatus,
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    academicYear: historyAcademicYear,
    setAcademicYear: setHistoryAcademicYear,
    semester: historySemester,
    setSemester: setHistorySemester,

    // Data
    recentRecords,
    totalRecordsCount,
    filterSummary,
    refresh: refreshHistory,
    resetFilters: resetHistoryFilters,
    setToday,
    setThisWeek,
    setThisMonth,
    activeDateFilter,

    // Pagination
    currentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,

    // Modal
    selectedHistoryRecord,
    showHistoryModal,
    openHistoryModal,
    closeHistoryModal,
    isLoading: isHistoryLoading,
    updateRecord,
    deleteRecord,
    exportToCSV,
      } = useAttendanceHistory(); // No parameters - loads independently from localStorage

  // State for Full Page Edit View
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);

  // State for Duplicate Confirmation Modal
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateRecord, setDuplicateRecord] = useState<any | null>(null);
  const [pendingAttendanceData, setPendingAttendanceData] = useState<any[] | null>(null);

  // State for Unsaved Changes Modal
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  const handleEditFromHistory = (record: any) => {
    setEditingRecord(record);
    setIsEditingPage(true);
  };

  const handleCancelEdit = () => {
    setIsEditingPage(false);
    setEditingRecord(null);
  };

  const handleSaveEdit = async (updatedRecord: any) => {
    const success = await updateRecord(updatedRecord);
    if (success) {
      setIsEditingPage(false);
      setEditingRecord(null);
    }
    return success;
  };

  // Duplicate Modal Handlers
  const handleDuplicateEdit = () => {
    if (duplicateRecord) {
      setShowDuplicateModal(false);
      handleEditFromHistory(duplicateRecord);
    }
  };

  const handleDuplicateOverwrite = async () => {
    if (pendingAttendanceData) {
      await handleSaveAttendance(pendingAttendanceData);
      await refreshHistory();
      setShowDuplicateModal(false);
      setPendingAttendanceData(null);
      setDuplicateRecord(null);
    }
  };

  const handleDuplicateCancel = () => {
    setShowDuplicateModal(false);
    setPendingAttendanceData(null);
    setDuplicateRecord(null);
  };

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



  // Holiday Validation
  const [holidayWarning, setHolidayWarning] = useState<{ isHoliday: boolean; name: string | null }>({ isHoliday: false, name: null });

  React.useEffect(() => {
    if (selectedDate) {
      const info = getHolidayInfo(selectedDate);
      setHolidayWarning(info);

      // Optional: Clear selection if holiday (or keep it to show warning)
      if (info.isHoliday) {
        setSelectedSubject('');
        setSelectedLessonHour('');
      }
    }
  }, [selectedDate]);

  // Warn user before leaving page with unsaved changes
  React.useEffect(() => {
    // Handle browser navigation (refresh, close tab, external links)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && activeTab === 'attendance') {
        e.preventDefault();
        e.returnValue = ''; // Chrome requires returnValue to be set
        return '';
      }
    };

    // Handle Next.js client-side navigation (navbar, internal links)


    window.addEventListener('beforeunload', handleBeforeUnload);

    // Note: Next.js App Router doesn't have router.events
    // We'll use a different approach with Link component interception

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, activeTab, router]);



  // Global Link Interceptor (Navbar & External Links)
  React.useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      if (hasUnsavedChanges && activeTab === 'attendance') {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a');

        // If clicked element is a link or inside a link
        if (anchor) {
          const href = anchor.getAttribute('href');
          // Ignore empty links, anchor links to same page id, or javascript:void
          if (!href || href.startsWith('#') || href.startsWith('javascript')) return;

          // Prevent default navigation
          e.preventDefault();
          e.stopPropagation();

          // Show custom modal instead of window.confirm
          setPendingUrl(href);
          setShowUnsavedModal(true);
        }
      }
    };

    // Use capture phase (true) to intercept before Next.js Link handles it
    window.addEventListener('click', handleAnchorClick, true);

    return () => {
      window.removeEventListener('click', handleAnchorClick, true);
    };
  }, [hasUnsavedChanges, activeTab, router]);

  // Auto-select subject if only one available
  React.useEffect(() => {
    if (subjects.length === 1 && selectedSubject !== subjects[0]) {
      setSelectedSubject(subjects[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

      // Reset Statistics Filters
      setStatsSelectedClass('');
      setStatsSelectedSubject('');
      setStatsAcademicYear(ACADEMIC_YEARS[0]);
      setStatsSemester(SEMESTERS[0]);

      // Reset History Filters
      resetHistoryFilters();

      // Trigger data refresh
      refreshAttendance();
      refreshStats();

      // Force re-render by incrementing refresh key
      setRefreshKey(prev => prev + 1);

      // Show success message
      toast.success('Halaman presensi telah di-refresh!');
    } catch {
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
    // Check if switching away from attendance tab with unsaved changes
    if (hasUnsavedChanges && activeTab === 'attendance') {
      setPendingTab(newTab);
      setShowUnsavedModal(true);
      return; // Block tab change
    }

    setActiveTab(newTab);
  };

  // Unsaved Changes Modal Handlers
  const handleUnsavedSave = async () => {
    // Get current attendance data from AttendanceTable
    // This will  const handleUnsavedSave = async () => {
    // In "Lanjutkan" mode (which is actually discard but proceed), we just reset flag and switch
    // The user explicitly chose "Lanjutkan" knowing data will be lost (as per modal text)
    setHasUnsavedChanges(false);
    setShowUnsavedModal(false);

    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }

    if (pendingUrl) {
      router.push(pendingUrl);
      setPendingUrl(null);
    }
  };

  const handleUnsavedDiscard = () => {
    // This is "Buang & Lanjutkan" button
    setHasUnsavedChanges(false);
    setShowUnsavedModal(false);

    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }

    if (pendingUrl) {
      router.push(pendingUrl);
      setPendingUrl(null);
    }
  };

  const handleUnsavedCancel = () => {
    setShowUnsavedModal(false);
    setPendingTab(null);
    setPendingUrl(null);
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
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header */}
        {!isEmbedded && (
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 bg-muted rounded-lg w-56 animate-pulse" />
              <div className="h-4 bg-muted rounded w-80 animate-pulse" />
            </div>
            <div className="h-9 bg-muted rounded-lg w-24 animate-pulse" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-muted/50 rounded-full p-1 w-fit">
          {['Presensi', 'Statistik', 'Riwayat'].map(t => (
            <div key={t} className="h-8 bg-muted rounded-full w-24 animate-pulse" />
          ))}
        </div>

        {/* DailySummary skeleton — matches the card with timeline layout */}
        <div className="rounded-xl border bg-card overflow-hidden animate-pulse">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-muted rounded-lg" />
              <div className="space-y-1.5">
                <div className="h-4 bg-muted rounded w-40" />
                <div className="h-3 bg-muted rounded w-28" />
              </div>
            </div>
            <div className="h-6 bg-muted rounded-full w-20" />
          </div>
          <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 items-start">
                {/* Time column */}
                <div className="flex flex-col items-center gap-1 w-14 flex-shrink-0">
                  <div className="h-3 bg-muted rounded w-10" />
                  <div className="h-3 bg-muted rounded w-8" />
                </div>
                {/* Card */}
                <div className="flex-1 rounded-lg border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-muted rounded w-32" />
                    <div className="h-5 bg-muted rounded-full w-20" />
                  </div>
                  <div className="h-3 bg-muted rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FilterSection skeleton — matches icon + title + 4 dropdowns */}
        <div className="rounded-xl border bg-card p-5 space-y-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-muted rounded-lg" />
            <div className="space-y-1.5">
              <div className="h-4 bg-muted rounded w-36" />
              <div className="h-3 bg-muted rounded w-52" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Kelas', 'Tanggal', 'Mata Pelajaran', 'Jam Pelajaran'].map(label => (
              <div key={label} className="space-y-1.5">
                <div className="h-3 bg-muted rounded w-24" />
                <div className="h-10 bg-muted rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Empty state hint */}
        <div className="rounded-xl border bg-card p-8 flex flex-col items-center gap-3 animate-pulse">
          <div className="h-12 w-12 bg-muted rounded-full" />
          <div className="h-4 bg-muted rounded w-48" />
          <div className="h-3 bg-muted rounded w-64" />
        </div>
      </div>
    );
  }



  if (isEditingPage && editingRecord) {
    return (
      <EditAttendanceView
        record={editingRecord}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        isLoading={isHistoryLoading}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Unsaved Changes Warning Banner */}
      {hasUnsavedChanges && activeTab === 'attendance' && (
        <div className="sticky top-0 z-50 animate-in slide-in-from-top">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  Anda memiliki perubahan yang belum disimpan
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Jangan lupa klik tombol &quot;Save&quot; di bawah sebelum meninggalkan halaman ini
                </p>
              </div>
              <div className="flex-shrink-0">
                <Save className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      {!isEmbedded ? (
        <PageHeader
          title="Presensi Mapel"
          titleHighlight="Siswa"
          icon={ClipboardCheck}
          description="Kelola presensi siswa untuk setiap mata pelajaran"
        >
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </PageHeader>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Presensi <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Siswa</span>
            </h2>
            <p className="text-muted-foreground text-sm">Kelola kehadiran siswa untuk setiap mata pelajaran</p>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="inline-flex h-auto items-center justify-center rounded-full bg-muted/50 p-1 gap-0.5">
          <TabsTrigger value="attendance" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
            <ClipboardCheck className="h-3.5 w-3.5 mr-1.5" />
            Presensi
          </TabsTrigger>
          <TabsTrigger value="statistics" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
            <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
            Statistik
          </TabsTrigger>
          <TabsTrigger value="history" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            Riwayat
          </TabsTrigger>
        </TabsList>


        <TabsContent value="attendance" className="space-y-6">
          {/* Daily Summary */}
          <DailySummary
            schedule={schedule}
            attendanceRecords={attendanceRecords}
            selectedDate={selectedDate}
            classes={classes}
            onFillFilter={(classId, subject, lessonHour) => {
              setSelectedClass(classId);
              setSelectedSubject(subject);
              setSelectedLessonHour(lessonHour);

              const className = classes.find(c => c.id === classId)?.name || classId;
              toast.success('Filter Diaktifkan', {
                description: `Filter diset untuk ${subject} - ${className}`,
                duration: 3000,
              });
            }}
          />

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
              hasUnsavedChanges={hasUnsavedChanges}
              onUnsavedChanges={setHasUnsavedChanges}

              onSave={async (data) => {
                // Check for duplicate before saving
                const lessonHourNumber = selectedLessonHour.match(/Jam ke-([0-9-]+)/)?.[1] || '';
                const { isDuplicate, existingRecord } = checkDuplicate(
                  selectedDate,
                  selectedClassData?.name || '',
                  selectedSubject,
                  lessonHourNumber
                );

                if (isDuplicate) {
                  // Show duplicate confirmation modal
                  setDuplicateRecord(existingRecord);
                  setPendingAttendanceData(data);
                  setShowDuplicateModal(true);
                  return;
                }

                // No duplicate, proceed with save
                await handleSaveAttendance(data);
                refreshHistory();
              }}
              existingRecords={attendanceRecords}
              isLoading={loading}

            />
          )}

          {/* Holiday Warning State */}
          {selectedDate && holidayWarning.isHoliday && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in duration-300">
              <div className="bg-red-100 p-4 rounded-full mb-6 ring-8 ring-red-50">
                <Calendar className="h-12 w-12 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {holidayWarning.name}
              </h3>
              <p className="text-gray-500 max-w-md mb-8 text-lg">
                <span className="text-sm mt-2 block text-gray-400">
                  Sistem presensi dinonaktifkan untuk tanggal ini. Silakan pilih tanggal lain untuk melakukan presensi.
                </span>
              </p>
            </div>
          )}

          {/* Empty State (Only show if NOT a holiday) */}
          {(!selectedClass || !selectedDate || !selectedSubject) && !holidayWarning.isHoliday && (
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

        <TabsContent value="statistics" className="space-y-6" key={`stats-${refreshKey}`}>
          {/* Independent Filter for Statistics */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Filter className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Filter Statistik
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Sesuaikan tampilan statistik berdasarkan kelas dan mata pelajaran
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tahun Ajaran</label>
                  <div className="relative">
                    <select
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background pl-3 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                      value={statsAcademicYear}
                      onChange={(e) => setStatsAcademicYear(e.target.value)}
                    >
                      {ACADEMIC_YEARS.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Semester</label>
                  <div className="relative">
                    <select
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background pl-3 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                      value={statsSemester}
                      onChange={(e) => setStatsSemester(e.target.value)}
                    >
                      <option value="">Semua Semester</option>
                      {SEMESTERS.map((sem) => (
                        <option key={sem} value={sem}>
                          {sem}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kelas</label>
                  <div className="relative">
                    {statsLoading ? (
                      <div className="h-10 bg-muted rounded-lg animate-pulse" />
                    ) : (
                    <select
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background pl-3 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                      value={statsSelectedClass}
                      onChange={(e) => setStatsSelectedClass(e.target.value)}
                    >
                      {statsClasses.length > 1 && <option value="">Semua Kelas</option>}
                      {statsClasses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}{c.studentCount > 0 ? ` (${c.studentCount} Siswa)` : ''}
                        </option>
                      ))}
                    </select>
                    )}
                    {!statsLoading && <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mata Pelajaran</label>
                  <div className="relative">
                    {statsLoading ? (
                      <div className="h-10 bg-muted rounded-lg animate-pulse" />
                    ) : (
                    <select
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background pl-3 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                      value={statsSelectedSubject}
                      onChange={(e) => setStatsSelectedSubject(e.target.value)}
                    >
                      {statsAvailableSubjects.length > 1 && <option value="">Semua Mata Pelajaran</option>}
                      {statsAvailableSubjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                    )}
                    {!statsLoading && <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Always show stats (Global or Class-specific) */}
          <>
            {statsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-xl border bg-card p-4 space-y-2 animate-pulse">
                    <div className="h-3 bg-muted rounded w-16" />
                    <div className="h-7 bg-muted rounded w-12" />
                    <div className="h-2 bg-muted rounded w-full" />
                  </div>
                ))}
              </div>
            ) : (
            <StatsCards
              stats={statsTabStats}
              selectedClassName={statsSelectedClass ? statsClassData?.name : undefined}
            />
            )}

            {statsLoading ? (
              <div className="rounded-xl border bg-card p-6 space-y-4 animate-pulse">
                <div className="h-5 bg-muted rounded w-48" />
                <div className="h-3 bg-muted rounded w-64" />
                <div className="h-[300px] bg-muted rounded-lg" />
              </div>
            ) : (
            <StatisticSection
              stats={statsTabStats}
              attendanceTrend={statsTabTrend}
              selectedClassName={statsSelectedClass ? statsClassData?.name : undefined}
              selectedSubjectName={statsSelectedSubject || undefined}
              attendanceRecords={statsAttendanceRecords}
              filteredStudents={statsFilteredStudents}
              academicYear={statsAcademicYear}
              semester={statsSemester}
            />
            )}
          </>
        </TabsContent>

        <TabsContent value="history" className="space-y-6" key={`history-${refreshKey}`}>
          <HistorySection
            selectedClass={historySelectedClass}
            setSelectedClass={setHistorySelectedClass}
            selectedSubject={historySelectedSubject}
            setSelectedSubject={setHistorySelectedSubject}
            selectedStatus={historySelectedStatus}
            setSelectedStatus={setHistorySelectedStatus}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateRange={dateRange}
            setDateRange={setDateRange}
            setToday={setToday}
            setThisWeek={setThisWeek}
            setThisMonth={setThisMonth}
            activeDateFilter={activeDateFilter}
            academicYear={historyAcademicYear}
            setAcademicYear={setHistoryAcademicYear}
            semester={historySemester}
            setSemester={setHistorySemester}
            recentRecords={recentRecords}
            totalRecordsCount={totalRecordsCount}
            filterSummary={filterSummary}
            onViewDetails={openHistoryModal}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            startIndex={startIndex}
            endIndex={endIndex}
            goToPage={goToPage}
            nextPage={nextPage}
            previousPage={previousPage}
            classes={classes}
            subjects={profile?.subjects || []}
            isLoading={isHistoryLoading}
            onEditRecord={handleEditFromHistory}
            onDeleteRecord={deleteRecord}
            onExportData={exportToCSV}
          />
        </TabsContent>



      </Tabs>

      {/* History Detail Modal */}
      <ModalDetailPresensi
        isOpen={showHistoryModal}
        record={selectedHistoryRecord}
        onClose={closeHistoryModal}
        onEdit={() => {
          if (selectedHistoryRecord) {
            closeHistoryModal();
            handleEditFromHistory(selectedHistoryRecord);
          }
        }}
      />

      {/* Duplicate Confirmation Modal */}
      <DuplicateConfirmModal
        isOpen={showDuplicateModal}
        existingRecord={duplicateRecord}
        onEdit={handleDuplicateEdit}
        onOverwrite={handleDuplicateOverwrite}
        onCancel={handleDuplicateCancel}
      />

      {/* Unsaved Changes Dialog */}
      <UnsavedChangesDialog
        isOpen={showUnsavedModal}
        onSave={handleUnsavedSave}
        onDiscard={handleUnsavedDiscard}
        onCancel={handleUnsavedCancel}
      />
    </div>
  );
};