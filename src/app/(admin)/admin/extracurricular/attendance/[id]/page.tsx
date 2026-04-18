'use client';

import React, { useState, useEffect } from 'react';
import { 
    Calendar, 
    Clock, 
    CheckCircle2, 
    XCircle,
    ClipboardCheck,
    Info,
    Search,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter, useParams } from 'next/navigation';
import { extracurricularAttendanceService } from '@/features/admin/services/extracurricularAttendanceService';
import { extracurricularService } from '@/features/admin/services/extracurricularService';
import { Extracurricular, ExtracurricularSession, SessionMemberAttendance } from '@/features/admin/types/extracurricular';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export default function AttendanceDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const [ekskul, setEkskul] = useState<Extracurricular | null>(null);
    const [sessions, setSessions] = useState<ExtracurricularSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Detail Modal State
    const [selectedSession, setSelectedSession] = useState<ExtracurricularSession | null>(null);
    const [sessionAttendance, setSessionAttendance] = useState<SessionMemberAttendance[]>([]);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentSearch, setStudentSearch] = useState('');

    useEffect(() => {
        if (id) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [ekskulResult, sessionsData] = await Promise.all([
                extracurricularService.getById(Number(id)),
                extracurricularAttendanceService.getSessions(id)
            ]);
            
            if (ekskulResult) setEkskul(ekskulResult.extracurricular);
            setSessions(sessionsData);
        } catch (error) {
            console.error('Failed to fetch attendance details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewSessionDetail = async (session: ExtracurricularSession) => {
        try {
            setSelectedSession(session);
            setIsModalOpen(true);
            setIsDetailLoading(true);
            const { attendance } = await extracurricularAttendanceService.getSessionDetail(session.id);
            setSessionAttendance(attendance);
        } catch (error) {
            console.error('Failed to fetch session detail:', error);
        } finally {
            setIsDetailLoading(false);
        }
    };

    const filteredAttendance = sessionAttendance.filter(a => 
        a.studentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
        a.nis.includes(studentSearch)
    );

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!ekskul) {
        return (
            <div className="p-12 text-center">
                <p>Data ekstrakurikuler tidak ditemukan.</p>
                <Button variant="link" onClick={() => router.back()}>Kembali</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => router.back()}
                    className="h-9 w-9 border-slate-200"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 uppercase">Riwayat Presensi</h1>
                    <p className="text-sm text-slate-500 font-medium">{ekskul.name} • {ekskul.mentorName}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="md:col-span-1 border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Informasi Ekskul</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategori</label>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none rounded-full px-3">
                                    {ekskul.category}
                                </Badge>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jadwal Rutin</label>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <Calendar className="h-4 w-4 text-blue-600" />
                                {ekskul.day}, {ekskul.time}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lokasi</label>
                            <div className="text-sm font-semibold text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                                {ekskul.location || 'Sudah Ditentukan'}
                            </div>
                        </div>
                        <div className="pt-2 border-t border-slate-100">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-slate-500 font-bold uppercase">Total Anggota</span>
                                <span className="text-lg font-black text-blue-800">{ekskul.currentCapacity}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-3 border-slate-200 shadow-md">
                    <CardHeader className="pb-3 border-b border-slate-100">
                        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <ClipboardCheck className="h-5 w-5 text-blue-800" />
                            Daftar Pertemuan / Sesi
                        </CardTitle>
                        <CardDescription>Menampilkan daftar seluruh sesi kegiatan yang telah dilaksanakan oleh pembina.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50 text-[10px] uppercase tracking-wider font-black">
                                    <TableRow>
                                        <TableHead>TGL/WAKTU</TableHead>
                                        <TableHead>TOPIK KEGIATAN</TableHead>
                                        <TableHead className="text-center">PRESENSI</TableHead>
                                        <TableHead className="text-right">AKSI</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sessions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                                                Belum ada data pertemuan tercatat
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        sessions.map((session) => (
                                            <TableRow key={session.id} className="hover:bg-slate-50/80 transition-colors">
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-800">
                                                            {new Date(session.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                                            <Clock className="h-3 w-3" /> {session.startTime} - {session.endTime}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm font-semibold text-slate-600 italic">&ldquo;{session.topic}&rdquo;</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="text-xs font-bold text-slate-800">{session.attendanceCount} / {session.totalMembers} Siswa</span>
                                                        <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                                                            <div 
                                                                className={cn(
                                                                    "h-full",
                                                                    session.attendancePercentage >= 90 ? "bg-green-500" :
                                                                    session.attendancePercentage >= 75 ? "bg-blue-500" : "bg-amber-500"
                                                                )}
                                                                style={{ width: `${session.attendancePercentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="text-blue-800 hover:text-blue-900 group font-bold"
                                                        onClick={() => handleViewSessionDetail(session)}
                                                    >
                                                        Lihat Absensi
                                                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance Detail Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden max-h-[90vh]">
                    <DialogHeader className="p-6 bg-slate-50 border-b border-slate-100">
                        <div className="flex justify-between items-start pr-8">
                            <div>
                                <DialogTitle className="text-xl font-bold uppercase tracking-tight text-slate-900 flex items-center gap-2">
                                    <ClipboardCheck className="h-5 w-5 text-blue-800" />
                                    Presensi Siswa
                                </DialogTitle>
                                <DialogDescription className="mt-1 font-medium text-slate-500">
                                    Sesi: {selectedSession && new Date(selectedSession.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </DialogDescription>
                            </div>
                            <Badge className="bg-blue-800 text-white border-none px-4 py-1">
                                {selectedSession?.attendanceCount} / {selectedSession?.totalMembers} HADIR
                            </Badge>
                        </div>
                    </DialogHeader>

                    <div className="p-6 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Cari nama atau NIS siswa..."
                                className="pl-9 bg-white border-slate-200"
                                value={studentSearch}
                                onChange={(e) => setStudentSearch(e.target.value)}
                            />
                        </div>

                        <div className="overflow-y-auto max-h-[400px] border border-slate-100 rounded-lg">
                            <Table>
                                <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm font-black uppercase text-[10px]">
                                    <TableRow>
                                        <TableHead>SISWA</TableHead>
                                        <TableHead>NIS / KELAS</TableHead>
                                        <TableHead className="text-center">STATUS</TableHead>
                                        <TableHead>CATATAN</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isDetailLoading ? (
                                        Array(3).fill(0).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell colSpan={4}><Skeleton className="h-10 w-full" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : filteredAttendance.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                                Nama siswa tidak ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredAttendance.map((student) => (
                                            <TableRow key={student.studentId} className="hover:bg-slate-50/50">
                                                <TableCell className="font-bold text-slate-800 text-sm uppercase">{student.studentName}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-semibold text-slate-500">{student.nis}</span>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{student.class}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {student.status === 'hadir' && (
                                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 font-bold uppercase text-[9px] px-2 h-5">
                                                            <CheckCircle2 className="h-3 w-3 mr-1" /> Hadir
                                                        </Badge>
                                                    )}
                                                    {student.status === 'sakit' && (
                                                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 font-bold uppercase text-[9px] px-2 h-5">
                                                            <Info className="h-3 w-3 mr-1" /> Sakit
                                                        </Badge>
                                                    )}
                                                    {student.status === 'izin' && (
                                                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 font-bold uppercase text-[9px] px-2 h-5">
                                                            <Info className="h-3 w-3 mr-1" /> Izin
                                                        </Badge>
                                                    )}
                                                    {student.status === 'alpa' && (
                                                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 font-bold uppercase text-[9px] px-2 h-5">
                                                            <XCircle className="h-3 w-3 mr-1" /> Alpa
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-xs italic text-slate-500 max-w-[150px] truncate">
                                                    {student.note || '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
