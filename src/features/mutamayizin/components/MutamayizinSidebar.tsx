"use client";

import React from "react";
import { SidebarBase, SidebarItem } from "@/features/shared/components/SidebarBase";
import { useRole } from "@/app/context/RoleContext";
import {
    LayoutDashboard,
    Award,
    CalendarCheck,
    Users,
    User,
    Star,
    FileSpreadsheet,
    Briefcase,
} from "lucide-react";

export const MutamayizinSidebar: React.FC = () => {
    const { logout } = useRole();

    const menuItems: SidebarItem[] = [
        {
            title: "Dashboard",
            href: "/mutamayizin-coordinator/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Prestasi",
            href: "/mutamayizin-coordinator/achievements",
            icon: Award,
        },
        {
            title: "Ekstrakurikuler",
            href: "#ekstrakurikuler",
            icon: Star,
            subItems: [
                {
                    title: "Presensi",
                    href: "/mutamayizin-coordinator/attendance",
                    icon: CalendarCheck,
                },
                {
                    title: "Anggota",
                    href: "/mutamayizin-coordinator/members",
                    icon: Users,
                },
                {
                    title: "Data Tutor",
                    href: "/mutamayizin-coordinator/tutors",
                    icon: Briefcase,
                },
                {
                    title: "Presensi Tutor",
                    href: "/mutamayizin-coordinator/attendance/tutor-recap",
                    icon: FileSpreadsheet,
                },
            ],
        },
        {
            title: "Profil",
            href: "/mutamayizin-coordinator/profile",
            icon: User,
        },
    ];

    return (
        <SidebarBase
            menuItems={menuItems}
            onLogout={logout}
            defaultDashboardHref="/mutamayizin-coordinator/dashboard"
        />
    );
};
