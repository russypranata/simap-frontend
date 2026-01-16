'use client';

import React, { createContext, useContext, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRole } from '@/app/context/RoleContext';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    Calendar,
    Home,
    Megaphone,
    FileText,
    User,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Globe,
    ClipboardList,
    Star,
    CheckCircle,
    Award,
} from 'lucide-react';

interface SidebarItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    condition?: boolean;
    subItems?: SidebarItem[];
    isExternal?: boolean;
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
    const { role, isHomeroomTeacher, isPiketTeacher, logout } = useRole();
    const [collapsed, setCollapsed] = React.useState(false);
    const pathname = usePathname();
    // State to track open submenus
    const [openSubmenus, setOpenSubmenus] = React.useState<string[]>([
        '/homeroom',
    ]);

    const handleToggleCollapse = (newCollapsed: boolean) => {
        setCollapsed(newCollapsed);
        onCollapseChange?.(newCollapsed);
    };

    const toggleSubmenu = (href: string) => {
        setOpenSubmenus((prev) =>
            prev.includes(href)
                ? prev.filter((item) => item !== href)
                : [...prev, href],
        );
    };

    const teacherMenuItems: SidebarItem[] = [
        {
            title: 'Dashboard',
            href: '/teacher/dashboard',
            icon: LayoutDashboard,
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
            title: 'Catatan Perilaku',
            href: '/teacher/student-behavior',
            icon: ClipboardList,
        },
        {
            title: 'Wali Kelas',
            href: '/teacher/homeroom',
            icon: Home,
            condition: isHomeroomTeacher,
        },
        {
            title: 'Guru Piket',
            href: '/teacher/picket',
            icon: Users,
            condition: isPiketTeacher,
        },
        {
            title: 'Administrasi',
            href: '/teacher/documents',
            icon: FileText,
        },
        {
            title: 'Pengumuman',
            href: '/teacher/announcements',
            icon: Megaphone,
            badge: '3',
        },
        {
            title: 'Profil',
            href: '/teacher/profile',
            icon: User,
        },
    ];

    const studentMenuItems: SidebarItem[] = [
        {
            title: 'Dashboard',
            href: '/student/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: 'Jadwal Pelajaran',
            href: '/student/schedule',
            icon: Calendar,
        },
        {
            title: 'Nilai & Rapor',
            href: '/student/grades',
            icon: GraduationCap,
        },
        {
            title: 'Tugas & PR',
            href: '/student/assignments',
            icon: FileText,
            badge: '3',
        },
        {
            title: 'Perpustakaan',
            href: '/student/library',
            icon: BookOpen,
        },
        {
            title: 'Pengumuman',
            href: '/student/announcements',
            icon: Megaphone,
        },
        {
            title: 'Profil Saya',
            href: '/student/profile',
            icon: User,
        },
    ];

    const extracurricularMenuItems: SidebarItem[] = [
        {
            title: 'Dashboard',
            href: '/extracurricular-advisor/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: 'Kelola Anggota',
            href: '/extracurricular-advisor/members',
            icon: Users,
        },
        {
            title: 'Presensi Kegiatan',
            href: '/extracurricular-advisor/attendance',
            icon: CheckCircle,
        },
        {
            title: 'Jadwal Kegiatan',
            href: '/extracurricular-advisor/schedule',
            icon: Calendar,
        },
        {
            title: 'Prestasi',
            href: '/extracurricular-advisor/achievements',
            icon: Award,
        },
        {
            title: 'Pengumuman',
            href: '/extracurricular-advisor/announcements',
            icon: Megaphone,
        },
        {
            title: 'Profil',
            href: '/extracurricular-advisor/profile',
            icon: User,
        },
    ];

    const menuItems =
        role === 'student'
            ? studentMenuItems
            : role === 'extracurricular_tutor'
              ? extracurricularMenuItems
              : teacherMenuItems;

    const filteredMenuItems = menuItems.filter(
        (item) => item.condition !== false, // Only include items where condition is not false
    );

    const handleLogout = () => {
        logout();
    };

    return (
        <div
            className={cn(
                'relative flex flex-col h-full bg-card border-r transition-all duration-300',
                collapsed ? 'w-16' : 'w-64',
                className,
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 h-16 shrink-0 border-b">
                {!collapsed && (
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">
                                S
                            </span>
                        </div>
                        <span className="font-semibold text-foreground">
                            SIMAP
                        </span>
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
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="pl-2 pr-4 py-2 space-y-1">
                        <nav>
                            {filteredMenuItems.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    (pathname === '/' &&
                                        (role === 'student'
                                            ? item.href === '/student/dashboard'
                                            : role === 'extracurricular_tutor'
                                              ? item.href ===
                                                '/extracurricular-advisor/dashboard'
                                              : item.href ===
                                                '/teacher/dashboard'));
                                const Icon = item.icon;
                                const hasSubItems =
                                    item.subItems && item.subItems.length > 0;
                                const isSubmenuOpen = openSubmenus.includes(
                                    item.href,
                                );
                                const isChildActive = item.subItems?.some(
                                    (sub) => pathname === sub.href,
                                );

                                // If collapsed, we typically don't show submenus inline nicely,
                                // just show valid parent/child or tooltip.
                                // For this implementation, if collapsed, we treat it like a normal link/button.

                                if (hasSubItems && !collapsed) {
                                    return (
                                        <Collapsible
                                            key={item.href}
                                            open={isSubmenuOpen}
                                            onOpenChange={() =>
                                                toggleSubmenu(item.href)
                                            }
                                            className="space-y-1"
                                        >
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant={
                                                        isActive ||
                                                        isChildActive
                                                            ? 'secondary'
                                                            : 'ghost'
                                                    }
                                                    className={cn(
                                                        'w-full justify-start mb-1',
                                                        'h-10 px-3',
                                                        (isActive ||
                                                            isChildActive) &&
                                                            'bg-primary text-primary-foreground hover:bg-primary/90',
                                                    )}
                                                >
                                                    <Icon className="h-4 w-4 mr-3" />
                                                    <span className="flex-1 text-left">
                                                        {item.title}
                                                    </span>
                                                    <ChevronDown
                                                        className={cn(
                                                            'h-4 w-4 transition-transform duration-200',
                                                            isSubmenuOpen
                                                                ? 'rotate-180'
                                                                : '',
                                                        )}
                                                    />
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="space-y-1">
                                                {item.subItems!.map(
                                                    (subItem) => {
                                                        const isSubActive =
                                                            pathname ===
                                                            subItem.href;
                                                        const SubIcon =
                                                            subItem.icon;

                                                        const ButtonContent = (
                                                            <Button
                                                                variant="ghost"
                                                                className={cn(
                                                                    'w-full justify-start h-9 pl-12 pr-3 text-sm mb-1',
                                                                    isSubActive
                                                                        ? 'text-primary font-medium bg-primary/5'
                                                                        : 'text-foreground hover:bg-muted/50',
                                                                )}
                                                            >
                                                                <SubIcon
                                                                    className={cn(
                                                                        'h-4 w-4 mr-3',
                                                                        isSubActive
                                                                            ? 'text-primary'
                                                                            : 'opacity-70',
                                                                    )}
                                                                />
                                                                <span className="flex-1 text-left truncate">
                                                                    {
                                                                        subItem.title
                                                                    }
                                                                </span>
                                                            </Button>
                                                        );

                                                        if (
                                                            subItem.isExternal
                                                        ) {
                                                            return (
                                                                <a
                                                                    key={
                                                                        subItem.href
                                                                    }
                                                                    href={
                                                                        subItem.href
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="block"
                                                                >
                                                                    {
                                                                        ButtonContent
                                                                    }
                                                                </a>
                                                            );
                                                        }

                                                        return (
                                                            <Link
                                                                key={
                                                                    subItem.href
                                                                }
                                                                href={
                                                                    subItem.href
                                                                }
                                                            >
                                                                {ButtonContent}
                                                            </Link>
                                                        );
                                                    },
                                                )}
                                            </CollapsibleContent>
                                        </Collapsible>
                                    );
                                }

                                const ButtonContent = (
                                    <Button
                                        variant={
                                            isActive ? 'secondary' : 'ghost'
                                        }
                                        className={cn(
                                            'w-full justify-start mb-1',
                                            collapsed
                                                ? 'h-10 w-10 p-0'
                                                : 'h-10 px-3',
                                            isActive &&
                                                'bg-primary text-primary-foreground hover:bg-primary/90',
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                'h-4 w-4',
                                                !collapsed && 'mr-3',
                                            )}
                                        />
                                        {!collapsed && (
                                            <>
                                                <span className="flex-1 text-left">
                                                    {item.title}
                                                </span>
                                                {item.badge && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="ml-auto"
                                                    >
                                                        {item.badge}
                                                    </Badge>
                                                )}
                                            </>
                                        )}
                                    </Button>
                                );

                                return (
                                    <Link key={item.href} href={item.href}>
                                        {ButtonContent}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </ScrollArea>
            </div>

            {/* Footer */}
            <div className="p-2 border-t shrink-0">
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className={cn(
                        'w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50',
                        collapsed ? 'h-10 w-10 p-0' : 'h-10 px-3',
                    )}
                >
                    <LogOut className={cn('h-4 w-4', !collapsed && 'mr-3')} />
                    {!collapsed && <span>Keluar</span>}
                </Button>
            </div>
        </div>
    );
};
