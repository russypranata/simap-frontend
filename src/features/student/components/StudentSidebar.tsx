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
    CheckCircle,
    Trophy,
    ClipboardList,
    Award,
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
            title: "Kehadiran",
            href: "/student/attendance",
            icon: CheckCircle,
        },
        {
            title: "Ekstrakurikuler",
            href: "/student/extracurricular",
            icon: Trophy,
        },
        {
            title: "Prestasi",
            href: "/student/achievements",
            icon: Award,
        },
        {
            title: "Catatan Perilaku",
            href: "/student/behavior",
            icon: ClipboardList,
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
