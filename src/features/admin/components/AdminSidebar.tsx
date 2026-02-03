'use client';

import React from 'react';
import { SidebarBase, SidebarItem } from '@/features/shared/components/SidebarBase';
import { useRole } from '@/app/context/RoleContext';
import {
    LayoutDashboard,
    GraduationCap,
    Calendar,
    BookOpen,
    ClipboardList,
    School,
    Users,
    Briefcase,
    Shield,
    UserCog,
    FileText,
    CalendarDays,
    ClipboardCheck,
    Printer,
    ArrowUpCircle,
    UserCheck,
    UserPlus,
    ArrowLeftRight,
    Award,
    Contact,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
    const { logout } = useRole();

    const menuItems: SidebarItem[] = [
        // GENERAL
        {
            title: 'General',
            href: '#general',
            icon: LayoutDashboard,
            sectionHeader: true,
        },
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutDashboard,
        },

        // AKADEMIK
        {
            title: 'Akademik',
            href: '#akademik',
            icon: GraduationCap,
            sectionHeader: true,
        },
        {
            title: 'Data Kurikulum',
            href: '/admin/curriculum-data',
            icon: BookOpen,
            subItems: [
                {
                    title: 'Tahun Ajaran',
                    href: '/admin/academic-year',
                    icon: Calendar,
                },
                {
                    title: 'Mata Pelajaran',
                    href: '/admin/subject',
                    icon: BookOpen,
                },
                {
                    title: 'Kurikulum',
                    href: '/admin/curriculum',
                    icon: FileText,
                },
            ],
        },
        {
            title: 'Jadwal & KBM',
            href: '/admin/schedule-kbm',
            icon: Calendar,
            subItems: [
                {
                    title: 'Jadwal Pelajaran',
                    href: '/admin/schedule',
                    icon: Calendar,
                },
                {
                    title: 'Kalender Akademik',
                    href: '/admin/schedule/calendar',
                    icon: CalendarDays,
                },
                {
                    title: 'Presensi',
                    href: '/admin/attendance',
                    icon: ClipboardCheck,
                },
            ],
        },
        {
            title: 'Penilaian',
            href: '/admin/assessments',
            icon: ClipboardList,
            subItems: [
                {
                    title: 'Input Nilai',
                    href: '/admin/assessment',
                    icon: FileText,
                },
                {
                    title: 'Cetak Rapor',
                    href: '/admin/assessment/report-card',
                    icon: Printer,
                },
            ],
        },

        // KEMANASISWAAN
        {
            title: 'Kemanasiswaan',
            href: '#kemanasiswaan',
            icon: School,
            sectionHeader: true,
        },
        {
            title: 'Manajemen Kelas',
            href: '/admin/class-management',
            icon: School,
            subItems: [
                {
                    title: 'Daftar Kelas',
                    href: '/admin/class',
                    icon: School,
                },
                {
                    title: 'Wali Kelas',
                    href: '/admin/class-management/homeroom',
                    icon: UserCheck,
                },
                {
                    title: 'Kenaikan Kelas',
                    href: '/admin/class-management/promotion',
                    icon: ArrowUpCircle,
                },
                {
                    title: 'Penempatan Kelas',
                    href: '/admin/class-management/placement',
                    icon: Users,
                },
            ],
        },

        // PENGGUNA
        {
            title: 'Pengguna',
            href: '#pengguna',
            icon: Users,
            sectionHeader: true,
        },
        {
            title: 'Data Siswa',
            href: '/admin/users-student',
            icon: Users,
            subItems: [
                {
                    title: 'Siswa Aktif',
                    href: '/admin/users/students',
                    icon: GraduationCap,
                },
                {
                    title: 'PPDB / Calon',
                    href: '/admin/users/ppdb',
                    icon: UserPlus,
                },
                {
                    title: 'Mutasi',
                    href: '/admin/users/mutation',
                    icon: ArrowLeftRight,
                },
                {
                    title: 'Alumni',
                    href: '/admin/users/alumni',
                    icon: Award,
                },
            ],
        },
        {
            title: 'Data Pegawai',
            href: '/admin/users-staff',
            icon: Briefcase,
            subItems: [
                {
                    title: 'Guru / Pendidik',
                    href: '/admin/users/teachers',
                    icon: UserCog,
                },
                {
                    title: 'Tendik / Staf',
                    href: '/admin/users/staff',
                    icon: Contact,
                },
                {
                    title: 'Wali Murid',
                    href: '/admin/users/parents',
                    icon: Users,
                },
            ],
        },
        {
            title: 'Hak Akses',
            href: '/admin/access-control',
            icon: Shield,
            subItems: [
                {
                    title: 'User Management',
                    href: '/admin/users/management',
                    icon: Shield,
                },
            ],
        },
    ];

    return (
        <SidebarBase
            menuItems={menuItems}
            onLogout={logout}
            defaultDashboardHref="/admin/dashboard"
        />
    );
};
