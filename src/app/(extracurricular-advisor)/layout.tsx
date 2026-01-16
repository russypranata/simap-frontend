'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdvisorLayout } from '@/features/extracurricular-advisor/components/AdvisorLayout';
import { useRole } from '@/app/context/RoleContext';

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
        } else if (role !== 'extracurricular_tutor') {
            // Redirect to appropriate dashboard based on role
            switch (role) {
                case 'subject_teacher':
                case 'homeroom_teacher':
                case 'picket_teacher':
                case 'headmaster':
                    router.push('/teacher/dashboard');
                    break;
                case 'student':
                    router.push('/student/dashboard');
                    break;
                case 'admin':
                    router.push('/admin/dashboard');
                    break;
                case 'parent':
                    router.push('/parent/dashboard');
                    break;
                case 'mutamayizin_coordinator':
                    router.push('/mutamayizin-coordinator/dashboard');
                    break;
                default:
                    router.push('/');
            }
        }
    }, [isAuthenticated, role, router, isLoading]);

    // Show nothing while initializing or redirecting
    if (isLoading || !isAuthenticated || role !== 'extracurricular_tutor') {
        return null;
    }

    return <AdvisorLayout>{children}</AdvisorLayout>;
}
