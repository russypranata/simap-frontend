'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TeachingJournal } from '../types/teacher';
import { formatDate, formatTime, getRelativeTime } from '@/features/shared/utils/dateFormatter';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Clock, 
  Edit, 
  Eye, 
  Trash2, 
  FileText,
  Target,
  Award,
  CheckCircle,
  AlertCircle,
  MoreHorizontal
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
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: 'completed' | 'in_progress' | 'draft') => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      completed: 'default',
      in_progress: 'secondary',
      draft: 'outline',
    };

    const labels: Record<string, string> = {
      completed: 'Selesai',
      in_progress: 'Dalam Proses',
      draft: 'Draft',
    };

    return (
      <Badge variant={variants[status] || 'outline'} className="flex items-center space-x-1">
        {getStatusIcon(status)}
        <span>{labels[status] || status}</span>
      </Badge>
    );
  };

  const getAttendancePercentage = () => {
    if (journal.attendance.total === 0) return 0;
    return ((journal.attendance.present / journal.attendance.total) * 100).toFixed(1);
  };

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <h4 className="font-medium text-sm truncate">{journal.subject}</h4>
                <Badge variant="outline" className="text-xs">{journal.class}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {journal.topic}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatDate(journal.date, 'dd MMM yyyy')}
                </span>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {journal.attendance.present}/{journal.attendance.total}
                  </span>
                </div>
              </div>
            </div>
            {showActions && (
              <div className="flex items-center space-x-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView?.(journal)}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(journal)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg truncate">{journal.subject}</CardTitle>
              <Badge variant="outline">{journal.class}</Badge>
            </div>
            <CardDescription className="text-sm">
              {formatDate(journal.date, 'EEEE, dd MMMM yyyy')}
            </CardDescription>
          </div>
          {showActions && (
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView?.(journal)}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(journal)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(journal)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Material and Topic */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Materi:</span>
          </div>
          <p className="text-sm text-foreground font-medium">{journal.material}</p>
          <p className="text-sm text-muted-foreground">{journal.topic}</p>
        </div>

        {/* Teaching Method and Media */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Metode:</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {journal.teachingMethod}
            </p>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Media:</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {journal.media}
            </p>
          </div>
        </div>

        {/* Attendance Overview */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Kehadiran:</span>
            </div>
            <span className="text-sm font-medium">
              {journal.attendance.present}/{journal.attendance.total} ({getAttendancePercentage()}%)
            </span>
          </div>
          
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-medium text-green-600">{journal.attendance.present}</div>
              <div className="text-green-600">Hadir</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded">
              <div className="font-medium text-yellow-600">{journal.attendance.sick}</div>
              <div className="text-yellow-600">Sakit</div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="font-medium text-blue-600">{journal.attendance.permit}</div>
              <div className="text-blue-600">Izin</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="font-medium text-red-600">{journal.attendance.absent}</div>
              <div className="text-red-600">Absen</div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {journal.notes && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Catatan:</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {journal.notes}
            </p>
          </div>
        )}

        {/* Evaluation */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Evaluasi:</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {journal.evaluation}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(journal.date, 'dd MMM yyyy')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{getRelativeTime(journal.date)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusBadge('completed')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};