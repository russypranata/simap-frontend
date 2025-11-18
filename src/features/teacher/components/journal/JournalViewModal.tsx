'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, CheckCircle, Users, Award, FileText } from 'lucide-react';
import { TeachingJournal } from '@/features/teacher/types/teacher';
import { formatDate } from '@/features/shared/utils/dateFormatter';

interface JournalViewModalProps {
  isOpen: boolean;
  journal: TeachingJournal | null;
  onClose: () => void;
  onEdit: (journal: TeachingJournal) => void;
}

export const JournalViewModal: React.FC<JournalViewModalProps> = ({
  isOpen,
  journal,
  onClose,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!journal) return null;

  const getAttendancePercentage = () => {
    if (journal.attendance.total === 0) return 0;
    return ((journal.attendance.present / journal.attendance.total) * 100).toFixed(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Detail Jurnal Mengajar
          </DialogTitle>
          <DialogDescription>
            Lihat detail jurnal mengajar
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Tanggal</Label>
              <p className="text-sm">{formatDate(journal.date, 'dd MMMM yyyy')}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Kelas</Label>
              <p className="text-sm">{journal.class}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Mata Pelajaran</Label>
              <p className="text-sm">{journal.subject}</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Materi Pembelajaran</Label>
            <p className="text-sm mt-1">{journal.material}</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Topik Pembelajaran</Label>
            <p className="text-sm mt-1">{journal.topic}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Metode Mengajar</Label>
              <p className="text-sm mt-1">{journal.teachingMethod}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Media Pembelajaran</Label>
              <p className="text-sm mt-1">{journal.media}</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Absensi Siswa</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-medium text-green-600">{journal.attendance.present}</div>
                <div className="text-xs text-green-600">Hadir</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="font-medium text-yellow-600">{journal.attendance.sick}</div>
                <div className="text-xs text-yellow-600">Sakit</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="font-medium text-blue-600">{journal.attendance.permit}</div>
                <div className="text-xs text-blue-600">Izin</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="font-medium text-red-600">{journal.attendance.absent}</div>
                <div className="text-xs text-red-600">Alpa</div>
              </div>
            </div>
            <div className="mt-2 text-sm">
              Tingkat kehadiran: {getAttendancePercentage()}%
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Evaluasi Pembelajaran</Label>
            <p className="text-sm mt-1">{journal.evaluation}</p>
          </div>

          {journal.notes && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Catatan Tambahan</Label>
              <p className="text-sm mt-1">{journal.notes}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
            <Button onClick={() => onEdit(journal)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Jurnal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};