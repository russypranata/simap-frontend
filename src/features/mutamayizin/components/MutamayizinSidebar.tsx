"use client";

import React from "react";
import { SidebarBase, SidebarItem } from "@/features/shared/components/SidebarBase";
import { useRole } from "@/app/context/RoleContext";
import {
    LayoutDashboard,
    User,
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
