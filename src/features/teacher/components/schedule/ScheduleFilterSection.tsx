'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';
import { TeacherClass } from '../../types/teacher';

interface ScheduleFilterSectionProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    filterClass: string;
    setFilterClass: (value: string) => void;
    filterSubject: string;
    setFilterSubject: (value: string) => void;
    classes: TeacherClass[];
    subjects: string[];
    onRefresh: () => void;
    onExport?: () => void;
}

export const ScheduleFilterSection: React.FC<ScheduleFilterSectionProps> = ({
    searchTerm,
    setSearchTerm,
    filterClass,
    setFilterClass,
    filterSubject,
    setFilterSubject,
    classes,
    subjects,
    onRefresh,
    onExport,
}) => {
    return (
        <Card className="gap-4">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Filter className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">Filter Jadwal</CardTitle>
                            <CardDescription>
                                Cari dan filter jadwal mengajar berdasarkan kelas dan mata pelajaran
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRefresh}
                            className="flex items-center space-x-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            <span>Refresh</span>
                        </Button>
                        {onExport && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onExport}
                                className="flex items-center space-x-2"
                            >
                                <Download className="h-4 w-4" />
                                <span>Export</span>
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="space-y-2">
                        <Label htmlFor="search">Cari Jadwal</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search"
                                placeholder="Cari mata pelajaran atau kelas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Filter by Class */}
                    <div className="space-y-2">
                        <Label htmlFor="class-filter">Kelas</Label>
                        <Select value={filterClass} onValueChange={setFilterClass}>
                            <SelectTrigger id="class-filter">
                                <SelectValue placeholder="Semua Kelas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kelas</SelectItem>
                                {classes.map((cls) => (
                                    <SelectItem key={cls.id} value={cls.name}>
                                        {cls.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Filter by Subject */}
                    <div className="space-y-2">
                        <Label htmlFor="subject-filter">Mata Pelajaran</Label>
                        <Select value={filterSubject} onValueChange={setFilterSubject}>
                            <SelectTrigger id="subject-filter">
                                <SelectValue placeholder="Semua Mata Pelajaran" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                                {subjects.map((subject) => (
                                    <SelectItem key={subject} value={subject}>
                                        {subject}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
