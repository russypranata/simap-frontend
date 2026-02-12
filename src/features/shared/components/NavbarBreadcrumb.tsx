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
    ArrowLeft,
    School,
    Clock,
    ArrowUpCircle,
    UserCheck,
    FileText,
    Printer,
    Award
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
interface RouteItem {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isClickable?: boolean;
    parent?: string;
}

const routeConfig: Record<string, RouteItem> = {
    // Dashboard
    dashboard: { label: 'Dasbor', icon: LayoutDashboard },

    // Categories (Non-clickable parents)
    'curriculum-data': { label: 'Data Kurikulum', icon: BookOpen, isClickable: false },
    'schedule-kbm': { label: 'Jadwal & KBM', icon: Calendar, isClickable: false },
    'users-management': { label: 'Manajemen Pengguna', icon: Users, isClickable: false },
    'class-mgmt': { label: 'Manajemen Kelas', icon: School, isClickable: false },

    // Profile
    profile: { label: 'Profil', icon: User },
    edit: { label: 'Edit', icon: Pencil },

    // Student routes
    'kartu-pelajar': { label: 'Kartu Pelajar', icon: CreditCard },
    'data-diri': { label: 'Data Diri', icon: User },
    grades: { label: 'Nilai Akademik', icon: GraduationCap },
    attendance: { label: 'Presensi', icon: ClipboardList, parent: 'schedule-kbm' },
    schedule: { label: 'Jadwal', icon: Calendar, parent: 'schedule-kbm' },
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
    'academic-year': { label: 'Tahun Ajaran', icon: Calendar, parent: 'curriculum-data' },
    'class': { label: 'Daftar Kelas', icon: School, parent: 'class-management' },
    'class-management': { label: 'Manajemen Kelas', icon: School, isClickable: false },
    'promotion': { label: 'Kenaikan Kelas', icon: ArrowUpCircle, parent: 'class-management' },
    'placement': { label: 'Penempatan Kelas', icon: Users, parent: 'class-management' },
    'homeroom': { label: 'Wali Kelas', icon: UserCheck, parent: 'class-management' },
    'subject': { label: 'Mata Pelajaran', icon: BookOpen, parent: 'curriculum-data' },
    'new': { label: 'Tambah Baru', icon: Pencil },
    'users': { label: 'Manajemen Pengguna', icon: Users, isClickable: false },
    'teachers': { label: 'Guru & Staff', icon: Users, parent: 'users' },
    'students': { label: 'Data Siswa', icon: GraduationCap, parent: 'users' },
    'parents': { label: 'Wali Murid', icon: Users, parent: 'users' },
    'kelola-pengguna': { label: 'Kelola Pengguna', icon: Users, parent: 'users' },
    'calendar': { label: 'Kalender Akademik', icon: Calendar, parent: 'schedule-kbm' },
    'schedule-management': { label: 'Jadwal Pelajaran', icon: Calendar },
    'time-slots': { label: 'Pengaturan Jam', icon: Clock, parent: 'curriculum-data' },
    'assessment': { label: 'Input Nilai', icon: FileText },
    'report-card': { label: 'Cetak Rapor', icon: Printer },
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
    isClickable: boolean;
}

export interface NavbarBreadcrumbProps {
    items?: {
        label: string;
        href: string;
        icon?: React.ComponentType<{ className?: string }>;
    }[];
}

