import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { TeachingJournal, TeacherClass } from '../../types/teacher';
import { formatDate } from '@/features/shared/utils/dateFormatter';

interface JournalReportPreviewProps {
    type: 'monthly' | 'semester';
    data: TeachingJournal[];
    classes: TeacherClass[];
    filters: {
        month?: string;
        year?: string;
        classId?: string;
        subject?: string;
        academicYear?: string;
        semester?: string;
    };
    onClose: () => void;
}

export const JournalReportPreview: React.FC<JournalReportPreviewProps> = ({
    type,
    data,
    classes,
    filters,
    onClose,
}) => {
    const getMonthName = (monthIndex: string) => {
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return months[parseInt(monthIndex)] || '';
    };

    const getClassName = (classId: string) => {
        if (classId === 'all' || !classId) return 'Semua Kelas';
        return classes.find((c) => c.id === classId)?.name || classId;
    };

    const currentClass = getClassName(filters.classId || 'all');
    const currentSubject = filters.subject === 'all' || !filters.subject ? 'Semua Mata Pelajaran' : filters.subject;

    const reportTitle = type === 'monthly'
        ? `Laporan Jurnal Mengajar Bulan ${getMonthName(filters.month || '0')} ${filters.year}`
        : `Laporan Jurnal Mengajar Semester ${filters.semester} ${filters.academicYear}`;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200 relative bg-gray-50/50 min-h-screen">
            {/* Toolbar Header */}
            <div className="sticky top-0 z-50 bg-white border-b px-6 py-4 flex items-center justify-between no-print shadow-sm mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        size="icon"
                        onClick={onClose}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm h-8 w-8 rounded-full p-0"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="h-6 w-[1px] bg-gray-200" />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Preview Laporan</h2>
                        <p className="text-xs text-muted-foreground">
                            {type === 'monthly'
                                ? `Periode: ${getMonthName(filters.month || '0')} ${filters.year}`
                                : `Periode: Semester ${filters.semester} ${filters.academicYear}`
                            }
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handlePrint} className="gap-2 shadow-sm">
                        <Printer className="h-4 w-4" />
                        Cetak / Simpan PDF
                    </Button>
                </div>
            </div>

            <div className="overflow-auto p-4 md:p-8 flex justify-center">
                {/* A4 Paper Container */}
                <div className="bg-white shadow-lg p-8 md:p-12 w-full max-w-[210mm] min-h-[297mm] text-sm text-gray-900 mx-auto print:shadow-none print:p-0 print:w-full print:max-w-none">
                    {/* Header */}
                    <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
                        <h1 className="text-xl font-bold uppercase tracking-wide">Laporan Jurnal Kegiatan Belajar Mengajar</h1>
                        <h2 className="text-lg font-semibold mt-1">SMA Unggulan Mawar Putih</h2>
                        <p className="text-sm mt-1">Jl. Pendidikan No. 123, Kota Pelajar, Indonesia</p>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 text-sm">
                        <div className="flex">
                            <span className="w-32 font-semibold">Nama Guru</span>
                            <span>: Budi Santoso, S.Pd.</span> {/* Mocked logged in teacher */}
                        </div>
                        <div className="flex">
                            <span className="w-32 font-semibold">Tahun Ajaran</span>
                            <span>: {filters.academicYear || '2025/2026'}</span>
                        </div>
                        <div className="flex">
                            <span className="w-32 font-semibold">NIP</span>
                            <span>: 19850115 201001 1 005</span>
                        </div>
                        <div className="flex">
                            <span className="w-32 font-semibold">Semester</span>
                            <span>: {filters.semester || 'Ganjil'}</span>
                        </div>
                        <div className="flex">
                            <span className="w-32 font-semibold">Mata Pelajaran</span>
                            <span>: {currentSubject}</span>
                        </div>
                        <div className="flex">
                            <span className="w-32 font-semibold">Kelas</span>
                            <span>: {currentClass}</span>
                        </div>
                        {type === 'monthly' && (
                            <div className="flex">
                                <span className="w-32 font-semibold">Bulan</span>
                                <span>: {getMonthName(filters.month || '0')} {filters.year}</span>
                            </div>
                        )}
                    </div>

                    {/* Content Table */}
                    <div className="w-full mb-8">
                        <table className="w-full border-collapse border border-gray-800 text-xs">
                            <thead>
                                <tr className="bg-gray-100 text-center">
                                    <th className="border border-gray-800 p-2 w-10">No</th>
                                    <th className="border border-gray-800 p-2 w-24">Hari/Tanggal</th>
                                    <th className="border border-gray-800 p-2 w-20">Kelas</th>
                                    <th className="border border-gray-800 p-2 w-16">Jam Ke</th>
                                    <th className="border border-gray-800 p-2">Materi Pokok & Indikator</th>
                                    <th className="border border-gray-800 p-2 w-24">Metode & Media</th>
                                    <th className="border border-gray-800 p-2 w-24">Kehadiran (H/S/I/A)</th>
                                    <th className="border border-gray-800 p-2 w-24">Paraf</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0 ? (
                                    data.map((journal, index) => {
                                        // Find class name from ID if needed, though journal.class usually stores name or ID. 
                                        // Assuming journal.class stores "X-A" or similar readable name based on mock data, 
                                        // but checks logic if it stores ID.
                                        const className = classes.find(c => c.id === journal.class)?.name || journal.class;

                                        return (
                                            <tr key={journal.id} className="break-inside-avoid">
                                                <td className="border border-gray-800 p-2 text-center align-top">{index + 1}</td>
                                                <td className="border border-gray-800 p-2 align-top">
                                                    {formatDate(new Date(journal.date), 'dd/MM/yyyy')}
                                                </td>
                                                <td className="border border-gray-800 p-2 text-center align-top">{className}</td>
                                                <td className="border border-gray-800 p-2 text-center align-top">{journal.lessonHour}</td>
                                                <td className="border border-gray-800 p-2 align-top">
                                                    <div className="font-semibold">{journal.material}</div>
                                                    <div className="text-gray-600 mt-1">{journal.learningObjective || journal.topic}</div>
                                                </td>
                                                <td className="border border-gray-800 p-2 align-top">
                                                    <div>{journal.teachingMethod}</div>
                                                    <div className="text-gray-500 text-[10px] mt-1 italic">{journal.media}</div>
                                                </td>
                                                <td className="border border-gray-800 p-2 text-center align-top">
                                                    {journal.attendance.present}/{journal.attendance.sick}/{journal.attendance.permit}/{journal.attendance.absent}
                                                </td>
                                                <td className="border border-gray-800 p-2 align-top"></td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="border border-gray-800 p-8 text-center text-gray-500 italic">
                                            Tidak ada data jurnal untuk periode ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Signature Section */}
                    <div className="flex justify-between mt-12 break-inside-avoid">
                        <div className="text-center w-64">
                            <p className="mb-20">Mengetahui,<br />Kepala Sekolah</p>
                            <p className="font-semibold underline">Dr. H. Ahmad Dahlan, M.Pd.</p>
                            <p>NIP. 19700101 199503 1 001</p>
                        </div>
                        <div className="text-center w-64">
                            <p className="mb-20">Jakarta, {formatDate(new Date(), 'dd MMMM yyyy')}<br />Guru Mata Pelajaran</p>
                            <p className="font-semibold underline">Budi Santoso, S.Pd.</p>
                            <p>NIP. 19850115 201001 1 005</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @media print {
          @page {
            margin: 10mm;
            size: A4 portrait;
          }
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          /* Hide other UI elements */
          header, nav, aside, footer, .fixed, .sticky {
            display: none !important;
          }
        }
      `}</style>
        </div>
    );
};
