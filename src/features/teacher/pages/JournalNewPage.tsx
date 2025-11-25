'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTeacherData } from '@/features/teacher/hooks/useTeacherData';
import { JournalForm } from '@/features/teacher/components/journal/JournalForm';
import { TeacherClass } from '@/features/teacher/types/teacher';
import { SUBJECTS } from '@/features/teacher/constants/attendance';
import { mockClasses } from '@/features/teacher/services/mockData';
import { ArrowLeft, Info } from 'lucide-react';
import { toast } from 'sonner';

// Define teaching methods and media options
const TEACHING_METHODS = [
  'Ceramah',
  'Diskusi',
  'Presentasi',
  'Demonstrasi',
  'Eksperimen',
  'Latihan Soal',
  'Tugas Kelompok',
  'Problem Solving',
  'Project Based Learning',
  'Cooperative Learning'
];

const MEDIA_OPTIONS = [
  'Papan tulis',
  'LCD',
  'Laptop',
  'Modul',
  'Video',
  'Alat peraga',
  'Whiteboard',
  'Handout',
  'E-learning',
  'Audio',
  'Gambar',
  'Diagram'
];

import { calculateAttendanceStats } from '@/features/teacher/utils/attendanceUtils';
import { teacherApi } from '@/features/teacher/services/teacherApi';

export const JournalNewPage: React.FC = () => {
  const router = useRouter();
  
  const {
    loading,
    error,
    classes,
    saveTeachingJournal,
    fetchAttendanceRecords,
  } = useTeacherData();
  
  const [isSaving, setIsSaving] = useState(false);
  const [localClasses, setLocalClasses] = useState<TeacherClass[]>(mockClasses);

  // Create fetchAttendanceData function
  const fetchAttendanceData = async (classId: string, date: string) => {
    try {
      // Fetch attendance records directly from API
      const records = await teacherApi.getAttendanceRecords(classId, date);
      
      // Calculate statistics
      return calculateAttendanceStats(records || []);
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
      return null;
    }
  };

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      await saveTeachingJournal(data);
      toast.success('Jurnal berhasil disimpan!');
      // Navigate back to journal page
      setTimeout(() => {
        router.push('/journal');
      }, 1500);
    } catch (error) {
      console.error('Failed to save journal:', error);
      toast.error('Gagal menyimpan jurnal');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to journal page
    router.push('/journal');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleCancel}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tambah Jurnal Mengajar</h1>
            <p className="text-muted-foreground">
              Isi data jurnal mengajar untuk mencatat kegiatan pembelajaran
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                Informasi Penting
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Pastikan semua informasi yang Anda masukkan akurat dan terkini. 
                Data jurnal mengajar akan digunakan untuk pelaporan dan evaluasi proses pembelajaran.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journal Form */}
      <Card>
        <CardContent className="p-6">
          <JournalForm
            classes={localClasses}
            subjects={[...SUBJECTS]}
            teachingMethods={TEACHING_METHODS}
            mediaOptions={MEDIA_OPTIONS}
            isSaving={isSaving}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>

      {/* Additional Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tips Pengisian Jurnal</CardTitle>
          <CardDescription>
            Ikuti tips berikut untuk mengisi jurnal mengajar dengan baik
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>Pastikan tanggal jurnal sesuai dengan tanggal pelaksanaan pembelajaran</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>Isi materi dan topik pembelajaran secara spesifik dan jelas</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>Pilih metode mengajar dan media pembelajaran yang sesuai dengan materi</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>Catat evaluasi pembelajaran untuk menilai pemahaman siswa</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};