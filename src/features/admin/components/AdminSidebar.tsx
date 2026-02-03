'use client';

import React from 'react';
import { SidebarBase, SidebarItem } from '@/features/shared/components/SidebarBase';
import { useRole } from '@/app/context/RoleContext';
import {
    User,
    LayoutDashboard,
    GraduationCap,
    Calendar,
    School,
    BookOpen,
    Users,
    Activity,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
    const { logout } = useRole();

    const menuItems: SidebarItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: 'Akademik',
            href: '/admin/academic',
            icon: GraduationCap,
            subItems: [
                {
                    title: 'Tahun Ajaran',
                    href: '/admin/academic-year',
                    icon: Calendar,
                },
                {
                    title: 'Daftar Kelas',
                    href: '/admin/class',
                    icon: School,
                },
                {
                    title: 'Mata Pelajaran',
                    href: '/admin/subject',
                    icon: BookOpen,
                },
            ],
        },
        {
            title: 'Pengguna',
            href: '/admin/users',
            icon: Users,
            subItems: [
                {
                    title: 'Guru & Staff',
                    href: '/admin/users/teachers',
                    icon: School,
                },
                {
                    title: 'Siswa',
                    href: '/admin/users/students',
                    icon: GraduationCap,
                },
                {
                    title: 'Wali Murid',
                    href: '/admin/users/parents',
                    icon: User,
                },
                {
                    title: 'Tutor Ekskul',
                    href: '/admin/users/tutors',
                    icon: Activity,
                },
            ],
        },
        {
            title: 'Profil Saya',
            href: '/admin/profile',
            icon: User,
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
