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
    Pencil,
    CircleDot,
    ArrowLeft,
    School,
    Clock,
    ArrowUpCircle,
    UserCheck,
    FileText,
    Printer,
    Briefcase,
    Shield,
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
    // Dashboard (generic fallback)
    dashboard: { label: 'Dashboard', icon: LayoutDashboard },

    // ── Non-clickable category groups ─────────────────────────────────────────
    'curriculum-data': { label: 'Data Kurikulum', icon: BookOpen, isClickable: false },
    'schedule-kbm': { label: 'Jadwal & KBM', icon: Calendar, isClickable: false },
    'users-management': { label: 'Manajemen Pengguna', icon: Users, isClickable: false },
    'class-mgmt': { label: 'Manajemen Kelas', icon: School, isClickable: false },
    'class-management': { label: 'Manajemen Kelas', icon: School, isClickable: false },
    'extracurricular-management': { label: 'Manajemen Ekskul', icon: Trophy, isClickable: false },
    'users-student': { label: 'Data Siswa', icon: Users, isClickable: false },
    'users-staff': { label: 'Manajemen PTK', icon: Briefcase, isClickable: false },
    'access-control': { label: 'Hak Akses', icon: Settings, isClickable: false },
    'assessments': { label: 'Penilaian', icon: ClipboardList, isClickable: false },

    // ── ROLE PARENT ───────────────────────────────────────────────────────────
    // Parent category groups (non-clickable)
    'parent:academic': { label: 'Akademik Anak', icon: GraduationCap, isClickable: false },
    'parent:attendance': { label: 'Kehadiran Anak', icon: ClipboardList, isClickable: false },
    'parent:settings': { label: 'Pengaturan', icon: Settings, isClickable: false },

    // Parent pages
    'parent:dashboard': { label: 'Dashboard', icon: LayoutDashboard },
    'parent:grades': { label: 'Nilai & Rapor', icon: GraduationCap },
    'parent:schedule': { label: 'Jadwal Pelajaran', icon: Calendar },
    'parent:achievements': { label: 'Prestasi', icon: Trophy },
    'parent:behavior': { label: 'Catatan Perilaku', icon: ClipboardList },
    'parent:announcements': { label: 'Pengumuman', icon: Bell },
    'parent:profile': { label: 'Profil Saya', icon: User },
    'parent:edit-profile': { label: 'Edit Profil', icon: Pencil },
    'parent:change-password': { label: 'Ubah Kata Sandi', icon: Settings },

    // Parent attendance sub-pages
    'parent:morning': { label: 'Keterlambatan Pagi', icon: Clock },
    'parent:daily': { label: 'Presensi Harian', icon: ClipboardList },
    'parent:subject': { label: 'Presensi Mapel', icon: BookOpen },
    'parent:prayer': { label: 'Presensi Sholat', icon: Activity },
    'parent:extracurricular': { label: 'Ekstrakurikuler', icon: Trophy },

    // ── ROLE STUDENT ──────────────────────────────────────────────────────────
    // Student category groups (non-clickable)
    'student:academic': { label: 'Akademik', icon: GraduationCap, isClickable: false },
    'student:attendance': { label: 'Kehadiran', icon: ClipboardList, isClickable: false },

    // Student pages
    'student:dashboard': { label: 'Dashboard', icon: LayoutDashboard },
    'student:kartu-pelajar': { label: 'Kartu Pelajar', icon: CreditCard },
    'student:data-diri': { label: 'Data Diri', icon: User },
    'student:grades': { label: 'Nilai & Rapor', icon: GraduationCap },
    'student:schedule': { label: 'Jadwal Pelajaran', icon: Calendar },
    'student:announcements': { label: 'Pengumuman', icon: Bell },
    'student:achievements': { label: 'Prestasi', icon: Trophy },
    'student:behavior': { label: 'Catatan Perilaku', icon: Activity },
    'student:extracurricular': { label: 'Ekstrakurikuler', icon: Users },
    'student:profile': { label: 'Profil Saya', icon: User },
    'student:edit': { label: 'Edit Profil', icon: Pencil },

    // Student attendance sub-pages
    'student:morning': { label: 'Keterlambatan Pagi', icon: Clock },
    'student:daily': { label: 'Presensi Harian', icon: ClipboardList },
    'student:subject': { label: 'Presensi Mapel', icon: BookOpen },
    'student:prayer': { label: 'Presensi Sholat', icon: Activity },

    // ── ROLE TEACHER ──────────────────────────────────────────────────────────
    'teacher:dashboard': { label: 'Dashboard', icon: LayoutDashboard },
    'teacher:daftar-siswa': { label: 'Daftar Siswa', icon: Users },
    'teacher:input-nilai': { label: 'Input Nilai', icon: GraduationCap },
    'teacher:rekap-absensi': { label: 'Rekap Absensi', icon: ClipboardList },
    'teacher:jadwal-mengajar': { label: 'Jadwal Mengajar', icon: Calendar },
    'teacher:schedule': { label: 'Jadwal Mengajar', icon: Calendar },
    'teacher:grades': { label: 'Nilai Siswa', icon: GraduationCap },
    'teacher:journal': { label: 'Jurnal Mengajar', icon: BookOpen },
    'teacher:student-behavior': { label: 'Catatan Perilaku', icon: ClipboardList },
    'teacher:homeroom': { label: 'Wali Kelas', icon: School },
    'teacher:picket': { label: 'Guru Piket', icon: Users },
    'teacher:documents': { label: 'Administrasi', icon: FileText },
    'teacher:announcements': { label: 'Pengumuman', icon: Bell },
    'teacher:profile': { label: 'Profil', icon: User },

    // ── ROLE ADMIN ────────────────────────────────────────────────────────────
    'admin:dashboard': { label: 'Dashboard', icon: LayoutDashboard },
    'admin:academic-year': { label: 'Tahun Ajaran', icon: Calendar, parent: 'curriculum-data' },
    'admin:class': { label: 'Daftar Kelas', icon: School, parent: 'class-management' },
    'admin:promotion': { label: 'Kenaikan Kelas', icon: ArrowUpCircle, parent: 'class-management' },
    'admin:placement': { label: 'Penempatan Kelas', icon: Users, parent: 'class-management' },
    'admin:homeroom': { label: 'Wali Kelas', icon: UserCheck, parent: 'class-management' },
    'admin:subject': { label: 'Mata Pelajaran', icon: BookOpen, parent: 'curriculum-data' },
    'admin:schedule': { label: 'Jadwal Pelajaran', icon: Calendar, parent: 'schedule-kbm' },
    'admin:calendar': { label: 'Kalender Akademik', icon: Calendar, parent: 'schedule-kbm' },
    'admin:schedule-group': { label: 'Jadwal & KBM', icon: Calendar, isClickable: false },
    'admin:attendance': { label: 'Presensi', icon: ClipboardList, parent: 'schedule-kbm' },
    'admin:time-slots': { label: 'Pengaturan Jam', icon: Clock, parent: 'curriculum-data' },
    'admin:assessment': { label: 'Input Nilai', icon: FileText, parent: 'assessments' },
    'admin:report-card': { label: 'Cetak Rapor', icon: Printer, parent: 'assessments' },
    'admin:schedule-management': { label: 'Jadwal Pelajaran', icon: Calendar },
    'admin:extracurricular': { label: 'Manajemen Ekskul', icon: Trophy, parent: 'extracurricular-management' },
    'admin:members':         { label: 'Keanggotaan', icon: Users, parent: 'extracurricular-management' },
    'admin:users': { label: 'Manajemen Pengguna', icon: Users, isClickable: false },
    'admin:teachers': { label: 'Data PTK', icon: Users, parent: 'users-staff' },
    'admin:staff': { label: 'Tendik / Staf', icon: Briefcase, parent: 'users-staff' },
    'admin:students': { label: 'Siswa Aktif', icon: GraduationCap, parent: 'users-student' },
    'admin:parents': { label: 'Wali Murid', icon: Users, parent: 'users-student' },
    'admin:ppdb': { label: 'PPDB / Calon', icon: Users, parent: 'users-student' },
    'admin:mutation': { label: 'Mutasi', icon: Users, parent: 'users-student' },
    'admin:alumni': { label: 'Alumni', icon: Trophy, parent: 'users-student' },
    'admin:management': { label: 'Hak Akses & Pengguna', icon: Shield },
    'admin:kelola-pengguna': { label: 'Kelola Pengguna', icon: Users, parent: 'users' },
    'admin:profile': { label: 'Profil', icon: User },
    'admin:settings': { label: 'Pengaturan', icon: Settings },
    'admin:announcements': { label: 'Pengumuman', icon: Bell },

    // ── EXTRACURRICULAR ADVISOR ───────────────────────────────────────────────
    'extracurricular-advisor:dashboard': { label: 'Dashboard', icon: LayoutDashboard },
    'extracurricular-advisor:members': { label: 'Daftar Anggota', icon: Users },
    'extracurricular-advisor:presensi': { label: 'Presensi Kegiatan', icon: ClipboardList },
    'extracurricular-advisor:attendance': { label: 'Presensi Kegiatan', icon: ClipboardList },
    'extracurricular-advisor:profile': { label: 'Profil', icon: User },

    // ── MUTAMAYIZIN ───────────────────────────────────────────────────────────
    'mutamayizin-ekstrakurikuler': { label: 'Ekstrakurikuler', icon: Activity, isClickable: false },
    'mutamayizin-coordinator:dashboard': { label: 'Dashboard', icon: LayoutDashboard },
    'mutamayizin-coordinator:achievements': { label: 'Prestasi', icon: Trophy },
    'mutamayizin-coordinator:add': { label: 'Tambah', icon: Pencil },
    'mutamayizin-coordinator:attendance': { label: 'Presensi Siswa', icon: ClipboardList, parent: 'mutamayizin-ekstrakurikuler' },
    'mutamayizin-coordinator:tutor-recap': { label: 'Presensi Tutor', icon: ClipboardList, parent: 'mutamayizin-ekstrakurikuler' },
    'mutamayizin-coordinator:members': { label: 'Anggota', icon: Users, parent: 'mutamayizin-ekstrakurikuler' },
    'mutamayizin-coordinator:tutors': { label: 'Data Tutor', icon: Users, parent: 'mutamayizin-ekstrakurikuler' },
    'mutamayizin-coordinator:profile': { label: 'Profil', icon: User },

    // ── Generic fallbacks (used when no role match) ───────────────────────────
    'new': { label: 'Tambah Baru', icon: Pencil },
    edit: { label: 'Edit', icon: Pencil },
    notifications: { label: 'Notifikasi', icon: Bell },
    'pengaturan': { label: 'Pengaturan', icon: Settings },
    'anggota': { label: 'Anggota', icon: Users },
    'mutamayizin': { label: 'Mutamayizin', icon: BookOpen },
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

