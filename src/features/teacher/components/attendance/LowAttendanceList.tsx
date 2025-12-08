import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Calendar, Users, BookOpen } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LowAttendanceListProps {
    attendanceRecords: any[];
    filteredStudents: any[];
    threshold?: number; // Percentage threshold (default 80)
    selectedClassName?: string;
    selectedSubjectName?: string;
    academicYear?: string;
    semester?: string;
}

export const LowAttendanceList: React.FC<LowAttendanceListProps> = ({
    attendanceRecords,
    filteredStudents,
    threshold = 80,
    selectedClassName,
    selectedSubjectName,
    academicYear,
    semester
}) => {
    // Calculate attendance per student
    const studentStats = filteredStudents.map(student => {
        const studentRecords = attendanceRecords.filter(r => r.studentId === student.id);
        const totalRecords = studentRecords.length;

        if (totalRecords === 0) return null;

        const hadir = studentRecords.filter(r => r.status === 'hadir').length;
        const percentage = (hadir / totalRecords) * 100;

        return {
            ...student,
            percentage,
            hadir,
            total: totalRecords,
            alpha: studentRecords.filter(r => r.status === 'tanpa-keterangan').length,
            sakit: studentRecords.filter(r => r.status === 'sakit').length,
            izin: studentRecords.filter(r => r.status === 'izin').length,
        };
    }).filter(Boolean);

    // Filter students below threshold and sort by lowest percentage
    const lowAttendanceStudents = studentStats
        .filter(s => s && s.percentage < threshold)
        .sort((a, b) => (a?.percentage || 0) - (b?.percentage || 0));

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                Evaluasi Kehadiran Siswa
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                                Daftar siswa dengan tingkat kehadiran di bawah {threshold}%
                            </CardDescription>
                        </div>
                    </div>
                </div>
                {/* Filter Badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                    {academicYear && (
                        <Badge variant="outline" className="text-xs font-normal gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
                            <Calendar className="h-3 w-3" />
                            {academicYear}
                        </Badge>
                    )}
                    {semester ? (
                        <Badge variant="outline" className="text-xs font-normal gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
                            <Calendar className="h-3 w-3" />
                            {semester}
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="text-xs font-normal gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
                            <Calendar className="h-3 w-3" />
                            Satu Tahun Ajaran
                        </Badge>
                    )}
                    {selectedClassName ? (
                        <Badge variant="outline" className="text-xs font-normal gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
                            <Users className="h-3 w-3" />
                            {selectedClassName}
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="text-xs font-normal gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
                            <Users className="h-3 w-3" />
                            Semua Kelas
                        </Badge>
                    )}
                    {selectedSubjectName ? (
                        <Badge variant="outline" className="text-xs font-normal gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
                            <BookOpen className="h-3 w-3" />
                            {selectedSubjectName}
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="text-xs font-normal gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
                            <BookOpen className="h-3 w-3" />
                            Semua Mata Pelajaran
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {lowAttendanceStudents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground space-y-2">
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">Semua siswa rajin!</p>
                        <p className="text-xs">Tidak ada siswa dengan kehadiran di bawah {threshold}%</p>
                    </div>
                ) : (
                    <ScrollArea className="h-[300px]">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Siswa</th>
                                    <th className="px-4 py-3 font-medium">Kehadiran</th>
                                    <th className="px-4 py-3 font-medium text-right">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {lowAttendanceStudents.map((student) => (
                                    <tr key={student?.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-900">{student?.name}</div>
                                            <div className="text-xs text-muted-foreground">{student?.class}</div>
                                        </td>
                                        <td className="px-4 py-3 w-1/3">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-medium text-gray-900">{student?.percentage.toFixed(0)}%</span>
                                                    <span className="text-muted-foreground">{student?.hadir}/{student?.total} Hadir</span>
                                                </div>
                                                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${student?.percentage! < 50 ? 'bg-red-500' :
                                                            student?.percentage! < 75 ? 'bg-yellow-500' : 'bg-green-500'
                                                            }`}
                                                        style={{ width: `${student?.percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2 text-xs">
                                                {student?.alpha! > 0 && (
                                                    <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded font-medium">
                                                        {student?.alpha} A
                                                    </span>
                                                )}
                                                {student?.sakit! > 0 && (
                                                    <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded font-medium">
                                                        {student?.sakit} S
                                                    </span>
                                                )}
                                                {student?.izin! > 0 && (
                                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                                                        {student?.izin} I
                                                    </span>
                                                )}
                                                {student?.hadir! > 0 && (
                                                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium">
                                                        {student?.hadir} H
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
};
