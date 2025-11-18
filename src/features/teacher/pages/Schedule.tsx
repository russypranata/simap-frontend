'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeacherData } from '../hooks/useTeacherData';
import { ScheduleList } from '../components/ScheduleList';
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
  Plus,
  RefreshCw,
  Printer,
  Download,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

export const Schedule: React.FC = () => {
  const {
    loading,
    error,
    schedule,
    fetchSchedule,
    clearError,
  } = useTeacherData();

  const [selectedDay, setSelectedDay] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [activeTab, setActiveTab] = useState('weekly');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const weekDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const today = getDayName(new Date());

  useEffect(() => {
    fetchSchedule();
  }, []);

  useEffect(() => {
    if (!selectedDay) {
      setSelectedDay(today);
    }
  }, [today, selectedDay]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchSchedule();
      toast.success('Data jadwal berhasil diperbarui!');
    } catch (error) {
      toast.error('Gagal memperbarui data jadwal');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportData = (format: 'excel' | 'pdf' | 'csv') => {
    toast.success(`Data jadwal berhasil diunduh dalam format ${format.toUpperCase()}!`);
  };

  const handlePrint = () => {
    window.print();
  };

  const getScheduleStats = () => {
    const todaySchedules = schedule.filter(s => s.day === today);
    const totalSchedules = schedule.length;
    const weeklySchedules = schedule.length;
    
    const subjectDistribution = schedule.reduce((acc, curr) => {
      acc[curr.subject] = (acc[curr.subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const roomUsage = schedule.reduce((acc, curr) => {
      acc[curr.room] = (acc[curr.room] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      todaySchedules: todaySchedules.length,
      totalSchedules,
      weeklySchedules,
      subjectDistribution,
      roomUsage,
      uniqueSubjects: Object.keys(subjectDistribution).length,
      uniqueRooms: Object.keys(roomUsage).length,
    };
  };

  const stats = getScheduleStats();

  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    
    const weekDates = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date);
    }
    
    return weekDates;
  };

  const weekDates = getCurrentWeekDates();

  const getDaySchedules = (day: string) => {
    return schedule.filter(s => s.day === day);
  };

  const getCurrentTimeStatus = (time: string) => {
    const currentTime = formatTime(new Date());
    const [startTime, endTime] = time.split('-');
    
    if (currentTime < startTime) {
      return { status: 'upcoming', label: 'Akan Datang', color: 'text-blue-600' };
    } else if (currentTime >= startTime && currentTime <= endTime) {
      return { status: 'ongoing', label: 'Sedang Berlangsung', color: 'text-green-600' };
    } else {
      return { status: 'finished', label: 'Selesai', color: 'text-gray-600' };
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Schedule Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Jadwal Mengajar</h1>
          <p className="text-muted-foreground">
            Kelola dan lihat jadwal mengajar mingguan
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center space-x-2"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jadwal Hari Ini</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todaySchedules}</div>
            <p className="text-xs text-muted-foreground">
              Total jadwal {today}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mingguan</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weeklySchedules}</div>
            <p className="text-xs text-muted-foreground">
              Total jadwal minggu ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mata Pelajaran</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueSubjects}</div>
            <p className="text-xs text-muted-foreground">
              Mata pelajaran berbeda
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ruang Kelas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueRooms}</div>
            <p className="text-xs text-muted-foreground">
              Ruangan yang digunakan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Week Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Overview Minggu Ini</span>
              </CardTitle>
              <CardDescription>
                {formatDate(weekDates[0], 'dd MMMM yyyy')} - {formatDate(weekDates[4], 'dd MMMM yyyy')}
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Minggu Ini</SelectItem>
                  <SelectItem value="next">Minggu Depan</SelectItem>
                  <SelectItem value="last">Minggu Lalu</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportData('excel')}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </CardHeader>
          <CardContent>
            <ScheduleList 
              schedules={schedule} 
              compact={false}
              showActions={false}
            />
          </CardContent>
        </Card>

        {/* Daily Detail */}
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
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDay('')}
                    className="flex items-center space-x-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Pilih Hari Lain</span>
                  </Button>
                  
                  {weekDays.map((day) => (
                    <Button
                      key={day}
                      variant={selectedDay === day ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDay(day)}
                      className="flex items-center space-x-2"
                    >
                      <span>{day}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScheduleList 
                schedules={schedule.filter(s => s.day === selectedDay)} 
                selectedDay={selectedDay}
                showActions={true}
                compact={false}
              />
            </CardContent>
          </Card>
        )}

        {/* Today's Schedule Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Ringkasan Hari Ini</span>
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
                <div className="text-center py-8 text-muted-foreground">
                  <Coffee className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Hari ini tidak ada jadwal mengajar</p>
                  <p className="text-xs">Waktu untuk istirahat dan persiapan!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Distribusi Mata Pelajaran</span>
              </CardTitle>
              <CardDescription>
                Jumlah jam mengajar per mata pelajaran
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.subjectDistribution).map(([subject, count]) => (
                  <div key={subject} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-sm font-medium">{subject}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">{count}</span>
                      <span className="text-xs text-muted-foreground">jam</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Room Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Penggunaan Ruangan</span>
              </CardTitle>
              <CardDescription>
                Frekuensi penggunaan ruangan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.roomUsage).map(([room, count]) => (
                  <div key={room} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        room.includes('Lab') ? 'bg-purple-100' : 
                        room.includes('Ruang') ? 'bg-blue-100' : 
                        'bg-gray-100'
                      }`}></div>
                      <span className="text-sm font-medium">{room}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">{count}</span>
                      <span className="text-xs text-muted-foreground">kali</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Ringkasan Mingguan</span>
            </CardTitle>
            <CardDescription>
              Statistik jadwal mingguan ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stats.weeklySchedules}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total jam mengajar mingguan ini
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-4">
                {weekDays.map((day) => {
                  const daySchedules = schedule.filter(s => s.day === day);
                  const percentage = stats.weeklySchedules > 0 ? (daySchedules.length / stats.weeklySchedules) * 100 : 0;
                  
                  return (
                    <div key={day} className="text-center">
                      <div className="text-sm font-medium mb-1">{day}</div>
                      <div className="text-2xl font-bold">{daySchedules.length}</div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {percentage.toFixed(0)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
};