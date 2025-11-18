'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import { XCircle } from 'lucide-react';

interface ModalDetailPresensiProps {
  isOpen: boolean;
  record: any | null;
  onClose: () => void;
}

export const ModalDetailPresensi: React.FC<ModalDetailPresensiProps> = ({
  isOpen,
  record,
  onClose,
}) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md m-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Detail Presensi</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Nama Siswa:</span>
              <span className="text-sm font-medium">{record.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Kelas:</span>
              <span className="text-sm font-medium">{record.class}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Mata Pelajaran:</span>
              <span className="text-sm font-medium">{record.subject}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tanggal:</span>
              <span className="text-sm font-medium">{formatDate(record.date, 'dd MMMM yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge variant={
                record.status === 'hadir' ? 'default' :
                record.status === 'sakit' ? 'secondary' :
                record.status === 'izin' ? 'outline' : 'destructive'
              }>
                {record.status === 'tanpa-keterangan' ? 'Alpa' : record.status}
              </Badge>
            </div>
            {record.notes && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Catatan:</span>
                <span className="text-sm font-medium">{record.notes}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Guru:</span>
              <span className="text-sm font-medium">{record.teacher}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
