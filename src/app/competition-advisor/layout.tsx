'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CompetitionAdvisorLayout } from '@/features/competition-advisor/components/CompetitionAdvisorLayout';
import { useRole } from '@/app/context/RoleContext';
import { AcademicYearProvider } from '@/context/AcademicYearContext';
import { AuthLoadingSkeleton } from '@/features/shared/components';

export default function CompetitionAdvisorRouteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { role, isAuthenticated, isLoading } = useRole();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) { router.push('/'); return; }
        if (role !== 'pembimbing_lomba') {
            const map: Record<string, string> = {
                guru: '/teacher/dashboard', siswa: '/student/dashboard',
                admin: '/admin/dashboard', orang_tua: '/parent/dashboard',
                tutor_ekskul: '/extracurricular-advisor/dashboard',
                pj_mutamayizin: '/mutamayizin-coordinator/dashboard',
            };
            router.push(map[role!] ?? '/');
        }
    }, [isAuthenticated, role, router, isLoading]);

    if (isLoading) return <AuthLoadingSkeleton />;
    if (!isAuthenticated || role !== 'pembimbing_lomba') return null;

    return (
        <AcademicYearProvider>
            <CompetitionAdvisorLayout>{children}</CompetitionAdvisorLayout>
        </AcademicYearProvider>
    );
}
