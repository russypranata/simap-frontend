'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    total: number;
    hadir: number;
    sakit: number;
    izin: number;
    tanpaKeterangan: number;
  };
  selectedClassName?: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, selectedClassName }) => {
  const calculatePercentage = (value: number) => {
    return stats.total > 0 ? ((value / stats.total) * 100).toFixed(1) : '0.0';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            {selectedClassName || 'Pilih kelas'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hadir</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.hadir}</div>
          <p className="text-xs text-muted-foreground">
            {calculatePercentage(stats.hadir)}% dari total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sakit</CardTitle>
          <AlertCircle className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.sakit}</div>
          <p className="text-xs text-muted-foreground">
            {calculatePercentage(stats.sakit)}% dari total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Izin</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.izin}</div>
          <p className="text-xs text-muted-foreground">
            {calculatePercentage(stats.izin)}% dari total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alpa</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.tanpaKeterangan}</div>
          <p className="text-xs text-muted-foreground">
            {calculatePercentage(stats.tanpaKeterangan)}% dari total
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
