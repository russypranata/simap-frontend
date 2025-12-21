"use client";

import React from "react";
import { SidebarBase, SidebarItem } from "@/features/shared/components/SidebarBase";
import { useRole } from "@/app/context/RoleContext";
import {
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    Calendar,
    Megaphone,
    FileText,
    User,
} from "lucide-react";

export const StudentSidebar: React.FC = () => {
    const { logout } = useRole();

    const menuItems: SidebarItem[] = [
        {
            title: "Dashboard",
            href: "/student/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Jadwal Pelajaran",
            href: "/student/schedule",
            icon: Calendar,
        },
        {
            title: "Nilai & Rapor",
            href: "/student/grades",
            icon: GraduationCap,
        },
        {
            title: "Tugas & PR",
            href: "/student/assignments",
            icon: FileText,
            badge: "3",
        },
        {
            title: "Perpustakaan",
            href: "/student/library",
            icon: BookOpen,
        },
        {
            title: "Pengumuman",
            href: "/student/announcements",
            icon: Megaphone,
        },
        {
            title: "Profil Saya",
            href: "/student/profile",
            icon: User,
        },
    ];

    return (
        <SidebarBase
            menuItems={menuItems}
            onLogout={logout}
            defaultDashboardHref="/student/dashboard"
        />
    );
};
