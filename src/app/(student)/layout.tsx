'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StudentLayout } from '@/features/student/components/StudentLayout';
import { useRole } from '@/app/context/RoleContext';
import { AcademicYearProvider } from '@/context/AcademicYearContext';
import { AuthLoadingSkeleton } from '@/features/shared/components';

export default function StudentRouteLayout({ children }: { children: React.ReactNode }) {
  const { role, isAuthenticated, isLoading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.push('/'); return; }
    if (role !== 'siswa') {
      const map: Record<string, string> = {
        guru: '/teacher/dashboard', admin: '/admin/dashboard',
        orang_tua: '/parent/dashboard', tutor_ekskul: '/extracurricular-advisor/dashboard',
        pj_mutamayizin: '/mutamayizin-coordinator/dashboard',
      };
      router.push(map[role!] ?? '/');
    }
  }, [isAuthenticated, role, router, isLoading]);

  if (isLoading) return <AuthLoadingSkeleton />;
  if (!isAuthenticated || role !== 'siswa') return null;

  return (
    <AcademicYearProvider>
      <StudentLayout>{children}</StudentLayout>
    </AcademicYearProvider>
  );
}