// Routing folder segments to skip (not meaningful pages)
const skipSegments = ['users'];


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

        // Detect the current role from the first segment
        const currentRole = roleSegments.find(r => segments.includes(r)) || '';

        // Helper: resolve a segment to a config entry, role-aware
        const resolveConfig = (segment: string): RouteItem | undefined => {
            const roleKey = `${currentRole}:${segment}`;
            return routeConfig[roleKey] ?? routeConfig[segment];
        };

        // Filter out role-based segments and skip segments
        const filteredSegments = segments.filter(
            segment => !roleSegments.includes(segment) && !skipSegments.includes(segment)
        );

        if (filteredSegments.length === 0) {
            return [];
        }

        const breadcrumbs: BreadcrumbData[] = [];
        let currentPath = '';
        let skippedLabel = '';

        // Track the last meaningful non-ID, non-role segment for context
        let lastMeaningfulSegment = '';

        segments.forEach((segment, index) => {
            currentPath += `/${segment}`;

            // Only add to breadcrumbs if not a role segment or skip segment
            if (!roleSegments.includes(segment) && !skipSegments.includes(segment)) {
                // Skip duplicate 'dashboard' label if already injected
                if (segment === 'dashboard' && breadcrumbs.some(b => b.label === 'Dasbor')) {
                    return;
                }

                // Smart Logic: skip ID segments when followed by 'edit', capture label
                const isIdSegment = segment.match(/^[0-9a-f-]{36}$/i) || /^\d+$/.test(segment) || segment.startsWith('ay-') || segment.startsWith('c-') || segment.startsWith('subj-');
                const nextSegment = segments[index + 1];

                if (isIdSegment && nextSegment === 'edit') {
                    if (segment.startsWith('ay-')) {
                        const parts = segment.split('-');
                        if (parts.length >= 3) skippedLabel = `T.A. ${parts[1]}/${parts[2]}`;
                    } else {
                        skippedLabel = formatSegmentLabel(segment);
                    }
                    return;
                }

                const config = resolveConfig(segment);

                // Special case: 'schedule' sebagai folder routing (bukan leaf page)
                // Jika ada segment setelahnya, tampilkan sebagai non-clickable group
                const isScheduleFolder =
                    segment === 'schedule' &&
                    currentRole === 'admin' &&
                    index < segments.length - 1;

                // Inject non-clickable parent category group if needed
                // Skip jika segment ini sendiri adalah folder group
                if (config?.parent && !isScheduleFolder) {
                    const parentConfig = routeConfig[config.parent];
                    if (parentConfig && !breadcrumbs.some(b => b.label === parentConfig.label)) {
                        breadcrumbs.push({
                            label: parentConfig.label,
                            href: '#',
                            isLast: false,
                            icon: parentConfig.icon,
                            isClickable: false,
                        });
                    }
                }

                let label = isScheduleFolder
                    ? 'Jadwal & KBM'
                    : (config?.label || formatSegmentLabel(segment));

                // For 'new' segment, use context-aware label based on parent
                if (segment === 'new') {
                    const parentConfig = resolveConfig(lastMeaningfulSegment);
                    if (parentConfig) {
                        label = `Tambah ${parentConfig.label}`;
                    } else {
                        label = 'Tambah Baru';
                    }
                }

                // For 'edit' segment following a skipped ID, merge the label
                if (segment === 'edit' && skippedLabel) {
                    const parentConfig = resolveConfig(lastMeaningfulSegment);
                    if (parentConfig) {
                        label = `Edit ${parentConfig.label}`;
                    } else {
                        label = `Edit ${skippedLabel.replace('Detail ', '')}`;
                    }
                    skippedLabel = '';
                }

                const icon = isScheduleFolder ? Calendar : (config?.icon || CircleDot);
                const isClickable = isScheduleFolder ? false : (config?.isClickable !== false);

                breadcrumbs.push({
                    label,
                    href: currentPath,
                    isLast: false,
                    icon,
                    isClickable,
                });

        // Update last meaningful segment (skip IDs and generic segments)
                if (!isIdSegment && segment !== 'new' && segment !== 'edit' && segment !== 'users') {
                    lastMeaningfulSegment = segment;
                }
            }
        });

        // Mark the last breadcrumb
        if (breadcrumbs.length > 0) {
            breadcrumbs[breadcrumbs.length - 1].isLast = true;
        }

        return breadcrumbs;
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
