import { useState, useEffect } from 'react';
import { useTeacherData } from './useTeacherData';
import { toast } from 'sonner';

export const useAttendanceData = (selectedClass: string, selectedDate: string) => {
  const {
    loading,
    error,
    students,
    attendanceRecords,
    fetchStudents,
    fetchAttendanceRecords,
    saveAttendance,
    clearError,
  } = useTeacherData();

  const [isSaved, setIsSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    // If selectedClass is provided, fetch specific data
    // If not provided, fetch ALL data (Global Mode)
    fetchStudents(selectedClass);
    fetchAttendanceRecords(selectedClass);
  }, [selectedClass]);

  const handleSaveAttendance = async (attendanceData: {
    studentId: string;
    class: string;
    date: string;
    status: 'hadir' | 'sakit' | 'izin' | 'tanpa-keterangan';
    subject: string;
    notes?: string;
    lessonHour?: string;
  }[]) => {
    try {
      await saveAttendance(attendanceData);
      setIsSaved(true);
      setHasUnsavedChanges(false);
      toast.success('Data presensi berhasil disimpan');
      // Refresh data
      if (selectedClass) {
        await fetchAttendanceRecords(selectedClass);
      }
    } catch (error) {
      toast.error('Gagal menyimpan data presensi');
    }
  };

  const handleMarkAllPresent = async (
    filteredStudents: any[],
    selectedClassData: any,
    selectedSubject: string
  ) => {
    if (!selectedClass || !selectedSubject || !selectedDate) {
      toast.error('Pilih kelas, mata pelajaran, dan tanggal terlebih dahulu');
      return;
    }

    const allPresentData = filteredStudents.map(student => ({
      studentId: student.id,
      class: selectedClassData?.name || '',
      date: selectedDate,
      status: 'hadir' as const,
      subject: selectedSubject,
      notes: 'Marked all present',
    }));

    await handleSaveAttendance(allPresentData);
  };

  return {
    loading,
    error,
    students,
    attendanceRecords,
    isSaved,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    handleSaveAttendance,
    handleMarkAllPresent,
    clearError,
  };
};
