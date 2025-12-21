/**
 * Related applications data for the landing page
 */

import {
    Monitor,
    Globe,
    FileSpreadsheet,
    Library,
} from 'lucide-react';

export interface RelatedApp {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    url: string;
    color: string;
}

export const RELATED_APPS: RelatedApp[] = [
    {
        id: 'lms',
        name: 'E-Learning (LMS)',
        description: 'Platform pembelajaran daring berbasis Moodle. Akses materi, tugas, dan kuis secara online.',
        icon: Monitor,
        url: 'https://lms.fityankuburaya.sch.id/',
        color: 'bg-orange-50 text-orange-600',
    },
    {
        id: 'website',
        name: 'Website Resmi',
        description: 'Portal informasi utama sekolah. Berita, profil, dan agenda kegiatan terbaru.',
        icon: Globe,
        url: '#',
        color: 'bg-blue-50 text-blue-600',
    },
    {
        id: 'ppdb',
        name: 'PPDB Online',
        description: 'Sistem Penerimaan Peserta Didik Baru. Pendaftaran dan seleksi siswa baru.',
        icon: FileSpreadsheet,
        url: '#',
        color: 'bg-green-50 text-green-600',
    },
    {
        id: 'library',
        name: 'Perpustakaan Digital',
        description: 'Akses koleksi buku digital dan katalog perpustakaan sekolah.',
        icon: Library,
        url: '#',
        color: 'bg-purple-50 text-purple-600',
    },
];
