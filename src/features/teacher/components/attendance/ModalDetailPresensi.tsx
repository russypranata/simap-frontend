/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import { AttendanceRecord } from '../../types/teacher';
import { formatLessonHourWithTime } from '../../utils/lessonHourFormatter';
import { ClipboardCheck, Pencil, Save, X } from 'lucide-react';

interface ModalDetailPresensiProps {
  isOpen: boolean;
  record: AttendanceRecord | null;
  onClose: () => void;
  isEditing?: boolean;
  onSave?: (record: AttendanceRecord) => Promise<boolean>;
  onEdit?: () => void;
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  hadir:              { label: 'Hadir',  className: 'bg-green-100 text-green-700 border-green-200' },
  sakit:              { label: 'Sakit',  className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  izin:               { label: 'Izin',   className: 'bg-blue-100 text-blue-700 border-blue-200' },
  'tanpa-keterangan': { label: 'Alpa',   className: 'bg-red-100 text-red-700 border-red-200' },
};

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
    const success = await onSave({ ...record, status: status as any, notes });
    setIsSaving(false);
    if (success) onClose();
  };

  const badge = STATUS_BADGE[record?.status ?? ''] ?? { label: record?.status ?? '-', className: '' };

  return (
    <Dialog open={isOpen && !!record} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[460px] rounded-2xl">
        {/* Header — same pattern as parent GradeDetailDialog */}
        <DialogHeader className="flex-row items-center gap-4 flex-shrink-0 pb-2">
          <div className="p-2.5 bg-blue-100 rounded-xl flex-shrink-0">
            <ClipboardCheck className="h-5 w-5 text-blue-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <DialogTitle className="text-lg font-semibold text-slate-900 leading-tight">
                {isEditing ? 'Edit Presensi' : 'Detail Presensi'}
              </DialogTitle>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!isEditing && onEdit && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <DialogDescription className="text-slate-500 text-sm mt-0.5">
              {record?.studentName} · {record?.class}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Periode Akademik */}
          <Section title="Periode Akademik">
            <Row label="Tahun Ajaran" value={record?.academicYear ?? '-'} />
            <Row label="Semester" value={record?.semester ?? '-'} />
          </Section>

          {/* Informasi Kelas */}
          <Section title="Informasi Kelas">
            <Row label="Kelas" value={record?.class ?? '-'} />
            <Row label="Mata Pelajaran" value={record?.subject ?? '-'} />
            {record?.lessonHour && (
              <Row label="Jam Pelajaran" value={formatLessonHourWithTime(record.lessonHour)} />
            )}
          </Section>

          {/* Status */}
          <Section title="Status Kehadiran">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              {isEditing ? (
                <select
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="hadir">Hadir</option>
                  <option value="sakit">Sakit</option>
                  <option value="izin">Izin</option>
                  <option value="tanpa-keterangan">Alpa</option>
                </select>
              ) : (
                <Badge variant="outline" className={badge.className}>{badge.label}</Badge>
              )}
            </div>
            <Row label="Tanggal" value={record?.date ? formatDate(record.date, 'dd MMMM yyyy') : '-'} />
            {record?.teacher && <Row label="Guru" value={record.teacher} />}
          </Section>

          {/* Catatan */}
          {isEditing ? (
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-sm font-medium">Catatan</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tambahkan catatan..."
              />
            </div>
          ) : record?.notes ? (
            <Section title="Catatan">
              <p className="text-sm text-slate-700">{record.notes}</p>
            </Section>
          ) : null}

          {/* Actions */}
          {isEditing && (
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" onClick={onClose} disabled={isSaving}>Batal</Button>
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? 'Menyimpan...' : <><Save className="h-4 w-4" />Simpan</>}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Helper sub-components ────────────────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2 pb-3 border-b last:border-0 last:pb-0">
    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</h4>
    {children}
  </div>
);

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-muted-foreground">{label}:</span>
    <span className="text-sm font-medium text-slate-900">{value}</span>
  </div>
);
