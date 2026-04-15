'use client';

import React from 'react';
import { BookOpen, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { StatCard } from '@/features/shared/components';

interface JournalStats {
  totalJournals: number;
  totalClasses: number;
  totalSubjects: number;
  totalHours: number;
}

interface JournalStatsCardsProps {
  stats: JournalStats;
}

export const JournalStatsCards: React.FC<JournalStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <StatCard title="Total Jurnal" value={stats.totalJournals} subtitle="Total jurnal yang dibuat" icon={BookOpen} color="blue" />
      <StatCard title="Kelas Diajar" value={stats.totalClasses} subtitle="Jumlah kelas unik" icon={Users} color="purple" />
      <StatCard title="Mata Pelajaran" value={stats.totalSubjects} subtitle="Jumlah mapel unik" icon={CheckCircle} color="green" />
      <StatCard title="Jam Mengajar" value={`${stats.totalHours} JP`} subtitle="Total jam pelajaran" icon={TrendingUp} color="amber" />
    </div>
  );
};