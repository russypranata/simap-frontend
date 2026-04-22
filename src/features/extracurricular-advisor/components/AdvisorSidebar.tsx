"use client";

import React from "react";
import { SidebarBase, SidebarItem } from "@/features/shared/components/SidebarBase";
import { useRole } from "@/app/context/RoleContext";
import {
    LayoutDashboard,
    Users,
    CheckCircle,
    User,
    Star,
    ClipboardList,
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
            title: "Daftar Anggota",
            href: "/extracurricular-advisor/members",
            icon: Users,
        },
        {
            title: "Presensi Kegiatan",
            href: "/extracurricular-advisor/attendance",
            icon: CheckCircle,
        },
        {
            title: "Penilaian",
            href: "/extracurricular-advisor/assessments",
            icon: Star,
        },
        {
            title: "Tugas",
            href: "/extracurricular-advisor/assignments",
            icon: ClipboardList,
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
