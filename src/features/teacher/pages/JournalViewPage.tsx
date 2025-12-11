'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeachingJournal } from '@/features/teacher/types/teacher';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import {
  ArrowLeft,
  Edit,
  Calendar,
  Users,
  BookOpen,
  Clock,
  Target,
  Award,
  FileText,
  UserCheck,
  Activity,
  StickyNote
} from 'lucide-react';

interface JournalViewPageProps {
  journal: TeachingJournal;
}

export const JournalViewPage: React.FC<JournalViewPageProps> = ({ journal }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/journal/edit?id=${journal.id}`);
  };

  const handleBack = () => {
    router.push('/journal');
  };

  const getAttendancePercentage = () => {
    if (journal.attendance.total === 0) return 0;
    return ((journal.attendance.present / journal.attendance.total) * 100).toFixed(1);
  };

  // Format teaching methods for display
  const formatTeachingMethods = (methods: string | string[]) => {
    if (Array.isArray(methods)) {
      return methods.join(', ');
    }
    return methods;
  };

  // Format media for display
  const formatMedia = (media: string | string[]) => {
    if (Array.isArray(media)) {
      return media.join(', ');
    }
    return media;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lihat Detail Jurnal</h1>
            <p className="text-muted-foreground">
              Lihat detail dari entri jurnal mengajar ini
            </p>
          </div>
        </div>
        <Button onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Jurnal
        </Button>
      </div>

      {/* Journal Details Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Detail Jurnal
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Informasi lengkap tentang entri jurnal mengajar ini
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Label className="text-sm font-bold text-muted-foreground">Tanggal</Label>
                <p className="text-sm mt-1">{formatDate(journal.date, 'dd MMMM yyyy')}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Label className="text-sm font-bold text-muted-foreground">Kelas</Label>
                <p className="text-sm mt-1">{journal.class}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Label className="text-sm font-bold text-muted-foreground">Mata Pelajaran</Label>
                <p className="text-sm mt-1">{journal.subject}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Label className="text-sm font-bold text-muted-foreground">Jam Pelajaran</Label>
                <p className="text-sm mt-1">
                  {journal.lessonHour}
                  {(journal.startTime && journal.endTime) && (
                    <span className="text-muted-foreground ml-1">
                      ({journal.startTime} - {journal.endTime})
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Target className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label className="text-sm font-bold text-muted-foreground">Materi Pembelajaran</Label>
                  <p className="text-sm mt-1">{journal.material}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label className="text-sm font-bold text-muted-foreground">Kegiatan Pembelajaran</Label>
                  <p className="text-sm mt-1">{journal.topic}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label className="text-sm font-bold text-muted-foreground">Asesmen</Label>
                  <p className="text-sm mt-1">{journal.evaluation}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label className="text-sm font-bold text-muted-foreground">Metode Mengajar</Label>
                  <p className="text-sm mt-1">{formatTeachingMethods(journal.teachingMethod)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label className="text-sm font-bold text-muted-foreground">Media Pembelajaran</Label>
                  <p className="text-sm mt-1">{formatMedia(journal.media)}</p>
                </div>
              </div>

              {journal.notes && (
                <div className="flex items-start space-x-3">
                  <StickyNote className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <Label className="text-sm font-bold text-muted-foreground">Catatan Tambahan</Label>
                    <p className="text-sm mt-1">{journal.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <UserCheck className="h-5 w-5 text-muted-foreground" />
              <Label className="text-sm font-bold text-muted-foreground">Kehadiran Siswa</Label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="font-bold text-green-600 text-lg">{journal.attendance.present}</div>
                <div className="text-xs text-green-600 mt-1">Hadir</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="font-bold text-yellow-600 text-lg">{journal.attendance.sick}</div>
                <div className="text-xs text-yellow-600 mt-1">Sakit</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="font-bold text-blue-600 text-lg">{journal.attendance.permit}</div>
                <div className="text-xs text-blue-600 mt-1">Izin</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="font-bold text-red-600 text-lg">{journal.attendance.absent}</div>
                <div className="text-xs text-red-600 mt-1">Alpha</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-sm font-medium">
                Tingkat kehadiran: <span className="font-bold">{getAttendancePercentage()}%</span>
              </div>
            </div>
          </div>

          {/* Metadata Footer */}
          {(journal.createdAt || journal.updatedAt) && (
            <div className="pt-4 mt-4 border-t text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
              {journal.createdAt && (
                <div className="flex items-center gap-1">
                  <span>Dibuat pada:</span>
                  <span className="font-medium">
                    {formatDate(journal.createdAt, 'dd MMMM yyyy, HH:mm')}
                  </span>
                </div>
              )}
              {journal.updatedAt && (
                <div className="flex items-center gap-1">
                  <span>Terakhir diperbarui:</span>
                  <span className="font-medium">
                    {formatDate(journal.updatedAt, 'dd MMMM yyyy, HH:mm')}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar Jurnal
        </Button>
        <Button onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Jurnal
        </Button>
      </div>
    </div>
  );
};