/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AttendanceRecord } from '../../types/teacher';
import { formatLessonHourWithTime } from '../../utils/lessonHourFormatter';
import { XCircle, Edit, Save } from 'lucide-react';

interface ModalDetailPresensiProps {
  isOpen: boolean;
  record: AttendanceRecord | null;
  onClose: () => void;
  isEditing?: boolean;
  onSave?: (record: AttendanceRecord) => Promise<boolean>;
  onEdit?: () => void;
}

export const ModalDetailPresensi: React.FC<ModalDetailPresensiProps> = ({
  isOpen,
  record,
  onClose,
  isEditing = false,
  onSave,
  onEdit,
}) => {
  const [status, setStatus] = React.useState(record?.status || '');
  const [notes, setNotes] = React.useState(record?.notes || '');
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (record) {
      setStatus(record.status);
      setNotes(record.notes || '');
    }
  }, [record]);

  const handleSave = async () => {
    if (!record || !onSave) return;

    setIsSaving(true);
    const updatedRecord = { ...record, status: status as any, notes };
    const success = await onSave(updatedRecord);
    setIsSaving(false);

    if (success) {
      onClose();
    }
  };
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md m-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Detail Presensi {isEditing ? '(Edit Mode)' : ''}</CardTitle>
            <div className="flex items-center gap-2">
              {!isEditing && onEdit && (
                <Button variant="ghost" size="sm" onClick={onEdit} title="Edit">
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Periode Akademik */}
          <div className="space-y-2 pb-3 border-b">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Periode Akademik</h4>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tahun Ajaran:</span>
              <span className="text-sm font-medium">{record.academicYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Semester:</span>
              <span className="text-sm font-medium">{record.semester}</span>
            </div>
          </div>

          {/* Informasi Kelas */}
          <div className="space-y-2 pb-3 border-b">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Informasi Kelas</h4>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Kelas:</span>
              <span className="text-sm font-medium">{record.class}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Mata Pelajaran:</span>
              <span className="text-sm font-medium">{record.subject}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Jam Pelajaran:</span>
              <span className="text-sm font-medium">{formatLessonHourWithTime(record.lessonHour)}</span>
            </div>
          </div>

          {/* Informasi Siswa */}
          <div className="space-y-2 pb-3 border-b">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Informasi Siswa</h4>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Nama Siswa:</span>
              <span className="text-sm font-medium">{record.studentName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status:</span>
              {isEditing ? (
                <select
                  className="flex h-9 w-full max-w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="hadir">Hadir</option>
                  <option value="sakit">Sakit</option>
                  <option value="izin">Izin</option>
                  <option value="tanpa-keterangan">Alpa</option>
                </select>
              ) : (
                <Badge variant={
                  record.status === 'hadir' ? 'default' :
                    record.status === 'sakit' ? 'secondary' :
                      record.status === 'izin' ? 'outline' : 'destructive'
                }>
                  {record.status === 'tanpa-keterangan' ? 'Alpa' : record.status}
                </Badge>
              )}
            </div>
          </div>

          {/* Detail Presensi */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Detail Presensi</h4>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tanggal:</span>
              <span className="text-sm font-medium">{formatDate(record.date, 'dd MMMM yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Guru:</span>
              <span className="text-sm font-medium">{record.teacher}</span>
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm text-muted-foreground">Catatan:</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tambahkan catatan..."
                />
              </div>
            ) : (
              record.notes && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Catatan:</span>
                  <span className="text-sm font-medium">{record.notes}</span>
                </div>
              )
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose} disabled={isSaving}>
                Batal
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? 'Menyimpan...' : (
                  <>
                    <Save className="h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
