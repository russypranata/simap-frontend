"use client";

import React from "react";
import { SidebarBase, type SidebarItem } from "@/features/shared/components/SidebarBase";
import { useRole } from "@/app/context/RoleContext";
import { useUnreadCount } from "@/features/announcements/hooks/useAnnouncements";
import {
  LayoutDashboard,
  Trophy,
  User,
  Megaphone,
} from "lucide-react";

export const CompetitionAdvisorSidebar: React.FC = () => {
  const { logout } = useRole();
  const { data: unreadCount } = useUnreadCount();

  const menuItems: SidebarItem[] = [
    {
      title: "Dashboard",
      href: "/competition-advisor/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Pengumuman",
      href: "/competition-advisor/announcements",
      icon: Megaphone,
      badge: unreadCount && unreadCount > 0 ? String(unreadCount) : undefined,
    },
    {
      title: "Daftar Lomba",
      href: "/competition-advisor/lomba",
      icon: Trophy,
    },
    {
      title: "Profil",
      href: "/competition-advisor/profile",
      icon: User,
    },
  ];

  return (
    <SidebarBase
      menuItems={menuItems}
      onLogout={logout}
      defaultDashboardHref="/competition-advisor/dashboard"
    />
  );
};
