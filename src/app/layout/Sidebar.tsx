'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRole } from '@/app/context/RoleContext';
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
} from 'lucide-react';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  condition?: boolean;
}

interface SidebarProps {
  className?: string;
  currentPath?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, currentPath = '/' }) => {
  const { role, isHomeroomTeacher, logout } = useRole();
  const [collapsed, setCollapsed] = React.useState(false);

  const menuItems: SidebarItem[] = [
    {
      title: 'Dashboard',
      href: '/teacher/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Presensi Siswa',
      href: '/teacher/attendance',
      icon: Users,
    },
    {
      title: 'Jurnal Mengajar',
      href: '/teacher/journal',
      icon: BookOpen,
    },
    {
      title: 'Nilai Siswa',
      href: '/teacher/grades',
      icon: GraduationCap,
    },
    {
      title: 'Jadwal Mengajar',
      href: '/teacher/schedule',
      icon: Calendar,
    },
    {
      title: 'Wali Kelas',
      href: '/teacher/homeroom',
      icon: Home,
      condition: isHomeroomTeacher,
    },
    {
      title: 'Upload Dokumen',
      href: '/teacher/upload-documents',
      icon: Upload,
    },
    {
      title: 'Pengumuman',
      href: '/teacher/announcements',
      icon: Megaphone,
      badge: '3',
    },
    {
      title: 'E-Rapor',
      href: '/teacher/ereport',
      icon: FileText,
    },
    {
      title: 'Profil',
      href: '/teacher/profile',
      icon: User,
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.condition !== false // Only include items where condition is not false
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className={cn(
        'relative flex flex-col h-full bg-card border-r transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-foreground">SIMAP</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
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
        <nav className="space-y-2">
          {filteredMenuItems.map((item) => {
            const isActive = currentPath === item.href || (currentPath === '/' && item.href === '/teacher/dashboard');
            const Icon = item.icon;

            return (
              <Button
                key={item.href}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  collapsed ? 'h-10 w-10 p-0' : 'h-10 px-3',
                  isActive && 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
                onClick={() => {
                  window.location.hash = item.href;
                }}
              >
                <Icon className={cn('h-4 w-4', !collapsed && 'mr-3')} />
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
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            'w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50',
            collapsed ? 'h-10 w-10 p-0' : 'h-10 px-3'
          )}
        >
          <LogOut className={cn('h-4 w-4', !collapsed && 'mr-3')} />
          {!collapsed && <span>Keluar</span>}
        </Button>
      </div>
    </div>
  );
};