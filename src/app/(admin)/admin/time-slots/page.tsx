'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { TimeSlotList } from '@/features/admin/components/settings/TimeSlotList';
import { 
    MOCK_MONDAY_SLOTS, 
    MOCK_TUESDAY_SLOTS, 
    MOCK_WEDNESDAY_SLOTS, 
    MOCK_FRIDAY_SLOTS,
    TimeSlot 
} from '@/features/admin/data/mockTimeSlots';


const TimeSlotConfigPage = () => {
    // In a real app, we would fetch this from an API
    // For now, we initialize state with our Mocks
    const [mondaySlots, setMondaySlots] = useState<TimeSlot[]>(MOCK_MONDAY_SLOTS);
    const [tuesdaySlots, setTuesdaySlots] = useState<TimeSlot[]>(MOCK_TUESDAY_SLOTS);
    const [wednesdaySlots, setWednesdaySlots] = useState<TimeSlot[]>(MOCK_WEDNESDAY_SLOTS); // Assuming you added this
    const [thursdaySlots, setThursdaySlots] = useState<TimeSlot[]>(MOCK_TUESDAY_SLOTS); // Thursday same as Tuesday default
    const [fridaySlots, setFridaySlots] = useState<TimeSlot[]>(MOCK_FRIDAY_SLOTS);
    const [saturdaySlots, setSaturdaySlots] = useState<TimeSlot[]>(MOCK_TUESDAY_SLOTS); // Saturday default

    const handleSave = (day: string, newSlots: TimeSlot[]) => {
        // In a real app, this would be an API call
        // await scheduleService.updateTimeSlots(day, newSlots);
        
        switch(day) {
            case 'Senin': setMondaySlots(newSlots); break;
            case 'Selasa': setTuesdaySlots(newSlots); break;
            case 'Rabu': setWednesdaySlots(newSlots); break;
            case 'Kamis': setThursdaySlots(newSlots); break;
            case 'Jumat': setFridaySlots(newSlots); break;
            case 'Sabtu': setSaturdaySlots(newSlots); break;
        }
    };

    return (
        <div className="space-y-6">


            {/* Page Header */}
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
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Master Slot Waktu
                                </CardTitle>
                                <CardDescription>
                                    Atur jam mulai dan selesai. Perubahan akan berdampak pada jadwal pelajaran.
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Tabs defaultValue="Senin" className="w-full">
                        <div className="px-6 pt-4">
                            <TabsList className="grid w-full grid-cols-6 h-9">
                                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(day => (
                                    <TabsTrigger
                                        key={day}
                                        value={day}
                                        className="text-xs data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
                                    >
                                        {day}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        <TabsContent value="Senin" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                            <TimeSlotList day="Senin" initialSlots={mondaySlots} onSave={handleSave} />
                        </TabsContent>
                        <TabsContent value="Selasa" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                            <TimeSlotList day="Selasa" initialSlots={tuesdaySlots} onSave={handleSave} />
                        </TabsContent>
                        <TabsContent value="Rabu" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                             <TimeSlotList day="Rabu" initialSlots={wednesdaySlots} onSave={handleSave} />
                        </TabsContent>
                        <TabsContent value="Kamis" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                             <TimeSlotList day="Kamis" initialSlots={thursdaySlots} onSave={handleSave} />
                        </TabsContent>
                        <TabsContent value="Jumat" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                             <TimeSlotList day="Jumat" initialSlots={fridaySlots} onSave={handleSave} />
                        </TabsContent>
                        <TabsContent value="Sabtu" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                             <TimeSlotList day="Sabtu" initialSlots={saturdaySlots} onSave={handleSave} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default TimeSlotConfigPage;
