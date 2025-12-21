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
    const { role, isAuthenticated } = useRole();
    const router = useRouter();

    // Role-based auth guard
    useEffect(() => {
        if (!isAuthenticated) {
            // Redirect to home if not authenticated
            router.push('/');
        } else if (role !== 'pembina_ekskul') {
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
                default:
                    router.push('/');
            }
        }
    }, [isAuthenticated, role, router]);

    // Show nothing while redirecting
    if (!isAuthenticated || role !== 'pembina_ekskul') {
        return null;
    }

    return <AdvisorLayout>{children}</AdvisorLayout>;
}
