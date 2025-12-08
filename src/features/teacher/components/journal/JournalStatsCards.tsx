'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, CheckCircle, TrendingUp } from 'lucide-react';

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Jurnal Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Jurnal</CardTitle>
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.totalJournals}</div>
          <p className="text-xs text-muted-foreground">
            Total jurnal yang dibuat
          </p>
        </CardContent>
      </Card>

      {/* Kelas Diajar Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Kelas Diajar</CardTitle>
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{stats.totalClasses}</div>
          <p className="text-xs text-muted-foreground">
            Jumlah kelas unik yang diajar
          </p>
        </CardContent>
      </Card>

      {/* Mata Pelajaran Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mata Pelajaran</CardTitle>
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.totalSubjects}</div>
          <p className="text-xs text-muted-foreground">
            Jumlah mapel unik yang diajar
          </p>
        </CardContent>
      </Card>

      {/* Jam Mengajar Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jam Mengajar</CardTitle>
          <div className="p-2 bg-cyan-100 rounded-lg">
            <TrendingUp className="h-4 w-4 text-cyan-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cyan-600">{stats.totalHours} JP</div>
          <p className="text-xs text-muted-foreground">
            Total jam pelajaran mengajar
          </p>
        </CardContent>
      </Card>
    </div>
  );
};