'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Eye,
  Search
} from 'lucide-react';

interface HistorySectionProps {
  recentRecords: any[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  dateRange: { from: string; to: string };
  setDateRange: (value: { from: string; to: string }) => void;
  onViewDetails: (record: any) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  recentRecords,
  searchTerm,
  setSearchTerm,
  dateRange,
  setDateRange,
  onViewDetails,
}) => {
  return (
    <>
      {/* Search and Date Range Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama siswa atau tanggal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Label className="whitespace-nowrap">Dari:</Label>
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="whitespace-nowrap">Sampai:</Label>
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Riwayat Presensi Terbaru</span>
          </CardTitle>
          <CardDescription>
            Daftar presensi yang telah dicatat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentRecords.length > 0 ? (
              recentRecords.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-muted">
                      {record.status === 'hadir' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {record.status === 'sakit' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                      {record.status === 'izin' && <Clock className="h-4 w-4 text-blue-500" />}
                      {record.status === 'tanpa-keterangan' && <XCircle className="h-4 w-4 text-red-500" />}
                    </div>
                    <div>
                      <p className="font-medium">{record.studentName}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.class} • {record.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <Badge variant={
                        record.status === 'hadir' ? 'default' :
                        record.status === 'sakit' ? 'secondary' :
                        record.status === 'izin' ? 'outline' : 'destructive'
                      }>
                        {record.status === 'tanpa-keterangan' ? 'Alpa' : record.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(record.date, 'dd MMM yyyy')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(record)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Belum ada riwayat presensi</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
