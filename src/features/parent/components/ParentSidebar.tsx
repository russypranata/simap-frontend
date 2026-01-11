"use client";

import React from "react";
import { SidebarBase, SidebarItem } from "@/features/shared/components/SidebarBase";
import { useRole } from "@/app/context/RoleContext";
import {
    LayoutDashboard,
    User,
    Calendar,
    FileText,
    MessageSquare,
    CreditCard,
} from "lucide-react";

export const ParentSidebar: React.FC = () => {
    const { logout } = useRole();

    const menuItems: SidebarItem[] = [
        {
            title: "Dashboard",
            href: "/parent/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Nilai Anak",
            href: "/parent/grades",
            icon: FileText,
        },
        {
            title: "Kehadiran Anak",
            href: "/parent/attendance",
            icon: Calendar,
        },
        {
            title: "Jadwal Anak",
            href: "/parent/schedule",
            icon: Calendar,
        },
        {
            title: "Pengumuman",
            href: "/parent/announcements",
            icon: MessageSquare,
        },
        {
            title: "Profil Anak",
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
