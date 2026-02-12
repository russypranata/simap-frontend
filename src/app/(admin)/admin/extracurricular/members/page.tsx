'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    Award, 
    Users, 
    ChevronLeft, 
    Plus, 
    Search, 
    Trash2, 
    UserPlus,
    CheckCircle2,
    Info,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
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
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { extracurricularService } from '@/features/admin/services/extracurricularService';
import { Extracurricular, ExtracurricularMember } from '@/features/admin/types/extracurricular';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MOCK_STUDENTS } from '@/features/admin/data/mockStudentData';
import { useAcademicYear } from '@/context/AcademicYearContext';
import { MembersPageSkeleton } from '@/features/admin/components/extracurricular';

export default function ExtracurricularMembersPage() {
    const { academicYear: activeYearCtx } = useAcademicYear();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialId = searchParams.get('id');

    const [ekskuls, setEkskuls] = useState<Extracurricular[]>([]);
    const [selectedEkskul, setSelectedEkskul] = useState<Extracurricular | null>(null);
    const [members, setMembers] = useState<ExtracurricularMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMembersLoading, setIsMembersLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [yearFilter, setYearFilter] = useState<string>(activeYearCtx.academicYear);

    // Add Member State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [studentSearchTerm, setStudentSearchTerm] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [availableStudents, setAvailableStudents] = useState(MOCK_STUDENTS);

    useEffect(() => {
        const fetchEkskuls = async () => {
            try {
                setIsLoading(true);
                const data = await extracurricularService.getAll();
                setEkskuls(data);
                
                if (initialId) {
                    const found = data.find(e => e.id === initialId);
                    if (found) setSelectedEkskul(found);
                } else if (data.length > 0) {
                    setSelectedEkskul(data[0]);
                }
            } catch (error) {
                toast.error('Gagal mengambil data ekstrakurikuler');
            } finally {
                setIsLoading(false);
            }
        };
        fetchEkskuls();
    }, [initialId]);

    useEffect(() => {
        if (selectedEkskul) {
            fetchMembers(selectedEkskul.id);
            setStudentSearchTerm('');
            setSelectedStudentId(null);
        }
    }, [selectedEkskul]);

    const fetchMembers = async (id: string) => {
        try {
            setIsMembersLoading(true);
            const data = await extracurricularService.getMembers(id);
            setMembers(data);
        } catch (error) {
            toast.error('Gagal mengambil data anggota');
        } finally {
            setIsMembersLoading(false);
        }
    };

    const handleAddMember = async () => {
        if (!selectedEkskul || !selectedStudentId) return;
        
        const student = MOCK_STUDENTS.find(s => s.id === selectedStudentId);
        if (!student) return;

        // Check if already a member
        if (members.some(m => m.studentId === student.id)) {
            toast.error('Siswa ini sudah terdaftar di ekstrakurikuler ini');
            return;
        }

        try {
            await extracurricularService.addMember(selectedEkskul.id, {
                studentId: student.id,
                studentName: student.name,
                nis: student.nis,
                class: student.className || '7A'
            });
            
            toast.success(`${student.name} berhasil didaftarkan`);
            setIsAddModalOpen(false);
            setSelectedStudentId(null);
            fetchMembers(selectedEkskul.id);
            
            // Update local capacity view
            setSelectedEkskul(prev => prev ? {
                ...prev,
                currentCapacity: prev.currentCapacity + 1
            } : null);
        } catch (error) {
            toast.error('Gagal mendaftarkan siswa');
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!selectedEkskul) return;
        try {
            await extracurricularService.removeMember(selectedEkskul.id, memberId);
            setMembers(prev => prev.filter(m => m.id !== memberId));
            
            // Update selectedEkskul capacity locally
            setSelectedEkskul(prev => prev ? {
                ...prev,
                currentCapacity: prev.currentCapacity - 1
            } : null);
            
            toast.success('Anggota berhasil dihapus');
        } catch (error) {
            toast.error('Gagal menghapus anggota');
        }
    };

    const filteredEkskuls = ekskuls.filter(e => e.academicYearId === yearFilter);

    const filteredMembers = members.filter(m => 
        m.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.nis.includes(searchTerm) ||
        m.class.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredStudents = MOCK_STUDENTS.filter(s => 
        (s.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) || s.nis.includes(studentSearchTerm)) &&
        !members.some(m => m.studentId === s.id) // Hide existing members
    );

    if (isLoading) {
        return <MembersPageSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mb-2 -ml-2 text-slate-500 hover:text-blue-800"
                        onClick={() => router.push('/admin/extracurricular')}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Kembali ke Daftar Ekskul
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                            Keanggotaan{' '}
                        </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                            Ekskul
                        </span>
                    </h1>
                </div>
                
                <div className="flex items-center gap-3">
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-white shadow-sm border-slate-200">
                            <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                            <SelectValue placeholder="Tahun Ajaran" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2025/2026">2025/2026</SelectItem>
                            <SelectItem value="2024/2025">2024/2025</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar: List of Ekskul */}
                <Card className="lg:col-span-1 border-slate-200 transition-shadow hover:shadow-sm">
                    <CardHeader className="pb-3 pt-4 px-4 bg-slate-50/50 border-b border-slate-100 mb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pilih Kegiatan</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 space-y-1">
                        {filteredEkskuls.length === 0 ? (
                            <div className="py-8 text-center px-4 text-slate-900">
                                <p className="text-xs text-slate-400">Tidak ada ekskul di periode ini</p>
                            </div>
                        ) : (
                            filteredEkskuls.map((e) => (
                                <button
                                    key={e.id}
                                    onClick={() => setSelectedEkskul(e)}
                                    className={cn(
                                        "w-full text-left px-3 py-2.5 rounded-md text-sm transition-all flex justify-between items-center group",
                                        selectedEkskul?.id === e.id 
                                            ? "bg-blue-800 text-white shadow-md font-semibold" 
                                            : "hover:bg-slate-100 text-slate-600"
                                    )}
                                >
                                    <span className="truncate pr-2">{e.name}</span>
                                    <Badge className={cn(
                                        "text-[10px] px-1.5 py-0 min-w-[20px] justify-center border-none",
                                        selectedEkskul?.id === e.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                                    )}>
                                        {e.currentCapacity}
                                    </Badge>
                                </button>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Main Content: Members Table */}
                <div className="lg:col-span-3 space-y-6">
                    {selectedEkskul ? (
                        <Card className="border-slate-200 overflow-hidden shadow-sm">
                            <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/30">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-blue-800 text-white shadow-inner">
                                            <Award className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-bold text-slate-900 leading-none">{selectedEkskul.name}</CardTitle>
                                            <CardDescription className="flex items-center gap-2 text-slate-500 mt-2 font-medium">
                                                <Users className="h-4 w-4 text-blue-800" />
                                                Pembina: <span className="text-slate-800 underline decoration-blue-200">{selectedEkskul.mentorName}</span>
                                            </CardDescription>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">OKUPANSI</span>
                                            <span className={cn(
                                                "text-sm font-bold px-2 py-0.5 rounded-md",
                                                selectedEkskul.currentCapacity >= selectedEkskul.maxCapacity ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-800"
                                            )}>
                                                {selectedEkskul.currentCapacity} / {selectedEkskul.maxCapacity}
                                            </span>
                                        </div>
                                        <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden border border-slate-100 shadow-sm">
                                            <div 
                                                className={cn(
                                                    "h-full transition-all duration-700 ease-in-out",
                                                    (selectedEkskul.currentCapacity / selectedEkskul.maxCapacity) >= 1 ? "bg-red-500" :
                                                    (selectedEkskul.currentCapacity / selectedEkskul.maxCapacity) >= 0.8 ? "bg-amber-500" : "bg-blue-600"
                                                )}
                                                style={{ width: `${Math.min((selectedEkskul.currentCapacity / selectedEkskul.maxCapacity) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="p-0">
                                <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-slate-100 bg-slate-50/10">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Cari nama, NIS, atau kelas..."
                                            className="pl-9 w-full"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Button 
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="bg-blue-800 hover:bg-blue-900 shadow-md active:scale-95 transition-all"
                                        disabled={selectedEkskul.currentCapacity >= selectedEkskul.maxCapacity}
                                    >
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Tambah Anggota
                                    </Button>
                                </div>

                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                            <TableRow className="hover:bg-transparent border-none">
                                                <TableHead className="w-[80px] px-6 py-4 font-semibold text-xs uppercase tracking-wider text-slate-700">NO</TableHead>
                                                <TableHead className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-slate-700">NAMA SISWA</TableHead>
                                                <TableHead className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-slate-700">NIS / KELAS</TableHead>
                                                <TableHead className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-slate-700">TGL BERGABUNG</TableHead>
                                                <TableHead className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right pr-6 text-slate-700">AKSI</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isMembersLoading ? (
                                                Array(3).fill(0).map((_, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell colSpan={5}><Skeleton className="h-12 w-full" /></TableCell>
                                                    </TableRow>
                                                ))
                                            ) : filteredMembers.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-72 text-center">
                                                        <div className="flex flex-col items-center justify-center text-slate-400 animate-in fade-in zoom-in duration-300">
                                                            <div className="bg-slate-100 p-5 rounded-full mb-4">
                                                                <Users className="h-10 w-10 opacity-40 text-slate-400" />
                                                            </div>
                                                            <p className="font-semibold text-slate-500">Belum ada anggota di ekstrakurikuler ini</p>
                                                            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Silakan klik tombol di bawah untuk mulai menambah anggota.</p>
                                                            <Button 
                                                                variant="link" 
                                                                className="text-blue-800 font-bold mt-2"
                                                                onClick={() => setIsAddModalOpen(true)}
                                                            >
                                                                <Plus className="h-4 w-4 mr-1" />
                                                                Tambah Baru
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredMembers.map((member, index) => (
                                                    <TableRow key={member.id} className="hover:bg-slate-50/60 transition-colors group border-b border-slate-50">
                                                        <TableCell className="font-medium text-slate-400 pl-6 py-4">{(index + 1).toString().padStart(2, '0')}</TableCell>
                                                        <TableCell className="font-semibold text-slate-900 text-sm uppercase tracking-tight group-hover:text-blue-800 transition-colors py-4">{member.studentName}</TableCell>
                                                        <TableCell className="py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-semibold text-slate-500">{member.nis}</span>
                                                                <Badge variant="secondary" className="w-fit text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 border-none font-medium mt-1">
                                                                    {member.class}
                                                                </Badge>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-slate-500 font-medium text-sm py-4">
                                                            {new Date(member.joinDate).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })}
                                                        </TableCell>
                                                        <TableCell className="text-right pr-6 py-4">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                className="text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-full h-8 w-8 p-0"
                                                                onClick={() => handleRemoveMember(member.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50/50 border-t border-slate-100 py-3 flex justify-between items-center px-6">
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                    Total {filteredMembers.length} Personel
                                </p>
                                <Badge variant="outline" className="text-[9px] text-slate-400 border-slate-200 bg-white">
                                    LIVE SYNC
                                </Badge>
                            </CardFooter>
                        </Card>
                    ) : (
                        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 h-[500px] flex flex-col items-center justify-center p-12 text-center animate-pulse">
                            <div className="bg-white p-6 rounded-full shadow-sm mb-6 border border-slate-100">
                                <Award className="h-10 w-10 text-slate-200" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Pilih Kegiatan</h3>
                            <p className="text-slate-400 max-w-xs mt-3 text-sm leading-relaxed">
                                Pilih salah satu kegiatan ekstrakurikuler di panel sebelah kiri untuk memproses pengelolaan anggota.
                            </p>
                        </Card>
                    )}
                </div>
            </div>

            {/* Add Member Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={(open) => {
                setIsAddModalOpen(open);
                if (!open) {
                    setStudentSearchTerm('');
                    setSelectedStudentId(null);
                }
            }}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-6 bg-blue-800 text-white">
                        <DialogTitle className="text-2xl font-bold">Tambah Anggota Ekskul</DialogTitle>
                        <DialogDescription className="text-blue-100 mt-1 opacity-90">
                            Pilih siswa dari database untuk didaftarkan ke <strong>{selectedEkskul?.name}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="p-6 space-y-5">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Database Siswa</label>
                                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">{filteredStudents.length} Tersedia</span>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input 
                                    placeholder="Cari nama atau NIS siswa..." 
                                    className="pl-9 border-slate-200 focus:ring-blue-800"
                                    value={studentSearchTerm}
                                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="border border-slate-100 rounded-xl max-h-[250px] overflow-y-auto bg-slate-50/30 p-2 space-y-1 custom-scrollbar shadow-inner">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map(student => (
                                        <div 
                                            key={student.id} 
                                            onClick={() => setSelectedStudentId(student.id)}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border",
                                                selectedStudentId === student.id 
                                                    ? "bg-blue-50 border-blue-200 shadow-sm" 
                                                    : "bg-white border-transparent hover:border-slate-200 hover:bg-slate-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold",
                                                    selectedStudentId === student.id ? "bg-blue-800 text-white" : "bg-slate-100 text-slate-500"
                                                )}>
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className={cn(
                                                        "text-sm font-bold uppercase tracking-tight",
                                                        selectedStudentId === student.id ? "text-blue-900" : "text-slate-800"
                                                    )}>{student.name}</p>
                                                    <p className="text-[10px] font-medium text-slate-500">{student.nis} • {student.className || '7A'}</p>
                                                </div>
                                            </div>
                                            {selectedStudentId === student.id ? (
                                                <CheckCircle2 className="h-5 w-5 text-blue-800" />
                                            ) : (
                                                <div className="h-5 w-5 rounded-full border border-slate-200 group-hover:border-slate-300" />
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center text-slate-400">
                                        <Search className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                        <p className="text-xs font-medium">Siswa tidak ditemukan</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex gap-3 shadow-sm">
                            <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                                <Info className="h-4 w-4 text-amber-600" />
                            </div>
                            <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                                <strong>Penting:</strong> Pastikan jadwal ekskul <span className="underline decoration-amber-300">{selectedEkskul?.day} ({selectedEkskul?.time})</span> tidak mengalami bentrok dengan kegiatan yang sudah diikuti siswa sebelumnya.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="p-6 bg-slate-50 flex gap-3 border-t border-slate-100">
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1 border-slate-200 shadow-sm font-bold text-slate-600 text-[11px] uppercase tracking-wider">
                            Batalkan
                        </Button>
                        <Button 
                            className="flex-1 bg-blue-800 hover:bg-blue-900 shadow-md shadow-blue-200 font-bold text-[11px] uppercase tracking-wider" 
                            disabled={!selectedStudentId}
                            onClick={handleAddMember}
                        >
                            Konfirmasi Registrasi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
