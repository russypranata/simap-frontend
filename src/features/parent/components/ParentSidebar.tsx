"use client";

import React from "react";
import { SidebarBase, SidebarItem } from "@/features/shared/components/SidebarBase";
import { useRole } from "@/app/context/RoleContext";
import {
    LayoutDashboard,
    Calendar,
    GraduationCap,
    Award,
    CheckCircle,
    Moon, // Using Moon for Prayer, alternative: Clock
    Sun, // Added Sun icon
    CalendarCheck, // Added CalendarCheck icon
    Trophy,
    ClipboardList,
    Megaphone,
    User,
    Pencil,
    Lock,
    Settings,
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
                    title: "Kehadiran Pagi",
                    href: "/parent/attendance/morning",
                    icon: Sun, // Changed icon for Morning Attendance
                },
                {
                    title: "Presensi Harian",
                    href: "/parent/attendance/daily",
                    icon: CalendarCheck, // New Icon for Daily Attendance
                },
                {
                    title: "Presensi Mapel",
                    href: "/parent/attendance/subject",
                    icon: CheckCircle, // Kept CheckCircle for Subject Attendance
                },
                {
                    title: "Presensi Sholat",
                    href: "/parent/attendance/prayer",
                    icon: Moon,
                },
                {
                    title: "Ekstrakurikuler",
                    href: "/parent/attendance/extracurricular",
                    icon: Trophy,
                },
            ],
        },
        // Catatan Group
        {
            title: "Catatan",
            href: "/parent/behavior",
            icon: ClipboardList,
            isGroup: true,
            subItems: [
                {
                    title: "Catatan Perilaku",
                    href: "/parent/behavior",
                    icon: ClipboardList,
                },
            ],
        },
        // Informasi Group
        {
            title: "Informasi",
            href: "/parent/announcements",
            icon: Megaphone,
            isGroup: true,
            subItems: [
                {
                    title: "Pengumuman",
                    href: "/parent/announcements",
                    icon: Megaphone,
                },
            ],
        },
        // Pengaturan Group
        {
            title: "Pengaturan",
            href: "/parent/settings",
            icon: Settings,
            isGroup: true,
            subItems: [
                {
                    title: "Profil Saya",
                    href: "/parent/settings/profile",
                    icon: User,
                },
                {
                    title: "Edit Profil",
                    href: "/parent/settings/edit-profile",
                    icon: Pencil,
                },
                {
                    title: "Ubah Kata Sandi",
                    href: "/parent/settings/change-password",
                    icon: Lock,
                },
            ],
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
