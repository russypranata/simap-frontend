'use client';

import React, { useState, useEffect, startTransition } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UserCheck, Loader2 } from 'lucide-react';
import { ClassRoom, TeacherDropdown } from '../../types/class';

interface AssignHomeroomModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classRoom: ClassRoom | null;
    teachers: TeacherDropdown[];
    onSubmit: (classId: number, teacherId: number | null) => void;
    isSubmitting: boolean;
}

const REMOVE_VALUE = '__remove__';

export const AssignHomeroomModal: React.FC<AssignHomeroomModalProps> = ({
    open,
    onOpenChange,
    classRoom,
    teachers,
    onSubmit,
    isSubmitting,
}) => {
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');

    // Sync with current homeroom teacher when modal opens
    useEffect(() => {
        if (open && classRoom) {
            startTransition(() => {
                setSelectedTeacherId(
                    classRoom.homeroom_teacher_id
                        ? String(classRoom.homeroom_teacher_id)
                        : ''
                );
            });
        }
    }, [open, classRoom]);

    const handleSubmit = () => {
        if (!classRoom) return;
        const teacherId =
            selectedTeacherId === REMOVE_VALUE || selectedTeacherId === ''
                ? null
                : Number(selectedTeacherId);
        onSubmit(classRoom.id, teacherId);
    };

    const hasChanged =
        classRoom &&
        (selectedTeacherId === REMOVE_VALUE
            ? classRoom.homeroom_teacher_id !== null && classRoom.homeroom_teacher_id !== undefined
            : selectedTeacherId !== '' &&
              Number(selectedTeacherId) !== classRoom.homeroom_teacher_id);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                            <UserCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold text-slate-900">
                                Ubah Wali Kelas
                            </DialogTitle>
                            <DialogDescription className="text-sm text-slate-500 mt-0.5">
                                Kelas <span className="font-semibold text-slate-700">{classRoom?.name}</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Current homeroom info */}
                    {classRoom?.homeroom_teacher_name && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
                            <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0">
                                {classRoom.homeroom_teacher_name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Wali kelas saat ini</p>
                                <p className="text-sm font-medium text-slate-800">
                                    {classRoom.homeroom_teacher_name}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Teacher select */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">
                            Pilih Wali Kelas Baru
                        </Label>
                        <Select
                            value={selectedTeacherId}
                            onValueChange={setSelectedTeacherId}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih guru..." />
                            </SelectTrigger>
                            <SelectContent>
                                {/* Option to remove homeroom teacher */}
                                {classRoom?.homeroom_teacher_id && (
                                    <SelectItem value={REMOVE_VALUE} className="text-red-600">
                                        — Hapus Wali Kelas —
                                    </SelectItem>
                                )}
                                {teachers.map(teacher => (
                                    <SelectItem key={teacher.id} value={String(teacher.id)}>
                                        {teacher.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-400">
                            Hanya guru yang terdaftar di sistem yang dapat dipilih sebagai wali kelas.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !hasChanged}
                        className="bg-blue-800 hover:bg-blue-900 text-white"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            'Simpan'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
