'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/app/context/RoleContext';
import { ParentLayout } from '@/features/parent/components/ParentLayout';

export default function ParentRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isAuthenticated, isLoading } = useRole();
  const router = useRouter();

  // Role-based auth guard
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else if (role !== 'orang_tua') {
      // Redirect to appropriate dashboard based on role
      switch (role) {
        case 'guru':
          router.push('/dashboard');
          break;
        case 'siswa':
          router.push('/student/dashboard');
          break;
        case 'admin':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/');
      }
    }
  }, [isAuthenticated, role, router]);

  // Show nothing while initializing or redirecting
  if (isLoading || !isAuthenticated || role !== 'orang_tua') {
    return null;
  }

  return <ParentLayout>{children}</ParentLayout>;
}
