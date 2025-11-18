import { useState, useMemo } from 'react';

export const useAttendanceHistory = (attendanceRecords: any[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<any>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Get recent attendance records with search and date range filter
  const recentRecords = useMemo(() => {
    return attendanceRecords
      .filter(record => {
        const matchesSearch = !searchTerm || 
          record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.date.includes(searchTerm);
        
        const matchesDateRange = (!dateRange.from || record.date >= dateRange.from) &&
          (!dateRange.to || record.date <= dateRange.to);
        
        return matchesSearch && matchesDateRange;
      })
      .slice(0, 10);
  }, [attendanceRecords, searchTerm, dateRange]);

  const openHistoryModal = (record: any) => {
    setSelectedHistoryRecord(record);
    setShowHistoryModal(true);
  };

  const closeHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedHistoryRecord(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    recentRecords,
    selectedHistoryRecord,
    showHistoryModal,
    openHistoryModal,
    closeHistoryModal,
  };
};
