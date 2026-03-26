'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useRole } from '@/app/context/RoleContext';

import { NotificationBell } from './NotificationBell';
import { ActiveAcademicYearBadge } from './ActiveAcademicYearBadge';
import { User, LogOut, Calendar } from 'lucide-react';
import { formatDate, getDayName } from '@/features/shared/utils/dateFormatter';
import { getStudentProfile } from '@/features/student/services/studentProfileService';
import { StudentProfileData } from '@/features/student/data/mockStudentData';
import { mockAdvisorData } from '@/features/extracurricular-advisor/data/mockAdvisorData';
import { getParentProfile } from '@/features/parent/services/parentProfileService';
import { ParentProfileData } from '@/features/parent/data/mockParentData';

interface NavbarProps {
    showNotifications?: boolean;
    title?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ showNotifications = true }) => {
    const { role, isAuthenticated, logout } = useRole();
    const [studentProfile, setStudentProfile] =
        React.useState<StudentProfileData | null>(null);
    const [advisorProfile, setAdvisorProfile] = React.useState<typeof mockAdvisorData | null>(null);
    const [parentProfile, setParentProfile] = React.useState<ParentProfileData | null>(null);

    React.useEffect(() => {
        if (isAuthenticated) {
             if (role === 'siswa') {
                const fetchProfile = async () => {
                    try {
                        const data = await getStudentProfile();
                        setStudentProfile(data);
                    } catch (error) {
                        console.error('Failed to fetch student profile for navbar', error);
                    }
                };
                fetchProfile();
            } else if (role === 'tutor_ekskul') {
                setAdvisorProfile(mockAdvisorData);
            } else if (role === 'orang_tua') {
                const fetchParent = async () => {
                    try {
                        const data = await getParentProfile();
                        setParentProfile(data);
                    } catch (error) {
                        console.error('Failed to fetch parent profile', error);
                    }
                };
                fetchParent();
            }
        }
    }, [isAuthenticated, role]);

    const handleLogout = () => {
        logout();
    };

    const getRoleDisplayName = (role: string | null) => {
        switch (role) {
            case 'guru':
                return 'Guru';
            case 'siswa':
                return 'Siswa';
            case 'admin':
                return 'Administrator';
            case 'orang_tua':
                return 'Orang Tua';
            case 'tutor_ekskul':
                return 'Tutor Ekskul';
            case 'pj_mutamayizin':
                return 'PJ Mutamayizin';
            default:
                return 'Pengguna';
        }
    };

    const getInitials = (name?: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const getProfileLink = (role: string | null) => {
        switch (role) {
            case 'siswa':
                return '/student/profile';
            case 'orang_tua':
                return '/parent/settings/profile';
            case 'guru':
                return '/teacher/profile';
            case 'admin':
                return '/admin/profile';
            case 'tutor_ekskul':
                return '/extracurricular-advisor/profile';
            case 'pj_mutamayizin':
                return '/mutamayizin-coordinator/profile';
            default:
                return '/profile';
        }
    };

    const getProfileName = () => {
        if (role === 'tutor_ekskul') return advisorProfile?.name;
        if (role === 'siswa') return studentProfile?.name;
        if (role === 'orang_tua') return parentProfile?.name;
        return undefined;
    };

    const getProfilePicture = () => {
        if (role === 'tutor_ekskul') return advisorProfile?.profilePicture;
        if (role === 'siswa') return studentProfile?.profilePicture;
        // return undefined for orang_tua to force fallback initials
        return undefined;
    };

    return (
        <nav className="bg-card border-b">
            <div className="flex h-16 items-center justify-between pl-2 pr-4">
                <div className="flex items-center space-x-4">
                    <ActiveAcademicYearBadge />
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
                            <p
                                className="text-sm font-medium text-foreground"
                                suppressHydrationWarning
                            >
                                {getDayName(new Date())},{' '}
                                {formatDate(new Date())}
                            </p>
                        </div>
                    </div>

                    {showNotifications && isAuthenticated && (
                        <NotificationBell />
                    )}

                    {isAuthenticated && (
                        <AlertDialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-9 w-9 rounded-full ring-2 ring-primary/10 hover:ring-primary/20 transition-all"
                                    >
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage
                                                src={getProfilePicture() || undefined}
                                                alt={getProfileName() || 'User'}
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="bg-blue-800 text-white">
                                                {getProfileName()
                                                    ? getInitials(getProfileName())
                                                    : getRoleDisplayName(role)?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-80 p-0"
                                    align="end"
                                    forceMount
                                >
                                    <div className="bg-primary/5 p-4 border-b">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                                    <AvatarImage
                                                        src={getProfilePicture() || undefined}
                                                        alt="Avatar"
                                                    />
                                                    <AvatarFallback className="bg-blue-800 text-white font-bold">
                                                        {getProfileName()
                                                            ? getInitials(getProfileName())
                                                            : getRoleDisplayName(role)?.charAt(0) || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"></span>
                                            </div>
                                            <div className="flex flex-col space-y-0.5">
                                                <p className="text-sm font-bold text-foreground">
                                                    {getProfileName() || 'Pengguna'}
                                                </p>
                                                <div className="flex items-center">
                                                    <span className="text-xs font-medium text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded-md border border-border/50">
                                                        {getRoleDisplayName(
                                                            role,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-2 space-y-1">
                                        <Link
                                            href={getProfileLink(role)}
                                            className="block outline-none"
                                        >
                                            <DropdownMenuItem className="p-3 my-0.5 cursor-pointer rounded-lg focus:bg-accent group">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-50 text-blue-600 group-focus:bg-blue-200 transition-colors">
                                                        <User className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex flex-col space-y-0.5">
                                                        <span className="text-sm font-semibold group-data-highlighted:text-accent-foreground">
                                                            Profil Saya
                                                        </span>
                                                        <span className="text-xs text-muted-foreground group-data-highlighted:text-accent-foreground/70">
                                                            Lihat dan edit data
                                                            diri
                                                        </span>
                                                    </div>
                                                </div>
                                            </DropdownMenuItem>
                                        </Link>
                                    </div>

                                    <DropdownMenuSeparator className="my-0" />

                                    <div className="p-2">
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                }
                                                className="p-3 cursor-pointer rounded-lg text-red-600 focus:text-red-700 focus:bg-red-50 group"
                                            >
                                                <div className="flex items-center gap-4 w-full">
                                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-red-50 text-red-600 group-focus:bg-red-200 transition-colors">
                                                        <LogOut className="h-4 w-4" />
                                                    </div>
                                                    <span className="text-sm font-bold">
                                                        Keluar Aplikasi
                                                    </span>
                                                </div>
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <AlertDialogContent className="max-w-[420px] p-0 overflow-hidden border-none shadow-xl">
                                <div className="flex flex-col sm:flex-row h-full">
                                    <div className="w-full sm:w-24 bg-red-50 flex items-center justify-center p-6 sm:p-0">
                                        <div className="p-3 bg-red-100 rounded-2xl rotate-3">
                                            <LogOut className="h-8 w-8 text-red-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1 p-6 sm:p-8 bg-card">
                                        <AlertDialogHeader className="text-left space-y-3">
                                            <AlertDialogTitle className="text-xl font-bold">
                                                Akhiri Sesi?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription className="text-left leading-relaxed">
                                                Sesi Anda saat ini akan segera
                                                diakhiri. Mohon pastikan seluruh
                                                data dan perubahan pekerjaan
                                                Anda telah tersimpan dengan aman
                                                sebelum melanjutkan untuk keluar
                                                dari aplikasi.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="mt-8 gap-3 sm:space-x-0 sm:justify-end">
                                            <AlertDialogCancel className="border-0 bg-muted hover:bg-muted/80 h-11 rounded-xl px-5">
                                                Batal
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleLogout}
                                                className="bg-red-600 hover:bg-red-700 text-white h-11 rounded-xl px-6"
                                            >
                                                Ya, Keluar
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </div>
                                </div>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </div>
        </nav>
    );
};
