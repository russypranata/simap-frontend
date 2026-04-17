'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/app/context/RoleContext';
import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { AcademicYearProvider } from '@/context/AcademicYearContext';
import { AuthLoadingSkeleton } from '@/features/shared/components';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    const { role, isAuthenticated, isLoading } = useRole();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) { router.push('/'); return; }
        if (role !== 'admin') {
            const map: Record<string, string> = {
                guru: '/teacher/dashboard', siswa: '/student/dashboard',
                orang_tua: '/parent/dashboard', tutor_ekskul: '/extracurricular-advisor/dashboard',
                pj_mutamayizin: '/mutamayizin-coordinator/dashboard',
            };
            router.push(map[role!] ?? '/');
        }
    }, [isAuthenticated, isLoading, role, router]);

    // Render layout immediately — show skeleton only inside content area
    // This prevents sidebar from remounting on every refresh
    if (!isAuthenticated && !isLoading) return null;

    return (
        <AcademicYearProvider>
            <AdminLayout>
                {isLoading ? <AuthLoadingSkeleton /> : children}
            </AdminLayout>
        </AcademicYearProvider>
    );
}
