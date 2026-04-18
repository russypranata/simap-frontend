/* eslint-disable @typescript-eslint/no-explicit-any , @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTeacherData } from '@/features/teacher/hooks/useTeacherData';
import { JournalForm } from '@/features/teacher/components/journal/JournalForm';
import { TeachingJournal, TeacherClass } from '@/features/teacher/types/teacher';
import { SUBJECTS } from '@/features/teacher/constants/attendance';
import { mockClasses } from '@/features/teacher/services/mockData';
import { FilePen, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { teacherApi } from '@/features/teacher/services/teacherApi';
import { calculateAttendanceStats } from '@/features/teacher/utils/attendanceUtils';
import { PageHeader } from '@/features/shared/components';

const TEACHING_METHODS = ['Ceramah','Diskusi','Presentasi','Demonstrasi','Eksperimen','Latihan Soal','Tugas Kelompok','Problem Solving','Project Based Learning','Cooperative Learning'];
const MEDIA_OPTIONS = ['Papan tulis','LCD','Laptop','Modul','Video','Alat peraga','Whiteboard','Handout','E-learning','Audio','Gambar','Diagram'];

interface JournalEditPageProps {
  journal: TeachingJournal;
}

export const JournalEditPage: React.FC<JournalEditPageProps> = ({ journal }) => {
  const router = useRouter();
  const { updateTeachingJournal } = useTeacherData();
  const [isSaving, setIsSaving] = useState(false);
  const [localClasses] = useState<TeacherClass[]>(mockClasses);

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      await updateTeachingJournal(journal.id, data);
      toast.success('Jurnal berhasil diperbarui!');
      setTimeout(() => router.push('/teacher/journal'), 1500);
    } catch {
      toast.error('Gagal memperbarui jurnal');
    } finally {
      setIsSaving(false);
    }
  };

  const initialData = {
    date: journal.date,
    class: journal.class,
    subject: journal.subject,
    lessonHour: journal.lessonHour,
    material: journal.material,
    learningObjective: journal.learningObjective || '',
    topic: journal.topic,
    teachingMethod: Array.isArray(journal.teachingMethod) ? journal.teachingMethod : journal.teachingMethod ? [journal.teachingMethod] : [],
    media: Array.isArray(journal.media) ? journal.media : journal.media ? [journal.media] : [],
    evaluation: journal.evaluation,
    notes: journal.notes,
    attendance: {
      total: journal.attendance.total,
      present: journal.attendance.present,
      sick: journal.attendance.sick,
      permit: journal.attendance.permit,
      absent: journal.attendance.absent,
    },
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Jurnal"
        titleHighlight="Mengajar"
        icon={FilePen}
        description="Perbarui data jurnal untuk mencatat kegiatan pembelajaran"
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <FilePen className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Edit Data Jurnal</CardTitle>
              <CardDescription>Perbarui informasi jurnal mengajar di bawah ini</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <JournalForm
            initialData={initialData}
            classes={localClasses}
            subjects={[...SUBJECTS]}
            teachingMethods={TEACHING_METHODS}
            mediaOptions={MEDIA_OPTIONS}
            isSaving={isSaving}
            mode="edit"
            onSave={handleSave}
            onCancel={() => router.push('/teacher/journal')}
          />
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-800/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-800 flex-shrink-0 mt-0.5" />
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-blue-800">Informasi Penting</p>
                <p className="text-sm text-blue-900 mt-0.5">
                  Pastikan semua informasi yang Anda masukkan akurat dan terkini.
                  Data jurnal mengajar akan digunakan untuk pelaporan dan evaluasi proses pembelajaran.
                </p>
              </div>
              <div className="border-t border-blue-200/60 pt-3">
                <p className="text-sm font-semibold text-blue-800 mb-2">Tips Pengisian</p>
                <ul className="space-y-1.5 text-sm text-blue-900">
                  {[
                    'Pastikan tanggal jurnal sesuai dengan tanggal pelaksanaan pembelajaran',
                    'Isi materi dan topik pembelajaran secara spesifik dan jelas',
                    'Pilih metode mengajar dan media pembelajaran yang sesuai dengan materi',
                    'Catat evaluasi pembelajaran untuk menilai pemahaman siswa',
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
