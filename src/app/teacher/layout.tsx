'use client';

import { MainLayout } from '@/app/layout/MainLayout';
import { usePathname } from 'next/navigation';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <MainLayout currentPath={pathname}>
      {children}
    </MainLayout>
  );
}
