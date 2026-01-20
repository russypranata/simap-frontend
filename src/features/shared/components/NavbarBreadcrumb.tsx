'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ChevronLeft,
    ChevronRight,
    User,
    LayoutDashboard,
    CreditCard,
    GraduationCap,
    Calendar,
    Bell,
    Users,
    ClipboardList,
    Settings,
    BookOpen,
    Trophy,
    Activity,
    Wallet,
    Pencil,
    CircleDot,
    ArrowLeft
} from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Route configuration with labels and icons
const routeConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
    // Dashboard
    dashboard: { label: 'Dashboard', icon: LayoutDashboard },

    // Profile
    profile: { label: 'Profil', icon: User },
    edit: { label: 'Edit', icon: Pencil },

    // Student routes
    'kartu-pelajar': { label: 'Kartu Pelajar', icon: CreditCard },
    'data-diri': { label: 'Data Diri', icon: User },
    grades: { label: 'Nilai Akademik', icon: GraduationCap },
    attendance: { label: 'Presensi', icon: ClipboardList },
    schedule: { label: 'Jadwal', icon: Calendar },
    announcements: { label: 'Pengumuman', icon: Bell },
    achievements: { label: 'Prestasi', icon: Trophy },
    behavior: { label: 'Perilaku', icon: Activity },
    extracurricular: { label: 'Ekstrakurikuler', icon: Users },

    // Teacher routes
    'daftar-siswa': { label: 'Daftar Siswa', icon: Users },
    'input-nilai': { label: 'Input Nilai', icon: GraduationCap },
    'rekap-absensi': { label: 'Rekap Absensi', icon: ClipboardList },
    'jadwal-mengajar': { label: 'Jadwal Mengajar', icon: Calendar },

    // Parent routes
    'anak-saya': { label: 'Anak Saya', icon: Users },
    'perkembangan': { label: 'Perkembangan', icon: Activity },
    'pembayaran': { label: 'Pembayaran', icon: Wallet },

    // Extracurricular routes
    'ekstrakurikuler': { label: 'Ekstrakurikuler', icon: Users },
    'members': { label: 'Anggota', icon: Users },
    'anggota': { label: 'Anggota', icon: Users },
    'presensi': { label: 'Presensi', icon: ClipboardList },
    'tutor-recap': { label: 'Rekap Tutor', icon: ClipboardList },
    'tutors': { label: 'Tutor', icon: Users },

    // Mutamayizin routes
    'mutamayizin': { label: 'Mutamayizin', icon: BookOpen },

    // Admin routes
    'kelola-pengguna': { label: 'Kelola Pengguna', icon: Users },
    'pengaturan': { label: 'Pengaturan', icon: Settings },

    // General
    settings: { label: 'Pengaturan', icon: Settings },
    notifications: { label: 'Notifikasi', icon: Bell },
};

// Role-based segments to skip in breadcrumb display
const roleSegments = [
    'student',
    'teacher',
    'parent',
    'extracurricular-advisor',
    'mutamayizin-coordinator',
    'admin'
];

interface BreadcrumbData {
    label: string;
    href: string;
    isLast: boolean;
    icon: React.ComponentType<{ className?: string }>;
}

