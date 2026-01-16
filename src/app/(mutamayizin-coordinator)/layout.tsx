'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MutamayizinLayout } from '@/features/mutamayizin/components/MutamayizinLayout';
import { useRole } from '@/app/context/RoleContext';

export default function MutamayizinCoordinatorRouteLayout({
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
            router.push('/');
        } else if (role !== 'mutamayizin_coordinator') {
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
                case 'extracurricular_tutor':
                    router.push('/extracurricular-advisor/dashboard');
                    break;
                default:
                    router.push('/');
            }
        }
    }, [isAuthenticated, role, router, isLoading]);

    // Show loading or nothing while initializing
    if (isLoading || !isAuthenticated || role !== 'mutamayizin_coordinator') {
        return null;
    }

    return <MutamayizinLayout>{children}</MutamayizinLayout>;
}
