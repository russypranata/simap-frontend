'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Target, Award, CheckCircle, AlertCircle, MoreHorizontal, History
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
  const getStatusIcon = (status: 'completed' | 'in_progress' | 'draft') => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: 'completed' | 'in_progress' | 'draft') => {
    const variants: Record<'completed' | 'in_progress' | 'draft', 'default' | 'secondary' | 'outline'> = { 
      completed: 'default', 
      in_progress: 'secondary', 
      draft: 'outline' 
    };
    const labels = { completed: 'Selesai', in_progress: 'Dalam Proses', draft: 'Draft' };

    return (
      <Badge variant={variants[status] || 'outline'} className="flex items-center gap-1 text-sm">
        {getStatusIcon(status)}
        <span>{labels[status] || status}</span>
      </Badge>
    );
  };

  const getAttendancePercentage = () => {
    if (journal.attendance.total === 0) return 0;
    return ((journal.attendance.present / journal.attendance.total) * 100).toFixed(1);
  };

  // Format teaching methods for display
  const formatTeachingMethods = (methods: string | string[]) => {
    if (Array.isArray(methods)) {
      return methods.join(', ');
    }
    return methods;
  };

  // Format media for display
  const formatMedia = (media: string | string[]) => {
    if (Array.isArray(media)) {
      return media.join(', ');
    }
    return media;
  };

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer border-0 bg-card/90 backdrop-blur-sm overflow-hidden rounded-lg">
        <CardContent className="p-4">
          {/* Header with class badge on top-left and action menu on top-right */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <Badge variant="default" className="text-xs">
              {journal.class}
            </Badge>
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 p-0">
                    <MoreHorizontal className="h-3.5 w-3.5 rotate-90" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="flex flex-col">
                  <DropdownMenuItem onClick={() => onView?.(journal)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Lihat
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit?.(journal)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-primary shrink-0" />
                <h4 className="font-medium text-sm truncate">{journal.subject}</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {journal.topic}
              </p>
              {/* Improved layout for date and lesson hour */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(journal.date, 'dd MMM yyyy')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{journal.lessonHour}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full version
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-card/90 backdrop-blur-sm overflow-hidden rounded-lg">
      <CardHeader className="pb-3 px-6 pt-4">
        {/* Header with class badge on top-left and action menu on top-right */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <Badge variant="default" className="text-sm">
            {journal.class}
          </Badge>
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4 rotate-90" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="flex flex-col">
                <DropdownMenuItem onClick={() => onView?.(journal)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Lihat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(journal)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(journal)}
                  className="text-red-600 focus:bg-red-50 focus:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-5 w-5 text-primary shrink-0" />
              <CardTitle className="text-lg font-semibold truncate">{journal.subject}</CardTitle>
            </div>
            {/* Improved layout for date and lesson hour */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <CardDescription className="text-sm flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(journal.date, 'EEEE, dd MMMM yyyy')}
              </CardDescription>
              <CardDescription className="text-sm flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {journal.lessonHour}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 space-y-4">
        {/* Material */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium">Materi</span>
          </div>
          <p className="text-sm text-foreground truncate">{journal.material}</p>
        </div>
        
        {/* Activity */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium">Kegiatan</span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{journal.topic}</p>
        </div>

        {/* Method & Media */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium">Metode</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{formatTeachingMethods(journal.teachingMethod)}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium">Media</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{formatMedia(journal.media)}</p>
          </div>
        </div>

        {/* Attendance */}
        <div className="p-3 bg-muted/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Kehadiran</span>
            </div>
            <span className="text-sm font-medium">
              {journal.attendance.present}/{journal.attendance.total} ({getAttendancePercentage()}%)
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(['present', 'sick', 'permit', 'absent'] as const).map((type) => {
              const labels = { present: 'Hadir', sick: 'Sakit', permit: 'Izin', absent: 'Alpa' };
              const colors = {
                present: 'bg-green-50 text-green-700',
                sick: 'bg-yellow-50 text-yellow-700',
                permit: 'bg-blue-50 text-blue-700',
                absent: 'bg-red-50 text-red-700',
              };
              return (
                <div key={type} className="text-center p-2 rounded-md">
                  <div className={`font-semibold text-sm ${colors[type].split(' ')[1]}`}>
                    {journal.attendance[type]}
                  </div>
                  <div className={`text-xs mt-0.5 ${colors[type].split(' ')[1]}`}>
                    {labels[type]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-muted">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <History className="h-4 w-4" />
              <span>{getRelativeTime(journal.date)}</span>
            </div>
          </div>
          <div>{getStatusBadge('completed')}</div>
        </div>
      </CardContent>
    </Card>
  );
};