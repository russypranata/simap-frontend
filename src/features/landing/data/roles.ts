/**
 * User roles data for the landing page
 */

import {
    BookOpen,
    Clock,
    UserRound,
    Star,
    Sparkles,
    User,
    GraduationCap,
    Shield,
    Users,
} from 'lucide-react';

export interface Role {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    borderColor: string;
    gradient: string;
}

export const ROLES: Role[] = [
    {
        id: 'guru_mapel',
        title: 'Guru Mapel',
        description:
            'Pengelola pembelajaran & penilaian. Presensi mapel, jurnal, nilai (formatif/sumatif), & administrasi (ATP).',
        icon: BookOpen,
        color: 'bg-blue-50 text-blue-600',
        borderColor: 'group-hover:border-blue-200',
        gradient: 'from-blue-500/10 to-transparent',
    },
    {
        id: 'guru_piket',
        title: 'Guru Piket',
        description:
            'Garda kedisiplinan. Mencatat kehadiran pagi, keterlambatan, & monitoring sholat siswa.',
        icon: Clock,
        color: 'bg-orange-50 text-orange-600',
        borderColor: 'group-hover:border-orange-200',
        gradient: 'from-orange-500/10 to-transparent',
    },
    {
        id: 'walas',
        title: 'Wali Kelas',
        description:
            'Orang tua di sekolah. Monitoring track record siswa, kehadiran, & penanganan masalah kelas.',
        icon: UserRound,
        color: 'bg-emerald-50 text-emerald-600',
        borderColor: 'group-hover:border-emerald-200',
        gradient: 'from-emerald-500/10 to-transparent',
    },
    {
        id: 'ekskul',
        title: 'Pembina Ekskul',
        description:
            'Mengembangkan bakat minat. Presensi & pengajuan kegiatan ekstrakurikuler siswa.',
        icon: Star,
        color: 'bg-violet-50 text-violet-600',
        borderColor: 'group-hover:border-violet-200',
        gradient: 'from-violet-500/10 to-transparent',
    },
    {
        id: 'mutamayizin',
        title: 'PJ Mutamayizin',
        description:
            'Pengelola program unggulan. Manajemen data prestasi & kegiatan siswa juara.',
        icon: Sparkles,
        color: 'bg-pink-50 text-pink-600',
        borderColor: 'group-hover:border-pink-200',
        gradient: 'from-pink-500/10 to-transparent',
    },
    {
        id: 'siswa',
        title: 'Siswa',
        description:
            'End-user aktif. Pantau nilai, pelanggaran, e-rapor, & track record pribadi secara mandiri.',
        icon: User,
        color: 'bg-cyan-50 text-cyan-600',
        borderColor: 'group-hover:border-cyan-200',
        gradient: 'from-cyan-500/10 to-transparent',
    },
    {
        id: 'kepala_sekolah',
        title: 'Kepala Sekolah',
        description:
            'pimpinan sekolah. Monitoring kinerja sekolah, persetujuan, & evaluasi guru.',
        icon: GraduationCap,
        color: 'bg-indigo-50 text-indigo-600',
        borderColor: 'group-hover:border-indigo-200',
        gradient: 'from-indigo-500/10 to-transparent',
    },
    {
        id: 'admin',
        title: 'Administrator',
        description:
            'Teknis & Data. Manajemen user, database siswa/guru, & konfigurasi sistem sekolah.',
        icon: Shield,
        color: 'bg-slate-50 text-slate-700',
        borderColor: 'group-hover:border-slate-300',
        gradient: 'from-slate-500/10 to-transparent',
    },
    {
        id: 'orang_tua',
        title: 'Orang Tua',
        description:
            'Partner Sekolah. Monitoring kehadiran, nilai, & perkembangan karakter anak secara real-time.',
        icon: Users,
        color: 'bg-teal-50 text-teal-600',
        borderColor: 'group-hover:border-teal-200',
        gradient: 'from-teal-500/10 to-transparent',
    },
];
