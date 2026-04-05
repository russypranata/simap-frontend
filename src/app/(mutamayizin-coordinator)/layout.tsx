'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MutamayizinLayout } from '@/features/mutamayizin/components/MutamayizinLayout';
import { useRole } from '@/app/context/RoleContext';
import { AcademicYearProvider } from '@/context/AcademicYearContext';
import { AuthLoadingSkeleton } from '@/features/shared/components';

export default function MutamayizinCoordinatorRouteLayout({ children }: { children: React.ReactNode }) {
    const { role, isAuthenticated, isLoading } = useRole();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) { router.push('/'); return; }
        if (role !== 'pj_mutamayizin') {
            const map: Record<string, string> = {
                guru: '/teacher/dashboard', siswa: '/student/dashboard',
                admin: '/admin/dashboard', orang_tua: '/parent/dashboard',
                tutor_ekskul: '/extracurricular-advisor/dashboard',
            };
            router.push(map[role!] ?? '/');
        }
    }, [isAuthenticated, role, router, isLoading]);

    if (isLoading) return <AuthLoadingSkeleton />;
    if (!isAuthenticated || role !== 'pj_mutamayizin') return null;

    return (
        <AcademicYearProvider>
            <MutamayizinLayout>{children}</MutamayizinLayout>
        </AcademicYearProvider>
    );
}
