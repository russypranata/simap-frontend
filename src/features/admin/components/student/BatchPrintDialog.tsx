'use client';

import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Printer, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminStudent } from '../../types/student';
import { generateBatchIdCardsPDF, StudentCardData } from '../../utils/generateBatchIdCardsPDF';

interface BatchPrintDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedStudents: AdminStudent[];
}

export const BatchPrintDialog: React.FC<BatchPrintDialogProps> = ({
    open,
    onOpenChange,
    selectedStudents,
}) => {
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set(selectedStudents.map(s => s.id)));
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    const handleOpenChange = useCallback((open: boolean) => {
        if (!open) {
            setSelectedIds(new Set());
            setIsGenerating(false);
            setProgress({ current: 0, total: 0 });
            setAbortController(null);
        } else {
            setSelectedIds(new Set(selectedStudents.map((s: AdminStudent) => s.id)));
            setIsGenerating(false);
            setProgress({ current: 0, total: 0 });
            setAbortController(null);
        }
        onOpenChange(open);
    }, [onOpenChange, selectedStudents]);

    const toggleSelect = useCallback((id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const toggleSelectAll = useCallback(() => {
        setSelectedIds(prev =>
            prev.size === selectedStudents.length ? new Set<number>() : new Set(selectedStudents.map(s => s.id))
        );
    }, [selectedStudents]);

    const handleGenerate = useCallback(async () => {
        if (selectedIds.size === 0) return;

        const controller = new AbortController();
        setAbortController(controller);
        setIsGenerating(true);

        try {
            const studentsToPrint = selectedStudents.filter(s => selectedIds.has(s.id));
            const cardDataList: StudentCardData[] = [];

            for (let i = 0; i < studentsToPrint.length; i++) {
                setProgress(_ => ({ current: i + 1, total: studentsToPrint.length + 1 }));
                if (controller.signal.aborted) break;

                const student = studentsToPrint[i];
                let photoDataUrl: string | null = null;

                if (student.avatar && !student.avatar.includes('/default.') && !student.avatar.endsWith('/default')) {
                    try {
                        const resp = await fetch(`/api/image-proxy?url=${encodeURIComponent(student.avatar)}`);
                        if (resp.ok) {
                            const blob = await resp.blob();
                            photoDataUrl = await new Promise<string>((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result as string);
                                reader.onerror = reject;
                                reader.readAsDataURL(blob);
                            });
                        }
                    } catch {}
                }

                cardDataList.push({
                    id: student.id,
                    name: student.name,
                    nis: student.nis,
                    nisn: student.nisn,
                    birthPlace: student.birth_place,
                    birthDate: student.birth_date,
                    address: student.address,
                    religion: student.religion,
                    validUntil: student.valid_until,
                    photoDataUrl,
                });
            }

            setProgress(_ => ({ current: studentsToPrint.length + 1, total: studentsToPrint.length + 1 }));
            await generateBatchIdCardsPDF(
                cardDataList,
                `kartu-pelajar-batch-${Date.now()}.pdf`,
                (_, current: number) => setProgress(p => ({ ...p, current })),
                controller.signal,
            );

            onOpenChange(false);
        } catch (e) {
            if ((e as Error).name !== 'AbortError') {
                console.error('PDF generation error:', e);
            }
        } finally {
            setIsGenerating(false);
            setAbortController(null);
        }
    }, [selectedIds, selectedStudents, onOpenChange]);

    const handleCancel = useCallback(() => {
        abortController?.abort();
    }, [abortController]);

    const selectedCount = selectedIds.size;
    const progressPercent = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg">Cetak Batch Kartu Pelajar</DialogTitle>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {selectedStudents.length} siswa dipilih
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200">
                        <Checkbox
                            checked={selectedCount > 0 && selectedCount === selectedStudents.length}
                            onCheckedChange={toggleSelectAll}
                        />
                        <span className="text-sm font-medium">
                            {selectedCount === selectedStudents.length ? 'Hapus semua centang' : 'Pilih semua'}
                        </span>
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                        {selectedStudents.map(student => {
                            const initials = student.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
                            return (
                                <div
                                    key={student.id}
                                    className={cn(
                                        'flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer',
                                        selectedIds.has(student.id)
                                            ? 'border-blue-300 bg-blue-50/50'
                                            : 'border-slate-200 hover:bg-slate-50'
                                    )}
                                    onClick={() => toggleSelect(student.id)}
                                >
                                    <Checkbox checked={selectedIds.has(student.id)} onCheckedChange={() => toggleSelect(student.id)} />
                                    <Avatar className="h-9 w-9 border border-slate-200 shrink-0">
                                        <AvatarImage src={student.avatar ?? undefined} />
                                        <AvatarFallback className="bg-blue-100 text-blue-800 text-xs font-medium">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900 text-sm">{student.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-slate-500 font-mono">{student.admission_number}</span>
                                            {student.class_name && (
                                                <Badge className="bg-blue-800 text-white text-xs font-medium py-0">
                                                    {student.class_name}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {isGenerating && (
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">
                                {progress.current <= progress.total - 1
                                    ? `Memproses siswa ${progress.current} dari ${progress.total - 1}...`
                                    : 'Menggabungkan ke PDF...'}
                            </span>
                            <span className="text-slate-500">{Math.round(progressPercent)}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                    </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
                        Batal
                    </Button>
                    {isGenerating ? (
                        <Button variant="default" onClick={handleCancel} className="bg-red-600 hover:bg-red-700">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Batalkan
                        </Button>
                    ) : (
                        <Button
                            onClick={handleGenerate}
                            disabled={selectedCount === 0}
                            className="bg-blue-800 hover:bg-blue-900"
                        >
                            <Printer className="h-4 w-4 mr-2" />
                            Cetak {selectedCount > 0 ? `${selectedCount} Kartu` : 'Kartu'}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};