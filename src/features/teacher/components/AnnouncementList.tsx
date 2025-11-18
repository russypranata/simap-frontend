'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Announcement } from '../types/teacher';
import { formatDate, formatTime, getRelativeTime } from '@/features/shared/utils/dateFormatter';
import { 
  Megaphone, 
  Calendar, 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Bell,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';

interface AnnouncementListProps {
  announcements: Announcement[];
  onEdit?: (announcement: Announcement) => void;
  onDelete?: (announcement: Announcement) => void;
  onView?: (announcement: Announcement) => void;
  showActions?: boolean;
  compact?: boolean;
  maxItems?: number;
}

export const AnnouncementList: React.FC<AnnouncementListProps> = ({
  announcements,
  onEdit,
  onDelete,
  onView,
  showActions = true,
  compact = false,
  maxItems,
}) => {
  const displayAnnouncements = maxItems 
    ? announcements.slice(0, maxItems)
    : announcements;

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'academic':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'event':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'holiday':
        return <Bell className="h-4 w-4 text-purple-500" />;
      case 'general':
        return <Info className="h-4 w-4 text-gray-500" />;
      default:
        return <Megaphone className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'academic':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'event':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'holiday':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'general':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case 'academic':
        return 'Akademik';
      case 'event':
        return 'Acara';
      case 'holiday':
        return 'Libur';
      case 'general':
        return 'Umum';
      default:
        return 'Umum';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Penting';
      case 'medium':
        return 'Sedang';
      case 'low':
        return 'Biasa';
      default:
        return 'Biasa';
    }
  };

  const isRead = (announcement: Announcement) => {
    // In a real app, this would check if the user has read the announcement
    // For now, we'll consider announcements from the last 3 days as unread
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return announcement.timestamp < threeDaysAgo;
  };

  if (compact) {
    return (
      <div className="space-y-3">
        {displayAnnouncements.map((announcement) => (
          <div key={announcement.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  {!isRead(announcement) && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  )}
                  <h4 className="text-sm font-medium line-clamp-1">
                    {announcement.title}
                  </h4>
                  <div className="flex items-center space-x-1">
                    <Badge className={getCategoryColor(announcement.type)}>
                      {getCategoryLabel(announcement.type)}
                    </Badge>
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {getPriorityLabel(announcement.priority)}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {announcement.content}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{announcement.sender}</span>
                  <span>{getRelativeTime(announcement.timestamp)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView?.(announcement)}
                  className="h-6 w-6 p-0"
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayAnnouncements.map((announcement) => (
        <Card key={announcement.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-3">
                  {!isRead(announcement) && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  )}
                  <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                    {announcement.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryColor(announcement.type)}>
                      <div className="flex items-center space-x-1">
                        {getCategoryIcon(announcement.type)}
                        <span>{getCategoryLabel(announcement.type)}</span>
                      </div>
                    </Badge>
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {getPriorityLabel(announcement.priority)}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {announcement.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{announcement.sender}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(announcement.timestamp, 'dd MMMM yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(announcement.timestamp)}</span>
                    </div>
                  </div>
                  
                  {showActions && (
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView?.(announcement)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit?.(announcement)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete?.(announcement)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};