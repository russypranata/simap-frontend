"use client";

import React from "react";
import { SidebarBase, SidebarItem } from "@/features/shared/components/SidebarBase";
import { useRole } from "@/app/context/RoleContext";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    Calendar,
    CalendarDays,
    Home,
    FileText,
    User,
    ClipboardList,
    ClipboardCheck,
} from "lucide-react";

export const TeacherSidebar: React.FC = () => {
    const { logout, isHomeroomTeacher, isPiketTeacher } = useRole();

    const menuItems: SidebarItem[] = [
        {
            title: "Dashboard",
            href: "/teacher/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Kalender Akademik",
            href: "/teacher/academic/calendar",
            icon: CalendarDays,
        },
        {
            title: "Jurnal Mengajar",
            href: "/teacher/journal",
            icon: BookOpen,
        },
        {
            title: "Presensi Mapel",
            href: "/teacher/attendance",
            icon: ClipboardCheck,
        },
        {
            title: "Nilai Siswa",
            href: "/teacher/grades",
            icon: GraduationCap,
        },
        {
            title: "Jadwal Mengajar",
            href: "/teacher/schedule",
            icon: Calendar,
        },
        {
            title: "Catatan Perilaku",
            href: "/teacher/student-behavior",
            icon: ClipboardList,
        },
        {
            title: "Wali Kelas",
            href: "/teacher/homeroom",
            icon: Home,
            condition: isHomeroomTeacher,
        },
        {
            title: "Guru Piket",
            href: "/teacher/picket",
            icon: Users,
            condition: isPiketTeacher,
        },
        {
            title: "Administrasi",
            href: "/teacher/documents",
            icon: FileText,
        },
        {
            title: "Profil",
            href: "/teacher/profile",
            icon: User,
        },
    ];

    return (
        <SidebarBase
            menuItems={menuItems}
            onLogout={logout}
            defaultDashboardHref="/teacher/dashboard"
        />
    );
};
