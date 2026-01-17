'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/app/context/RoleContext';
import { AdminLayout } from '@/features/admin/components/AdminLayout';

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { role, isAuthenticated, isLoading } = useRole();
    const router = useRouter();

    // Role-based auth guard
    useEffect(() => {
        // Wait until loading is complete before checking auth
        if (isLoading) return;

        if (!isAuthenticated) {
            router.push('/');
        } else if (role !== 'admin') {
            // Redirect to appropriate dashboard based on role
            switch (role) {
                case 'guru':
                    router.push('/dashboard');
                    break;
                case 'siswa':
                    router.push('/student/dashboard');
                    break;
                case 'orang_tua':
                    router.push('/parent/dashboard');
                    break;
                default:
                    router.push('/');
            }
        }
    }, [isAuthenticated, isLoading, role, router]);

    // Show nothing while loading or redirecting
    if (isLoading || !isAuthenticated || role !== 'admin') {
        return null;
    }

    return <AdminLayout>{children}</AdminLayout>;
}
