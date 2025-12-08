"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRole } from "@/app/context/RoleContext";
import { useTheme } from "@/app/context/ThemeContext";
import { NotificationBell } from "./NotificationBell";
import { Moon, Sun, User, LogOut, School, Calendar } from "lucide-react";
import { formatDate, getDayName } from "@/features/shared/utils/dateFormatter";

interface NavbarProps {
  title?: string;
  showNotifications?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  title = "SIMAP",
  showNotifications = true,
}) => {
  const { role, isAuthenticated, logout } = useRole();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
  };

  const getRoleDisplayName = (role: string | null) => {
    switch (role) {
      case "guru":
        return "Guru";
      case "siswa":
        return "Siswa";
      case "admin":
        return "Administrator";
      case "orang_tua":
        return "Orang Tua";
      default:
        return "Pengguna";
    }
  };

  return (
    <nav className="bg-card border-b">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <School className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Hari ini
              </p>
              <p className="text-sm font-medium text-foreground">
                {getDayName(new Date())}, {formatDate(new Date())}
              </p>
            </div>
          </div>

          {showNotifications && isAuthenticated && <NotificationBell />}

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                    <AvatarFallback>
                      {getRoleDisplayName(role)?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Ahmad Fauzi
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {role === "guru" && "Guru Mata Pelajaran"}
                      {role === "siswa" && "Siswa Aktif"}
                      {role === "admin" && "System Administrator"}
                      {role === "orang_tua" && "Orang Tua Siswa"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};
