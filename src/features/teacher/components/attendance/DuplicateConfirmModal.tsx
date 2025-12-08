'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Edit, RefreshCw } from 'lucide-react';
import { formatDate } from '@/features/shared/utils/dateFormatter';

interface DuplicateConfirmModalProps {
    isOpen: boolean;
    existingRecord: {
        class: string;
        subject: string;
        date: string;
        lessonHour?: string;
    } | null;
    onEdit: () => void;
    onOverwrite: () => void;
    onCancel: () => void;
}

export const DuplicateConfirmModal: React.FC<DuplicateConfirmModalProps> = ({
    isOpen,
    existingRecord,
    onEdit,
    onOverwrite,
    onCancel,
}) => {
    if (!existingRecord) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg">Data Sudah Ada</DialogTitle>
                            <DialogDescription className="text-sm">
                                Presensi untuk kombinasi ini sudah pernah diinput
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-3 py-4">
                    <p className="text-sm text-muted-foreground">
                        Presensi untuk kombinasi berikut sudah ada di sistem:
                    </p>
                    <div className="bg-muted rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-muted-foreground min-w-[120px]">Kelas:</span>
                            <span className="font-semibold">{existingRecord.class}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-muted-foreground min-w-[120px]">Mata Pelajaran:</span>
                            <span className="font-semibold">{existingRecord.subject}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-muted-foreground min-w-[120px]">Tanggal:</span>
                            <span className="font-semibold">{formatDate(existingRecord.date)}</span>
                        </div>
                        {existingRecord.lessonHour && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium text-muted-foreground min-w-[120px]">Jam Pelajaran:</span>
                                <span className="font-semibold">Jam ke-{existingRecord.lessonHour}</span>
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Apa yang ingin Anda lakukan?
                    </p>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="w-full sm:w-auto"
                    >
                        Batal
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={onEdit}
                        className="w-full sm:w-auto gap-2"
                    >
                        <Edit className="h-4 w-4" />
                        Edit Data Lama
                    </Button>
                    <Button
                        variant="default"
                        onClick={onOverwrite}
                        className="w-full sm:w-auto gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Timpa Data
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
