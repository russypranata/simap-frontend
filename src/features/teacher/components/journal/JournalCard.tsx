'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TeachingJournal } from '@/features/teacher/types/teacher';
import { formatDate, getRelativeTime } from '@/features/shared/utils/dateFormatter';
import {
  BookOpen, Calendar, Users, Clock, Edit, Eye, Trash2, FileText,
  Target, Award, CheckCircle, AlertCircle, MoreHorizontal, History,
  Layout, MonitorPlay
} from 'lucide-react';

interface JournalCardProps {
  journal: TeachingJournal;
  onView?: (journal: TeachingJournal) => void;
  onEdit?: (journal: TeachingJournal) => void;
  onDelete?: (journal: TeachingJournal) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const JournalCard: React.FC<JournalCardProps> = ({
  journal,
  onView,
  onEdit,
  onDelete,
  showActions = true,
  compact = false,
}) => {
  const getAttendancePercentage = () => {
    if (journal.attendance.total === 0) return 0;
    return Math.round((journal.attendance.present / journal.attendance.total) * 100);
  };

  const attendancePercentage = getAttendancePercentage();

  // Format teaching methods for display
  const formatList = (items: string | string[]) => {
    if (Array.isArray(items)) {
      return items.join(', ');
    }
    return items;
  };

  if (compact) {
    return (
      <Card className="transition-all duration-200 cursor-pointer border-border bg-card overflow-hidden rounded-xl group">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium border-0">
              {journal.class}
            </Badge>
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0 opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView?.(journal)}>
                    <Eye className="h-4 w-4 mr-2" /> Lihat
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit?.(journal)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="space-y-2">
            <div>
              <h4 className="font-semibold text-sm line-clamp-1">
                {journal.subject}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {journal.material}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(journal.date, 'dd MMM')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{journal.lessonHour}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full version
  return (
    <Card className="group transition-all duration-300 border-border bg-card overflow-hidden rounded-xl flex flex-col h-full">
      <CardHeader className="pb-1 px-5 pt-5">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2 flex-1">
            <Badge variant="outline" className="px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border-0 w-fit">
              {journal.class}
            </Badge>

            <div className="space-y-1">
              <CardTitle className="text-lg font-bold leading-tight">
                {journal.subject}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(journal.date, 'EEEE, dd MMM yyyy')}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{journal.lessonHour}</span>
                </div>
              </div>
            </div>
          </div>

          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onView?.(journal)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(journal)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Jurnal
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(journal)}
                  className="text-red-600 focus:text-red-700 focus:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-0 flex-1 flex flex-col gap-4">
        {/* Main Content */}
        <div className="space-y-3 flex-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <Target className="h-3.5 w-3.5" />
              Materi & Topik
            </div>
            <p className="text-sm font-medium text-foreground line-clamp-1">
              {journal.material}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {journal.topic}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Layout className="h-3.5 w-3.5" />
                <span>Metode</span>
              </div>
              <p className="text-xs font-medium line-clamp-1" title={formatList(journal.teachingMethod)}>
                {formatList(journal.teachingMethod)}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MonitorPlay className="h-3.5 w-3.5" />
                <span>Media</span>
              </div>
              <p className="text-xs font-medium line-clamp-1" title={formatList(journal.media)}>
                {formatList(journal.media)}
              </p>
            </div>
          </div>
        </div>

        {/* Attendance Section - Grid Layout */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-border/50 rounded-lg mt-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Kehadiran</span>
            </div>
            <span className="text-sm font-medium">
              {journal.attendance.present}/{journal.attendance.total} ({attendancePercentage}%)
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(['present', 'sick', 'permit', 'absent'] as const).map((type) => {
              const labels = { present: 'Hadir', sick: 'Sakit', permit: 'Izin', absent: 'Alpa' };
              const colors = {
                present: 'bg-green-50 text-green-700 border-green-200',
                sick: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                permit: 'bg-blue-50 text-blue-700 border-blue-200',
                absent: 'bg-red-50 text-red-700 border-red-200',
              };
              return (
                <div key={type} className={`text-center p-2 rounded-md shadow-sm border ${colors[type]}`}>
                  <div className="font-semibold text-sm">
                    {journal.attendance[type]}
                  </div>
                  <div className="text-xs mt-0.5">
                    {labels[type]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
