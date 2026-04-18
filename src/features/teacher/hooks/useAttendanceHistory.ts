 
import { useState, useMemo, useEffect } from 'react';
import { getAllAttendanceRecords, updateAttendanceRecord, deleteAttendanceRecord } from '../utils/attendanceStorage';
import { AttendanceRecord } from '../types/teacher';
import { ACADEMIC_YEARS, SEMESTERS } from '../constants/attendance';
import { toast } from 'sonner';

export const useAttendanceHistory = () => {
  // Load all records from teacherApi
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter states
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [academicYear, setAcademicYear] = useState<string>(ACADEMIC_YEARS[0]);
  const [semester, setSemester] = useState<string>(SEMESTERS[0]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal state
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<AttendanceRecord | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Load records from teacherApi on mount
  useEffect(() => {
    const loadRecords = async () => {
      setIsLoading(true);
      try {
        const records = await getAllAttendanceRecords();
        setAllRecords(records);
      } catch (error) {
        console.error('Failed to load attendance records:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRecords();
  }, []);

  // Refresh function to reload from teacherApi
  const refresh = async () => {
    setIsLoading(true);
    try {
      const records = await getAllAttendanceRecords();
      setAllRecords(records);
    } catch (error) {
      console.error('Failed to refresh attendance records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get filtered and sorted records
  const filteredRecords = useMemo(() => {
    return allRecords
      .filter(record => {
        // Filter by class
        const matchesClass = !selectedClass || record.class === selectedClass;

        // Filter by subject
        const matchesSubject = !selectedSubject || record.subject === selectedSubject;

        // Filter by status
        const matchesStatus = !selectedStatus || record.status === selectedStatus;

        // Filter by search term (student name or date)
        const matchesSearch = !searchTerm ||
          record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.date.includes(searchTerm);

        // Filter by date range
        const matchesDateRange = (!dateRange.from || record.date >= dateRange.from) &&
          (!dateRange.to || record.date <= dateRange.to);

        // Filter by academic period
        const matchesAcademicPeriod =
          (!academicYear || record.academicYear === academicYear) &&
          (!semester || record.semester === semester);

        return matchesClass && matchesSubject && matchesStatus && matchesSearch && matchesDateRange && matchesAcademicPeriod;
      })
      .sort((a, b) => {
        // Sort by date descending (newest first)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [allRecords, selectedClass, selectedSubject, selectedStatus, searchTerm, dateRange, academicYear, semester]);

  // Calculate pagination values
  const totalRecordsCount = filteredRecords.length;
  const totalPages = Math.ceil(totalRecordsCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get records to display for current page
  const recentRecords = useMemo(() => {
    return filteredRecords.slice(startIndex, endIndex);
  }, [filteredRecords, startIndex, endIndex]);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClass, selectedSubject, selectedStatus, searchTerm, dateRange, academicYear, semester, itemsPerPage]);

  // Validate date range
  useEffect(() => {
    if (dateRange.from && dateRange.to && dateRange.from > dateRange.to) {
      toast.error('Tanggal awal tidak boleh lebih besar dari tanggal akhir');
      setDateRange(prev => ({ ...prev, to: prev.from }));
    }
  }, [dateRange]);

  const [isEditing, setIsEditing] = useState(false);

  const openHistoryModal = (record: AttendanceRecord, editMode = false) => {
    setSelectedHistoryRecord(record);
    setIsEditing(editMode);
    setShowHistoryModal(true);
  };

  const closeHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedHistoryRecord(null);
    setIsEditing(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedClass('');
    setSelectedSubject('');
    setSelectedStatus('');
    setSearchTerm('');
    setDateRange({ from: '', to: '' });
    setAcademicYear(ACADEMIC_YEARS[0]);
    setSemester(SEMESTERS[0]);
    setCurrentPage(1);
    setItemsPerPage(10);
  };

  // Update record
  const updateRecord = async (record: AttendanceRecord) => {
    setIsLoading(true);
    try {
      const success = await updateAttendanceRecord(record);
      if (success) {
        await refresh();
      }
      return success;
    } catch (error) {
      console.error('Failed to update record:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete record
  const deleteRecord = async (record: AttendanceRecord) => {
    setIsLoading(true);
    try {
      const success = await deleteAttendanceRecord(record);
      if (success) {
        await refresh();
      }
      return success;
    } catch (error) {
      console.error('Failed to delete record:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Tanggal', 'Jam Pelajaran', 'Kelas', 'Mata Pelajaran', 'Nama Siswa', 'Status', 'Catatan', 'Guru'];
    const csvContent = [
      headers.join(','),
      ...filteredRecords.map(record => [
        record.date,
        `"Jam ke-${record.lessonHour}"`,
        `"${record.class}"`,
        `"${record.subject}"`,
        `"${record.studentName}"`,
        record.status,
        `"${record.notes || ''}"`,
        `"${record.teacher}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `riwayat_presensi_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate summary stats from filtered records
  const filterSummary = useMemo(() => {
    return filteredRecords.reduce(
      (acc, record) => {
        acc.total++;
        if (record.status === 'hadir') acc.hadir++;
        else if (record.status === 'sakit') acc.sakit++;
        else if (record.status === 'izin') acc.izin++;
        else if (record.status === 'tanpa-keterangan') acc.alpa++;
        return acc;
      },
      { total: 0, hadir: 0, sakit: 0, izin: 0, alpa: 0 }
    );
  }, [filteredRecords]);

  // Calculate active date filter
  const activeDateFilter = useMemo((): 'today' | 'week' | 'month' | null => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Today
    if (dateRange.from === todayStr && dateRange.to === todayStr) {
      return 'today';
    }

    // This Week
    const day = today.getDay() || 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - day + 1);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const weekStart = monday.toISOString().split('T')[0];
    const weekEnd = sunday.toISOString().split('T')[0];

    if (dateRange.from === weekStart && dateRange.to === weekEnd) {
      return 'week';
    }

    // This Month
    const firstDayMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDayMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

    if (dateRange.from === firstDayMonth && dateRange.to === lastDayMonth) {
      return 'month';
    }

    return null;
  }, [dateRange]);

  return {
    // Filter states
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
    academicYear,
    setAcademicYear,
    semester,
    setSemester,

    // Quick Filters
    setToday: () => {
      const today = new Date().toISOString().split('T')[0];
      setDateRange({ from: today, to: today });
    },
    setThisWeek: () => {
      const today = new Date();
      const day = today.getDay() || 7; // Mon=1, ... Sun=7
      const monday = new Date(today);
      monday.setDate(today.getDate() - day + 1);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      setDateRange({
        from: monday.toISOString().split('T')[0],
        to: sunday.toISOString().split('T')[0]
      });
    },
    setThisMonth: () => {
      const date = new Date();
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

      setDateRange({ from: firstDay, to: lastDay });
    },

    activeDateFilter,

    // Data
    recentRecords,
    totalRecordsCount,
    filterSummary,
    refresh,
    resetFilters,
    isLoading,
    updateRecord,
    deleteRecord,
    exportToCSV,

    // Pagination
    currentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    startIndex: startIndex + 1, // 1-indexed for display
    endIndex: Math.min(endIndex, totalRecordsCount), // Don't exceed total
    goToPage,
    nextPage,
    previousPage,

    // Modal
    selectedHistoryRecord,
    showHistoryModal,
    openHistoryModal,
    closeHistoryModal,
    isEditing,
  };
};
