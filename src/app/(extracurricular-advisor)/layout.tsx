'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdvisorLayout } from '@/features/extracurricular-advisor/components/AdvisorLayout';
import { useRole } from '@/app/context/RoleContext';

import { AcademicYearProvider } from '@/context/AcademicYearContext';

export default function ExtracurricularAdvisorRouteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { role, isAuthenticated, isLoading } = useRole();
    const router = useRouter();

    // Role-based auth guard
    useEffect(() => {
        // Wait for loading to complete before checking auth
        if (isLoading) return;

        if (!isAuthenticated) {
            // Redirect to home if not authenticated
            router.push('/');
        } else if (role !== 'tutor_ekskul') {
            // Redirect to appropriate dashboard based on role
            switch (role) {
                case 'guru':
                    router.push('/teacher/dashboard');
                    break;
                case 'siswa':
                    router.push('/student/dashboard');
                    break;
                case 'admin':
                    router.push('/admin/dashboard');
                    break;
                case 'orang_tua':
                    router.push('/parent/dashboard');
                    break;
                case 'pj_mutamayizin':
                    router.push('/mutamayizin-coordinator/dashboard');
                    break;
                default:
                    router.push('/');
            }
        }
    }, [isAuthenticated, role, router, isLoading]);

    // Show nothing while initializing or redirecting
    if (isLoading || !isAuthenticated || role !== 'tutor_ekskul') {
        return null; // Or a loading spinner
    }

    return (
        <AcademicYearProvider>
            <AdvisorLayout>{children}</AdvisorLayout>
        </AcademicYearProvider>
    );
}
