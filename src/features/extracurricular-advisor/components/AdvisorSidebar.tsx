"use client";

import React from "react";
import { SidebarBase, SidebarItem } from "@/features/shared/components/SidebarBase";
import { useRole } from "@/app/context/RoleContext";
import {
    LayoutDashboard,
    Users,
    CheckCircle,
    Calendar,
    Megaphone,
    User,
} from "lucide-react";

export const AdvisorSidebar: React.FC = () => {
    const { logout } = useRole();

    const menuItems: SidebarItem[] = [
        {
            title: "Dashboard",
            href: "/extracurricular-advisor/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Kelola Anggota",
            href: "/extracurricular-advisor/members",
            icon: Users,
        },
        {
            title: "Presensi Kegiatan",
            href: "/extracurricular-advisor/attendance",
            icon: CheckCircle,
        },
        {
            title: "Jadwal Kegiatan",
            href: "/extracurricular-advisor/schedule",
            icon: Calendar,
        },
        {
            title: "Pengumuman",
            href: "/extracurricular-advisor/announcements",
            icon: Megaphone,
        },
        {
            title: "Profil",
            href: "/extracurricular-advisor/profile",
            icon: User,
        },
    ];

    return (
        <SidebarBase
            menuItems={menuItems}
            onLogout={logout}
            defaultDashboardHref="/extracurricular-advisor/dashboard"
        />
    );
};
