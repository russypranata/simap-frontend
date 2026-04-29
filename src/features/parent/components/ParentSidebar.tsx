"use client";

import React from "react";
import { SidebarBase, SidebarItem } from "@/features/shared/components/SidebarBase";
import { useRole } from "@/app/context/RoleContext";
import {
    LayoutDashboard,
    Calendar,
    CalendarDays,
    GraduationCap,
    Award,
    CheckCircle,
    Moon, // Using Moon for Prayer, alternative: Clock
    Timer, // Using Timer for Keterlambatan Pagi
    CalendarCheck, // Added CalendarCheck icon
    Trophy,
    ClipboardList,
    User,
} from "lucide-react";

export const ParentSidebar: React.FC = () => {
    const { logout } = useRole();

    const menuItems: SidebarItem[] = [
        {
            title: "Dashboard",
            href: "/parent/dashboard",
            icon: LayoutDashboard,
        },
        // Akademik Anak Group
        {
            title: "Akademik Anak",
            href: "/parent/academic",
            icon: GraduationCap,
            isGroup: true,
            subItems: [
                {
                    title: "Kalender Akademik",
                    href: "/parent/academic/calendar",
                    icon: CalendarDays,
                },
                {
                    title: "Jadwal Pelajaran",
                    href: "/parent/academic/schedule",
                    icon: Calendar,
                },
                {
                    title: "Nilai & Rapor",
                    href: "/parent/academic/grades",
                    icon: GraduationCap,
                },
                {
                    title: "Prestasi",
                    href: "/parent/academic/achievements",
                    icon: Award,
                },
            ],
        },
        // Kehadiran Anak Group
        {
            title: "Kehadiran Anak",
            href: "/parent/attendance",
            icon: CheckCircle,
            isGroup: true,
            subItems: [
                {
                    title: "Keterlambatan Pagi",
                    href: "/parent/attendance/morning",
                    icon: Timer,
                },
                {
                    title: "Presensi Harian",
                    href: "/parent/attendance/daily",
                    icon: CalendarCheck,
                },
                {
                    title: "Presensi Mapel",
                    href: "/parent/attendance/subject",
                    icon: CheckCircle,
                },
                {
                    title: "Presensi Sholat",
                    href: "/parent/attendance/prayer",
                    icon: Moon,
                },
            ],
        },
        // Ekstrakurikuler
        {
            title: "Ekstrakurikuler",
            href: "/parent/extracurricular",
            icon: Trophy,
        },
        // Catatan
        {
            title: "Catatan Perilaku",
            href: "/parent/behavior",
            icon: ClipboardList,
        },
        // Profil Saya
        {
            title: "Profil Saya",
            href: "/parent/profile",
            icon: User,
        },
    ];

    return (
        <SidebarBase
            menuItems={menuItems}
            onLogout={logout}
            defaultDashboardHref="/parent/dashboard"
        />
    );
};
