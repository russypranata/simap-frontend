'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Schedule } from '../types/teacher';
import { formatDate, formatTime, getDayName } from '@/features/shared/utils/dateFormatter';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  BookOpen,
  User,
  Bell,
  Coffee,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

interface ScheduleListProps {
  schedules: Schedule[];
  selectedDay?: string;
  onEdit?: (schedule: Schedule) => void;
  onDelete?: (schedule: Schedule) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const ScheduleList: React.FC<ScheduleListProps> = ({
  schedules,
  selectedDay,
  onEdit,
  onDelete,
  showActions = true,
  compact = false,
}) => {
  const getDaySchedules = (day: string) => {
    return schedules.filter(schedule => schedule.day === day);
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'Matematika': 'bg-blue-100 text-blue-800 border-blue-200',
      'Fisika': 'bg-green-100 text-green-800 border-green-200',
      'Kimia': 'bg-purple-100 text-purple-800 border-purple-200',
      'Biologi': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Bahasa Indonesia': 'bg-orange-100 text-orange-800 border-orange-200',
      'Bahasa Inggris': 'bg-pink-100 text-pink-800 border-pink-200',
      'Sejarah': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Geografi': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Ekonomi': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Sosiologi': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[subject] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRoomColor = (room: string) => {
    if (room.includes('Lab')) return 'text-purple-600';
    if (room.includes('Ruang')) return 'text-blue-600';
    if (room.includes('Lapangan')) return 'text-green-600';
    return 'text-gray-600';
  };

  const getCurrentTimeStatus = (time: string) => {
    const currentTime = formatTime(new Date());
    const [startTime, endTime] = time.split('-');
    
    if (currentTime >= startTime && currentTime <= endTime) {
      return { status: 'ongoing', color: 'text-green-600', label: 'Sedang Berlangsung' };
    } else if (currentTime < startTime) {
      return { status: 'upcoming', color: 'text-blue-600', label: 'Akan Datang' };
    } else {
      return { status: 'completed', color: 'text-gray-600', label: 'Selesai' };
    }
  };

  const weekDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const today = getDayName(new Date());

  if (compact) {
    return (
      <div className="space-y-2">
        {weekDays.map((day) => {
          const daySchedules = getDaySchedules(day);
          return (
            <div key={day} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{day}</h4>
                {day === today && (
                  <Badge variant="default" className="text-xs">Hari Ini</Badge>
                )}
              </div>
              {daySchedules.length > 0 ? (
                <div className="space-y-1">
                  {daySchedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium">{schedule.time}</span>
                        <span className="text-xs">{schedule.subject}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {schedule.class}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Tidak ada jadwal</p>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Weekly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {weekDays.map((day) => {
          const daySchedules = getDaySchedules(day);
          const isToday = day === today;
          
          return (
            <Card key={day} className={`${isToday ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{day}</CardTitle>
                  {isToday && (
                    <Badge variant="default" className="text-xs">Hari Ini</Badge>
                  )}
                </div>
                <CardDescription className="text-xs">
                  {daySchedules.length} jadwal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {daySchedules.length > 0 ? (
                  daySchedules.map((schedule) => {
                    const timeStatus = getCurrentTimeStatus(schedule.time);
                    return (
                      <div
                        key={schedule.id}
                        className={`p-2 rounded-lg border ${
                          isToday && timeStatus.status === 'ongoing' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-muted/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{schedule.time}</span>
                          {isToday && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${timeStatus.color} border-current`}
                            >
                              {timeStatus.label}
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs font-medium line-clamp-1">
                              {schedule.subject}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {schedule.class}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className={`text-xs ${getRoomColor(schedule.room)}`}>
                              {schedule.room}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Libur</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Schedule List */}
      {selectedDay && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Jadwal {selectedDay}</span>
                </CardTitle>
                <CardDescription>
                  {formatDate(new Date(), 'EEEE, dd MMMM yyyy')}
                </CardDescription>
              </div>
              {showActions && (
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Jadwal
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getDaySchedules(selectedDay).length > 0 ? (
                getDaySchedules(selectedDay).map((schedule) => {
                  const timeStatus = getCurrentTimeStatus(schedule.time);
                  return (
                    <div
                      key={schedule.id}
                      className={`p-4 rounded-lg border ${
                        timeStatus.status === 'ongoing' 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-card'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="flex items-center space-x-2">
                              <Clock className={`h-4 w-4 ${timeStatus.color}`} />
                              <span className="font-medium">{schedule.time}</span>
                              {timeStatus.status === 'ongoing' && (
                                <Badge variant="default" className="text-xs">
                                  {timeStatus.label}
                                </Badge>
                              )}
                            </div>
                            
                            <Badge className={getSubjectColor(schedule.subject)}>
                              {schedule.subject}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">Kelas</p>
                                <p className="text-muted-foreground">{schedule.class}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">Ruang</p>
                                <p className={`text-muted-foreground ${getRoomColor(schedule.room)}`}>
                                  {schedule.room}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">Pengajar</p>
                                <p className="text-muted-foreground">{schedule.teacher}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {showActions && (
                          <div className="flex items-center space-x-1 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit?.(schedule)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete?.(schedule)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Tidak ada jadwal pada hari {selectedDay}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Schedule Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Ringkasan Jadwal Hari Ini</span>
          </CardTitle>
          <CardDescription>
            Overview jadwal mengajar hari ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getDaySchedules(today).length > 0 ? (
              getDaySchedules(today).map((schedule) => {
                const timeStatus = getCurrentTimeStatus(schedule.time);
                return (
                  <div
                    key={schedule.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      timeStatus.status === 'ongoing' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        timeStatus.status === 'ongoing' 
                          ? 'bg-green-100' 
                          : 'bg-muted'
                      }`}>
                        <Clock className={`h-4 w-4 ${timeStatus.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{schedule.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {schedule.class} • {schedule.room}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{schedule.time}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${timeStatus.color} border-current`}
                      >
                        {timeStatus.label}
                      </Badge>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Coffee className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Hari ini tidak ada jadwal mengajar</p>
                <p className="text-xs">Waktu untuk istirahat dan persiapan!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};