"use client";

import React from "react";
import { SidebarBase, SidebarItem } from "@/features/shared/components/SidebarBase";
import { useRole } from "@/app/context/RoleContext";
import {
    LayoutDashboard,
    GraduationCap,
    Calendar,
    User,
    CheckCircle,
    Trophy,
    ClipboardList,
    Award,
    Timer,
    CalendarCheck,
    Moon,
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
            title: "Akademik",
            href: "/student/academic",
            icon: GraduationCap,
            isGroup: true,
            subItems: [
                { title: "Jadwal Pelajaran", href: "/student/schedule", icon: Calendar },
                { title: "Nilai & Rapor", href: "/student/grades", icon: GraduationCap },
                { title: "Prestasi", href: "/student/achievements", icon: Award },
            ],
        },
        {
            title: "Kehadiran",
            href: "/student/attendance",
            icon: CheckCircle,
            isGroup: true,
            subItems: [
                { title: "Keterlambatan Pagi", href: "/student/attendance/morning", icon: Timer },
                { title: "Presensi Harian", href: "/student/attendance/daily", icon: CalendarCheck },
                { title: "Presensi Mapel", href: "/student/attendance/subject", icon: CheckCircle },
                { title: "Presensi Sholat", href: "/student/attendance/prayer", icon: Moon },
            ],
        },
        {
            title: "Ekstrakurikuler",
            href: "/student/extracurricular",
            icon: Trophy,
        },
        {
            title: "Catatan Perilaku",
            href: "/student/behavior",
            icon: ClipboardList,
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
