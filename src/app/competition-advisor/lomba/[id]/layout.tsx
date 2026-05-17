'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Users, CheckCircle, Star } from 'lucide-react';

const tabs = [
  { label: 'Anggota Tim', href: 'anggota', icon: Users },
  { label: 'Presensi', href: 'presensi', icon: CheckCircle },
  { label: 'Penilaian', href: 'penilaian', icon: Star },
];

export default function LombaDetailLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 w-fit">
        {tabs.map((tab) => {
          const isActive = pathname.includes(`/competition-advisor/lomba/${id}/${tab.href}`);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={`/competition-advisor/lomba/${id}/${tab.href}`}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
