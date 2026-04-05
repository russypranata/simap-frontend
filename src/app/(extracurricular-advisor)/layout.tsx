'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdvisorLayout } from '@/features/extracurricular-advisor/components/AdvisorLayout';
import { useRole } from '@/app/context/RoleContext';
import { AcademicYearProvider } from '@/context/AcademicYearContext';
import { AuthLoadingSkeleton } from '@/features/shared/components';

export default function ExtracurricularAdvisorRouteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { role, isAuthenticated, isLoading } = useRole();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) { router.push('/'); return; }
        if (role !== 'tutor_ekskul') {
            const map: Record<string, string> = {
                guru: '/teacher/dashboard', siswa: '/student/dashboard',
                admin: '/admin/dashboard', orang_tua: '/parent/dashboard',
                pj_mutamayizin: '/mutamayizin-coordinator/dashboard',
            };
            router.push(map[role!] ?? '/');
        }
    }, [isAuthenticated, role, router, isLoading]);

    if (isLoading) return <AuthLoadingSkeleton />;
    if (!isAuthenticated || role !== 'tutor_ekskul') return null;

    return (
        <AcademicYearProvider>
            <AdvisorLayout>{children}</AdvisorLayout>
        </AcademicYearProvider>
    );
}
