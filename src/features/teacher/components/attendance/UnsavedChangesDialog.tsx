/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface UnsavedChangesDialogProps {
    isOpen: boolean;
    onSave: () => Promise<void>;
    onDiscard: () => void;
    onCancel: () => void;
}

export const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({
    isOpen,
    onSave,
    onDiscard,
    onCancel,
}) => {
    const [isSaving, setIsSaving] = React.useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg">Perubahan Belum Disimpan</DialogTitle>
                            <DialogDescription className="text-sm">
                                Anda memiliki data yang belum disimpan
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Anda memiliki perubahan data presensi yang belum disimpan. Jika Anda melanjutkan,
                        semua perubahan akan hilang.
                    </p>
                    <p className="text-sm text-muted-foreground mt-3">
                        Klik <strong>Lanjutkan</strong> untuk pindah tab tanpa menyimpan, atau <strong>Batal</strong> untuk kembali dan menyimpan data terlebih dahulu.
                    </p>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1"
                        disabled={isSaving}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="default"
                        onClick={onDiscard}
                        className="flex-1"
                        disabled={isSaving}
                    >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Lanjutkan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
