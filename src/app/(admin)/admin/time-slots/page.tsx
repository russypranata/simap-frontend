'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { TimeSlotList } from '@/features/admin/components/settings/TimeSlotList';
import { TimeSlotPageSkeleton } from '@/features/admin/components/settings/TimeSlotSkeleton';
import { toast } from 'sonner';
import { 
    MOCK_MONDAY_SLOTS, 
    MOCK_TUESDAY_SLOTS, 
    MOCK_WEDNESDAY_SLOTS, 
    MOCK_THURSDAY_SLOTS,
    MOCK_FRIDAY_SLOTS,
    MOCK_SATURDAY_SLOTS,
    TimeSlot 
} from '@/features/admin/data/mockTimeSlots';


const TimeSlotConfigPage = () => {
    // In a real app, we would fetch this from an API
    // For now, we initialize state with our Mocks
    const [mondaySlots, setMondaySlots] = useState<TimeSlot[]>(MOCK_MONDAY_SLOTS);
    const [tuesdaySlots, setTuesdaySlots] = useState<TimeSlot[]>(MOCK_TUESDAY_SLOTS);
    const [wednesdaySlots, setWednesdaySlots] = useState<TimeSlot[]>(MOCK_WEDNESDAY_SLOTS);
    const [thursdaySlots, setThursdaySlots] = useState<TimeSlot[]>(MOCK_THURSDAY_SLOTS);
    const [fridaySlots, setFridaySlots] = useState<TimeSlot[]>(MOCK_FRIDAY_SLOTS);
    const [saturdaySlots, setSaturdaySlots] = useState<TimeSlot[]>(MOCK_SATURDAY_SLOTS);

    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [activeTab, setActiveTab] = useState("Senin");
    
    // Simulate initial loading
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 800); // Short delay for tab switch
    };

    const handleSave = (day: string, newSlots: TimeSlot[]) => {
        setIsLoading(true);
        
        // Simulate API delay
        setTimeout(() => {
            switch(day) {
                case 'Senin': setMondaySlots(newSlots); break;
                case 'Selasa': setTuesdaySlots(newSlots); break;
                case 'Rabu': setWednesdaySlots(newSlots); break;
                case 'Kamis': setThursdaySlots(newSlots); break;
                case 'Jumat': setFridaySlots(newSlots); break;
                case 'Sabtu': setSaturdaySlots(newSlots); break;
            }
            setIsLoading(false);
            toast.success(`Konfigurasi hari ${day} berhasil disimpan`);
        }, 1500);
    };

    if (isInitialLoading) {
        return <TimeSlotPageSkeleton />;
    }

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
                <CardHeader className="pb-0 space-y-4">
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
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <div className="px-6 pt-2">
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
                            <TimeSlotList key="Senin" day="Senin" initialSlots={mondaySlots} onSave={handleSave} isLoading={isLoading} />
                        </TabsContent>
                        <TabsContent value="Selasa" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                            <TimeSlotList key="Selasa" day="Selasa" initialSlots={tuesdaySlots} onSave={handleSave} isLoading={isLoading} />
                        </TabsContent>
                        <TabsContent value="Rabu" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                             <TimeSlotList key="Rabu" day="Rabu" initialSlots={wednesdaySlots} onSave={handleSave} isLoading={isLoading} />
                        </TabsContent>
                        <TabsContent value="Kamis" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                             <TimeSlotList key="Kamis" day="Kamis" initialSlots={thursdaySlots} onSave={handleSave} isLoading={isLoading} />
                        </TabsContent>
                        <TabsContent value="Jumat" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                             <TimeSlotList key="Jumat" day="Jumat" initialSlots={fridaySlots} onSave={handleSave} isLoading={isLoading} />
                        </TabsContent>
                        <TabsContent value="Sabtu" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                             <TimeSlotList key="Sabtu" day="Sabtu" initialSlots={saturdaySlots} onSave={handleSave} isLoading={isLoading} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default TimeSlotConfigPage;
