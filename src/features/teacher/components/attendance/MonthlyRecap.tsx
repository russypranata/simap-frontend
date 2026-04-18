/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CalendarRange } from 'lucide-react';

interface MonthlyRecapProps {
  selectedClassData: any;
  stats: {
    total: number;
    hadir: number;
    sakit: number;
    izin: number;
    tanpaKeterangan: number;
    percentage: string;
  };
}

export const MonthlyRecap: React.FC<MonthlyRecapProps> = ({
  selectedClassData,
  stats,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarRange className="h-5 w-5" />
          <span>Rekap Bulanan</span>
        </CardTitle>
        <CardDescription>
          Ringkasan kehadiran siswa per bulan atau semester
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bulan</Label>
              <Select defaultValue={new Date().getMonth().toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Januari</SelectItem>
                  <SelectItem value="1">Februari</SelectItem>
                  <SelectItem value="2">Maret</SelectItem>
                  <SelectItem value="3">April</SelectItem>
                  <SelectItem value="4">Mei</SelectItem>
                  <SelectItem value="5">Juni</SelectItem>
                  <SelectItem value="6">Juli</SelectItem>
                  <SelectItem value="7">Agustus</SelectItem>
                  <SelectItem value="8">September</SelectItem>
                  <SelectItem value="9">Oktober</SelectItem>
                  <SelectItem value="10">November</SelectItem>
                  <SelectItem value="11">Desember</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tahun</Label>
              <Select defaultValue={new Date().getFullYear().toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-6 bg-muted/30 rounded-lg">
            <div className="text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Rekap Bulanan</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Lihat ringkasan kehadiran siswa per bulan untuk kelas {selectedClassData?.name || 'yang dipilih'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">{stats.hadir}</div>
                  <div className="text-xs text-muted-foreground">Total Hadir</div>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-yellow-600">{stats.sakit}</div>
                  <div className="text-xs text-muted-foreground">Total Sakit</div>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-blue-600">{stats.izin}</div>
                  <div className="text-xs text-muted-foreground">Total Izin</div>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-red-600">{stats.tanpaKeterangan}</div>
                  <div className="text-xs text-muted-foreground">Total Alpa</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