export const NavbarBreadcrumb: React.FC<NavbarBreadcrumbProps> = ({ items }) => {
    const pathname = usePathname();

    // Generate breadcrumb items from pathname
    const generateBreadcrumbs = (): BreadcrumbData[] => {
        if (items) {
             return items.map((item, index) => ({
                label: item.label,
                href: item.href,
                isLast: index === items.length - 1,
                icon: item.icon || CircleDot,
                isClickable: true,
            }));
        }

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
        let skippedLabel = '';
        

        segments.forEach((segment, index) => {
            currentPath += `/${segment}`;

            // Only add to breadcrumbs if not a role segment
            if (!roleSegments.includes(segment)) {
                // Skip if we already auto-injected dashboard and this is the dashboard segment
                if (segment === 'dashboard' && breadcrumbs.some(b => b.label === 'Dasbor')) {
                    return;
                }
                
                // Smart Logic: Check if this is an ID followed immediately by 'edit'
                const isIdSegment = segment.match(/^[0-9a-f-]{36}$/i) || /^\d+$/.test(segment) || segment.startsWith('ay-') || segment.startsWith('c-') || segment.startsWith('subj-');
                const nextSegment = segments[index + 1];
                
                if (isIdSegment && nextSegment === 'edit') {
                    // Start: Capture semantic label for the Edit page before skipping
                    if (segment.startsWith('ay-')) {
                        const parts = segment.split('-');
                        if (parts.length >= 3) skippedLabel = `T.A. ${parts[1]}/${parts[2]}`;
                    } else {
                         skippedLabel = formatSegmentLabel(segment);
                    }
                    // End: Skip adding this ID segment to breadcrumb list
                    return; 
                }

                const config = routeConfig[segment];

                // Inject Parent Category if defined and not already present
                if (config?.parent) {
                    const parentConfig = routeConfig[config.parent];
                    if (parentConfig && !breadcrumbs.some(b => b.label === parentConfig.label)) {
                        breadcrumbs.push({
                            label: parentConfig.label,
                            href: '#', // Non-clickable
                            isLast: false,
                            icon: parentConfig.icon,
                            isClickable: false,
                        });
                    }
                }

                let label = config?.label || formatSegmentLabel(segment);
                
                // If this is the 'edit' segment and we skipped the previous ID, merge the label
                if (segment === 'edit' && skippedLabel) {
                    label = `Edit ${skippedLabel.replace('Detail ', '')}`; // Remove "Detail" prefix if exists
                    skippedLabel = ''; // Reset
                }

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
                    isClickable: config?.isClickable !== false,
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

        // Handle Academic Year IDs (ay-...)
        if (segment.startsWith('ay-')) {
            // Parse ay-2025-2026 to T.A. 2025/2026
            const parts = segment.split('-');
            if (parts.length >= 3) {
                return `T.A. ${parts[1]}/${parts[2]}`;
            }
            return 'Detail Tahun Ajaran';
        }

        // Handle Class IDs (c-...)
        if (segment.startsWith('c-')) {
            return 'Detail Kelas';
        }

        // Handle Subject IDs (subj-...)
        if (segment.startsWith('subj-')) {
            return 'Detail Mata Pelajaran';
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
            <div className="flex items-center">
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
        // Find the nearest clickable ancestor
        const clickableAncestors = breadcrumbs.slice(0, -1).reverse().filter(b => b.isClickable);
        const backTarget = clickableAncestors[0];
        const isBackEnabled = !!backTarget;
        
        const currentBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
        const CurrentIcon = currentBreadcrumb.icon;

        return (
            <div className="flex items-center gap-1.5">
                {isBackEnabled ? (
                    <Link href={backTarget.href}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled
                        className="h-7 w-7 p-0 text-blue-800/50 cursor-not-allowed"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                )}
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
        // Find nearest clickable ancestor for back button
        const clickableAncestors = breadcrumbs.slice(0, -1).reverse().filter(b => b.isClickable);
        const backTarget = clickableAncestors[0];
        const isBackEnabled = !!backTarget;
        const hasHistory = breadcrumbs.length > 1;

        return (
            <div className="flex items-center gap-2">
                {hasHistory && (
                    <>
                        {isBackEnabled ? (
                            <Button
                                variant="default"
                                size="icon"
                                className="h-8 w-8 rounded-lg bg-blue-800 hover:bg-blue-900 text-white shadow-sm border-none transition-colors"
                                asChild
                            >
                                <Link href={backTarget.href}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                        ) : (
                            <Button
                                variant="default"
                                size="icon"
                                disabled
                                className="h-8 w-8 rounded-lg bg-blue-800/60 text-white/40 shadow-none border-none cursor-not-allowed"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}
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
                                        ) : !crumb.isClickable ? (
                                            // Non-clickable label (Category)
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 text-muted-foreground/60 cursor-default">
                                                <Icon className="h-4 w-4 opacity-40" />
                                                <span className="text-sm font-medium">
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
