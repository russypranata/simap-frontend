'use client';

import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Trash2, Loader2, Calendar, BookOpen, Clock, User } from 'lucide-react';
import { AttendanceRecord } from '../../types/teacher';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import { formatLessonHourWithTime } from '../../utils/lessonHourFormatter';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'destructive';
    isLoading?: boolean;
    record?: AttendanceRecord; // Optional: untuk menampilkan detail record
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Konfirmasi',
    cancelLabel = 'Batal',
    variant = 'default',
    isLoading = false,
    record,
}) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="sm:max-w-[520px]">
                <AlertDialogHeader>
                    <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`
              flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center
              ${variant === 'destructive'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-blue-100 text-blue-600'
                            }
            `}>
                            {variant === 'destructive' ? (
                                <AlertTriangle className="h-6 w-6" />
                            ) : (
                                <Trash2 className="h-6 w-6" />
                            )}
                        </div>

                        {/* Title and Description */}
                        <div className="flex-1">
                            <AlertDialogTitle className="text-xl font-bold text-gray-900 mb-2">
                                {title}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm text-gray-600 leading-relaxed">
                                {description}
                            </AlertDialogDescription>
                        </div>
                    </div>
                </AlertDialogHeader>

                {/* Record Details (if provided) */}
                {record && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            Detail Data yang Akan Dihapus
                        </h4>
                        <div className="space-y-2.5">
                            <div className="flex items-start gap-3">
                                <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500">Nama Siswa</p>
                                    <p className="font-semibold text-gray-900">{record.studentName}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <BookOpen className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500">Kelas & Mata Pelajaran</p>
                                    <p className="font-medium text-gray-900">{record.class} • {record.subject}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500">Tanggal & Jam Pelajaran</p>
                                    <p className="font-medium text-gray-900">
                                        {formatDate(record.date, 'dd MMMM yyyy')} • {formatLessonHourWithTime(record.lessonHour)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <AlertDialogFooter className="mt-6 gap-3 sm:gap-3">
                    <AlertDialogCancel
                        disabled={isLoading}
                        onClick={onClose}
                        className="sm:w-auto px-6 border-gray-200 hover:bg-gray-50"
                    >
                        {cancelLabel}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isLoading}
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        className={`
              sm:w-auto px-6 font-semibold
              ${variant === 'destructive'
                                ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                            }
            `}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Memproses...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                {variant === 'destructive' && <Trash2 className="h-4 w-4" />}
                                <span>{confirmLabel}</span>
                            </div>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
