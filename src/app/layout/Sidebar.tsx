"use client";

import React, { createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRole } from "@/app/context/RoleContext";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Calendar,
  Home,
  Upload,
  Megaphone,
  FileText,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  condition?: boolean;
}

// Sidebar context to share collapsed state
interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebarCollapse = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    // Return default value if used outside provider
    return { collapsed: false, setCollapsed: () => {} };
  }
  return context;
};

interface SidebarProps {
  className?: string;
  onCollapseChange?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  className,
  onCollapseChange,
}) => {
  const { role, isHomeroomTeacher, logout } = useRole();
  const [collapsed, setCollapsed] = React.useState(false);
  const pathname = usePathname();

  const handleToggleCollapse = (newCollapsed: boolean) => {
    setCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);
  };

  const menuItems: SidebarItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Presensi Siswa",
      href: "/attendance",
      icon: Users,
    },
    {
      title: "Jurnal Mengajar",
      href: "/journal",
      icon: BookOpen,
    },
    {
      title: "Nilai Siswa",
      href: "/grades",
      icon: GraduationCap,
    },
    {
      title: "Jadwal Mengajar",
      href: "/schedule",
      icon: Calendar,
    },
    {
      title: "Wali Kelas",
      href: "/homeroom",
      icon: Home,
      condition: isHomeroomTeacher,
    },
    {
      title: "Upload Dokumen",
      href: "/upload-documents",
      icon: Upload,
    },
    {
      title: "Pengumuman",
      href: "/announcements",
      icon: Megaphone,
      badge: "3",
    },
    {
      title: "E-Rapor",
      href: "/ereport",
      icon: FileText,
    },
    {
      title: "Profil",
      href: "/profile",
      icon: User,
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => item.condition !== false // Only include items where condition is not false
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                S
              </span>
            </div>
            <span className="font-semibold text-foreground">SIMAP</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleToggleCollapse(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-2">
        <nav className="space-y-3">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href || (pathname === "/" && item.href === "/dashboard");
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    collapsed ? "h-10 w-10 p-0" : "h-10 px-3",
                    isActive &&
                      "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <Icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-2">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
            collapsed ? "h-10 w-10 p-0" : "h-10 px-3"
          )}
        >
          <LogOut className={cn("h-4 w-4", !collapsed && "mr-3")} />
          {!collapsed && <span>Keluar</span>}
        </Button>
      </div>
    </div>
  );
};
