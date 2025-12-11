import React, { useEffect, useState, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Download, Printer, Loader2 } from 'lucide-react';
import { AttendanceRecord, Student } from '../../types/teacher';
import { getAllAttendanceRecords } from '../../utils/attendanceStorage';
import { useTeacherData } from '../../hooks/useTeacherData';

interface ReportPreviewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'monthly' | 'semester';
    filters: {
        classId: string;
        className: string;
        subject: string;
        month?: string; // 0-11
        year?: string;
        academicYear?: string;
        semester?: string;
    };
    onExport: (format: 'pdf' | 'excel') => void;
}

export const ReportPreviewDialog: React.FC<ReportPreviewDialogProps> = ({
    isOpen,
    onClose,
    type,
    filters,
    onExport,
}) => {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [isLoadingRecords, setIsLoadingRecords] = useState(false);

    // Use independent teacher data hook to fetch students for the selected class
    const { students, fetchStudents, loading: isLoadingStudents } = useTeacherData();

    // Load students when classId changes and dialog is open
    useEffect(() => {
        if (isOpen && filters.classId) {
            fetchStudents(filters.classId);
        }
    }, [isOpen, filters.classId]);

    // Load attendance records when dialog opens
    useEffect(() => {
        if (isOpen) {
            const loadRecords = async () => {
                setIsLoadingRecords(true);
                try {
                    const data = await getAllAttendanceRecords();
                    setRecords(data);
                } catch (error) {
                    console.error("Failed to load records", error);
                } finally {
                    setIsLoadingRecords(false);
                }
            };
            loadRecords();
        }
    }, [isOpen]);

    const isLoading = isLoadingRecords || isLoadingStudents;

    // Filter records based on props
    const filteredRecords = useMemo(() => {
        return records.filter(r => {
            const matchClass = r.class === filters.className; // Note: records store class Name
            const matchSubject = r.subject === filters.subject;

            if (!matchClass || !matchSubject) return false;

            if (type === 'monthly') {
                if (!filters.month || !filters.year) return false;
                const date = new Date(r.date);
                const matchMonth = date.getMonth() === parseInt(filters.month);
                const matchYear = date.getFullYear() === parseInt(filters.year);
                return matchMonth && matchYear;
            } else {
                // Semester
                if (!filters.academicYear || !filters.semester) return false;
                const matchAcademic = r.academicYear === filters.academicYear;
                const matchSemester = r.semester === filters.semester;
                return matchAcademic && matchSemester;
            }
        });
    }, [records, type, filters]);

    // Process data for the table
    const processedData = useMemo(() => {
        if (!students.length) return [];

        return students.map(student => {
            // Find records for this student
            const studentRecords = filteredRecords.filter(r => r.studentId === student.id || r.studentName === student.name);

            // Calculate stats
            const stats = {
                hadir: 0,
                sakit: 0,
                izin: 0,
                alpa: 0,
            };

            const dailyStatus: Record<number, string> = {};

            studentRecords.forEach(r => {
                if (type === 'monthly') {
                    const day = new Date(r.date).getDate();
                    // If multiple records for same day (different hours), prioritize worst status or just take one?
                    // Usually daily report shows one status per day. Let's assume one.
                    dailyStatus[day] = r.status.charAt(0).toUpperCase();
                }

                if (r.status === 'hadir') stats.hadir++;
                else if (r.status === 'sakit') stats.sakit++;
                else if (r.status === 'izin') stats.izin++;
                else if (r.status === 'tanpa-keterangan') stats.alpa++;
            });

            return {
                ...student,
                dailyStatus,
                stats,
                total: studentRecords.length,
                percentage: studentRecords.length > 0
                    ? Math.round((stats.hadir / studentRecords.length) * 100)
                    : 0
            };
        });
    }, [students, filteredRecords, type]);


    // Generate days for monthly view
    const daysInMonth = useMemo(() => {
        if (type !== 'monthly' || !filters.year || !filters.month) return [];
        const days = new Date(parseInt(filters.year), parseInt(filters.month) + 1, 0).getDate();
        return Array.from({ length: days }, (_, i) => i + 1);
    }, [type, filters.year, filters.month]);

    const getMonthName = (monthIndex?: string) => {
        if (!monthIndex) return '';
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return months[parseInt(monthIndex)];
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>
                        Preview Laporan {type === 'monthly' ? 'Bulanan' : 'Semester'}
                    </DialogTitle>
                    <DialogDescription>
                        {filters.className} - {filters.subject}
                        {type === 'monthly'
                            ? ` (${getMonthName(filters.month)} ${filters.year})`
                            : ` (${filters.academicYear} - ${filters.semester})`
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden p-6 pt-2">
                    {isLoading ? (
                        <div className="h-full w-full flex items-center justify-center flex-col gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Memuat data...</p>
                        </div>
                    ) : processedData.length === 0 ? (
                        <div className="h-full w-full flex items-center justify-center border rounded-md border-dashed">
                            <p className="text-muted-foreground">Tidak ada data siswa ditemukan</p>
                        </div>
                    ) : (
                        <ScrollArea className="h-full border rounded-md">
                            <div className="min-w-max">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="w-[50px] sticky left-0 bg-muted/95 z-20">No</TableHead>
                                            <TableHead className="w-[250px] sticky left-[50px] bg-muted/95 z-20 border-r">Nama Siswa</TableHead>

                                            {type === 'monthly' && daysInMonth.map(day => (
                                                <TableHead key={day} className="w-[30px] text-center p-1 text-xs">
                                                    {day}
                                                </TableHead>
                                            ))}

                                            <TableHead className="w-[50px] text-center bg-green-50 text-green-700 font-bold border-l">H</TableHead>
                                            <TableHead className="w-[50px] text-center bg-blue-50 text-blue-700 font-bold">S</TableHead>
                                            <TableHead className="w-[50px] text-center bg-yellow-50 text-yellow-700 font-bold">I</TableHead>
                                            <TableHead className="w-[50px] text-center bg-red-50 text-red-700 font-bold">A</TableHead>
                                            <TableHead className="w-[60px] text-center font-bold border-l">%</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {processedData.map((student, index) => (
                                            <TableRow key={student.id} className="hover:bg-muted/50">
                                                <TableCell className="sticky left-0 bg-background z-10">{index + 1}</TableCell>
                                                <TableCell className="font-medium sticky left-[50px] bg-background z-10 border-r">
                                                    {student.name}
                                                </TableCell>

                                                {type === 'monthly' && daysInMonth.map(day => {
                                                    const status = student.dailyStatus[day];
                                                    let bgColor = '';
                                                    let textColor = 'text-muted-foreground/30'; // Dot color for empty

                                                    if (status === 'H') { bgColor = 'bg-green-100'; textColor = 'text-green-700'; }
                                                    else if (status === 'S') { bgColor = 'bg-blue-100'; textColor = 'text-blue-700'; }
                                                    else if (status === 'I') { bgColor = 'bg-yellow-100'; textColor = 'text-yellow-700'; }
                                                    else if (status === 'T') { bgColor = 'bg-red-100'; textColor = 'text-red-700'; } // T for Tanpa Keterangan if usually labeled A or T? 'Tanpa-keterangan' maps to 'T'

                                                    // Map 'T' from 'Tanpa-keterangan' which gives charAt(0)='t'. Capitalize.
                                                    // Actually charAt(0) of 'tanpa-keterangan' is 't'. Let's ensure capital.

                                                    return (
                                                        <TableCell key={day} className={`p-0 text-center border-l border-r border-dashed ${bgColor}`}>
                                                            <span className={`text-xs font-medium ${textColor}`}>
                                                                {status || '•'}
                                                            </span>
                                                        </TableCell>
                                                    );
                                                })}

                                                <TableCell className="text-center font-medium bg-green-50/50 border-l">{student.stats.hadir}</TableCell>
                                                <TableCell className="text-center font-medium bg-blue-50/50">{student.stats.sakit}</TableCell>
                                                <TableCell className="text-center font-medium bg-yellow-50/50">{student.stats.izin}</TableCell>
                                                <TableCell className="text-center font-medium bg-red-50/50">{student.stats.alpa}</TableCell>
                                                <TableCell className="text-center font-bold border-l">{student.percentage}%</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <ScrollBar orientation="horizontal" />
                            </div>
                        </ScrollArea>
                    )}
                </div>

                <DialogFooter className="p-4 border-t gap-2 sm:justify-between items-center bg-muted/10">
                    <div className="text-sm text-muted-foreground">
                        Total: {processedData.length} Siswa
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Tutup
                        </Button>
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => onExport('pdf')}
                        >
                            <Printer className="h-4 w-4" />
                            Cetak PDF
                        </Button>
                        <Button
                            className="gap-2"
                            onClick={() => onExport('excel')}
                        >
                            <Download className="h-4 w-4" />
                            Download Excel
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
