'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { TimeSlotList } from '@/features/admin/components/settings/TimeSlotList';
import { DayKey } from '@/features/admin/services/timeSlotService';

const DAYS: { key: DayKey; label: string }[] = [
    { key: 'monday',    label: 'Senin' },
    { key: 'tuesday',   label: 'Selasa' },
    { key: 'wednesday', label: 'Rabu' },
    { key: 'thursday',  label: 'Kamis' },
    { key: 'friday',    label: 'Jumat' },
    { key: 'saturday',  label: 'Sabtu' },
];

const TimeSlotConfigPage = () => {
    const [activeDay, setActiveDay] = useState<DayKey>('monday');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Pengaturan{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Jam Pelajaran
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Clock className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Konfigurasi slot waktu dan durasi jam pelajaran untuk setiap hari
                    </p>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-0 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 rounded-xl">
                            <Clock className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-slate-800">
                                Master Slot Waktu
                            </CardTitle>
                            <CardDescription className="text-sm text-slate-600">
                                Atur jam mulai dan selesai. Perubahan akan berdampak pada jadwal pelajaran.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Tabs value={activeDay} onValueChange={(v) => setActiveDay(v as DayKey)} className="w-full">
                        <div className="px-6 pt-4 pb-0">
                            <TabsList className="grid w-full grid-cols-6 h-9">
                                {DAYS.map(({ key, label }) => (
                                    <TabsTrigger
                                        key={key}
                                        value={key}
                                        className="text-xs data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
                                    >
                                        {label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {DAYS.map(({ key, label }) => (
                            <TabsContent key={key} value={key} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                                <TimeSlotList day={key} dayLabel={label} />
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default TimeSlotConfigPage;
