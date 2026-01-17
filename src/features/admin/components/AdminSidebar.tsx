'use client';

import React from 'react';
import { SidebarBase, SidebarItem } from '@/features/shared/components/SidebarBase';
import { useRole } from '@/app/context/RoleContext';
import {
    LayoutDashboard,
    User,
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
