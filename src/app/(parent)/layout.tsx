'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/app/context/RoleContext';
import { ParentLayout } from '@/features/parent/components/ParentLayout';
import { AcademicYearProvider } from '@/context/AcademicYearContext';

export default function ParentRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isAuthenticated, isLoading } = useRole();
  const router = useRouter();

  // Role-based auth guard
  // Role-based auth guard
  useEffect(() => {
    // Wait for loading to complete before checking auth
    if (isLoading) return;

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
  }, [isAuthenticated, role, router, isLoading]);

  // Show nothing while initializing or redirecting
  if (isLoading || !isAuthenticated || role !== 'orang_tua') {
    return null;
  }

  return (
    <AcademicYearProvider>
      <ParentLayout>{children}</ParentLayout>
    </AcademicYearProvider>
  );
}
