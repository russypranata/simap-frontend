/**
 * Features data for the landing page
 */

import {
    Users,
    UserRound,
    FileSpreadsheet,
    BookOpen,
    School,
} from 'lucide-react';

export interface Feature {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: 'blue' | 'yellow';
    items: string[];
}

export const FEATURES: Feature[] = [
    {
        id: 'student-management',
        name: 'Manajemen Siswa',
        description: 'Kelola data siswa secara komprehensif',
        icon: Users,
        color: 'blue',
        items: [
            'Database siswa bulanan',
            'Profil & prestasi siswa',
            'Riwayat kelakuan',
            'Pencatatan prestasi',
        ],
    },
    {
        id: 'attendance',
        name: 'Absensi & Monitoring',
        description: 'Sistem absensi digital yang komprehensif',
        icon: UserRound,
        color: 'yellow',
        items: [
            'Absen pagi & harian',
            'Ringkasan kehadiran',
            'Monitoring sholat',
            'Kegiatan ekskul',
        ],
    },
    {
        id: 'academic-records',
        name: 'Raport & Nilai',
        description: 'Sistem penilaian dan pelaporan akademik',
        icon: FileSpreadsheet,
        color: 'blue',
        items: [
            'Pengelolaan nilai terstruktur',
            'Manajemen remedial',
            'E-rapor digital',
            'Rapor Quran (Tahfidz)',
        ],
    },
    {
        id: 'teaching-docs',
        name: 'Administrasi Guru',
        description: 'Dokumentasi kegiatan mengajar',
        icon: BookOpen,
        color: 'yellow',
        items: [
            'Jurnal mengajar harian',
            'Laporan tugas piket',
            'Dokumentasi digital',
            'Arsip pembelajaran',
        ],
    },
    {
        id: 'class-admin',
        name: 'Administrasi Walas',
        description: 'Administrasi wali kelas',
        icon: School,
        color: 'blue',
        items: [
            'Pengelolaan kelas',
            'Arsip rapor digital',
            'Transkrip nilai (E-ijazah)',
            'Monitoring kelas',
        ],
    },
];