export const NavbarBreadcrumb: React.FC = () => {
    const pathname = usePathname();

    // Generate breadcrumb items from pathname
    const generateBreadcrumbs = (): BreadcrumbData[] => {
        if (!pathname || pathname === '/') {
            return [];
        }

        const segments = pathname.split('/').filter(Boolean);

        // Filter out role-based segments
        const filteredSegments = segments.filter(
            segment => !roleSegments.includes(segment)
        );

        if (filteredSegments.length === 0) {
            return [];
        }

        const breadcrumbs: BreadcrumbData[] = [];
        let currentPath = '';

        // Rebuild path with correct href
        segments.forEach((segment) => {
            currentPath += `/${segment}`;

            // Only add to breadcrumbs if not a role segment
            if (!roleSegments.includes(segment)) {
                const config = routeConfig[segment];
                const label = config?.label || formatSegmentLabel(segment);
                const icon = config?.icon || CircleDot;
                
                // Preserve tab query param for attendance page
                let href = currentPath;
                if (segment === 'attendance') {
                     const tabParam = new URLSearchParams(window.location.search).get('tab');
                     if (tabParam) {
                         href += `?tab=${tabParam}`;
                     }
                }

                breadcrumbs.push({
                    label,
                    href,
                    isLast: false,
                    icon,
                });
            }
        });

        // Mark the last breadcrumb
        if (breadcrumbs.length > 0) {
            breadcrumbs[breadcrumbs.length - 1].isLast = true;
        }

        return breadcrumbs;
    };

    // Format segment to readable label
    const formatSegmentLabel = (segment: string): string => {
        // Handle UUID-like segments
        if (segment.match(/^[0-9a-f-]{36}$/i)) {
            return 'Detail';
        }

        // Handle numeric IDs
        if (/^\d+$/.test(segment)) {
            return 'Detail';
        }

        // Convert kebab-case to Title Case
        return segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const breadcrumbs = generateBreadcrumbs();

    // If no breadcrumbs, show nothing
    if (breadcrumbs.length === 0) {
        return null;
    }

    // Single page (no hierarchy) - Show styled page title with icon
    if (breadcrumbs.length === 1) {
        const crumb = breadcrumbs[0];
        const Icon = crumb.icon;

        return (
            <div className="flex items-center -ml-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-md">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                        {crumb.label}
                    </span>
                </div>
            </div>
        );
    }

    // Mobile: Show back button style for small screens
    const MobileView = () => {
        const previousBreadcrumb = breadcrumbs[breadcrumbs.length - 2];
        const currentBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
        const CurrentIcon = currentBreadcrumb.icon;

        return (
            <div className="flex items-center gap-1.5">
                <Link href={previousBreadcrumb.href}>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-md">
                    <CurrentIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                        {currentBreadcrumb.label}
                    </span>
                </div>
            </div>
        );
    };

    // Desktop: Show full breadcrumb with enhanced styling
    const DesktopView = () => {
        const hasHistory = breadcrumbs.length > 1;
        const previousBreadcrumb = hasHistory ? breadcrumbs[breadcrumbs.length - 2] : null;

        return (
            <div className="flex items-center gap-2 -ml-2">
                {hasHistory && previousBreadcrumb && (
                    <>
                        <Button
                            variant="default"
                            size="icon"
                            className="h-8 w-8 rounded-lg bg-blue-800 hover:bg-blue-900 text-white shadow-sm border-none transition-colors"
                            asChild
                        >
                            <Link href={previousBreadcrumb.href}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div className="h-5 w-[1px] bg-border/60 mx-1" />
                    </>
                )}
                <Breadcrumb>
                    <BreadcrumbList className="gap-0.5 sm:gap-0.5">
                        {breadcrumbs.map((crumb, index) => {
                            const isFirst = index === 0;
                            const isLast = index === breadcrumbs.length - 1;
                            const Icon = crumb.icon;

                            return (
                                <React.Fragment key={crumb.href}>
                                    {!isFirst && (
                                        <BreadcrumbSeparator className="mx-0">
                                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                                        </BreadcrumbSeparator>
                                    )}
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            // Active/Current page - Blue badge style
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-md">
                                                <Icon className="h-4 w-4 text-primary" />
                                                <span className="text-sm font-medium text-primary">
                                                    {crumb.label}
                                                </span>
                                            </div>
                                        ) : (
                                            // Parent pages - Subtle hover style
                                            <BreadcrumbLink asChild>
                                                <Link
                                                    href={crumb.href}
                                                    className={cn(
                                                        "flex items-center gap-1.5 px-2.5 py-1 rounded-md",
                                                        "text-muted-foreground hover:text-foreground",
                                                        "hover:bg-muted/50 transition-all duration-150",
                                                        "group"
                                                    )}
                                                >
                                                    <Icon className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                    <span className="text-sm font-medium">
                                                        {crumb.label}
                                                    </span>
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </React.Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        );
    };

    return (
        <>
            {/* Mobile view */}
            <div className="md:hidden">
                <MobileView />
            </div>

            {/* Desktop view */}
            <div className="hidden md:block">
                <DesktopView />
            </div>
        </>
    );
};
