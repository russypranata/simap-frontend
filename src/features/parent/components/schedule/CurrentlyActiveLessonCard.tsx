"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User, BookOpen } from "lucide-react";
import type { ScheduleItem } from "@/features/parent/services/parentScheduleService";

interface CurrentlyActiveLessonCardProps {
    currentLesson: ScheduleItem;
    currentDay: string;
}

export const CurrentlyActiveLessonCard: React.FC<CurrentlyActiveLessonCardProps> = ({
    currentLesson,
    currentDay,
}) => {
    return (
        <Card className="border-green-300 bg-gradient-to-r from-green-50 to-white ring-2 ring-green-400 ring-offset-2">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-green-100 rounded-xl animate-pulse">
                            <Clock className="h-5 w-5 text-green-800" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-lg text-green-900">Sedang Berlangsung</CardTitle>
                                <Badge className="bg-green-600 text-white animate-pulse">
                                    LIVE
                                </Badge>
                            </div>
                            <CardDescription className="text-green-700">
                                {currentLesson.subject} - {currentLesson.room}
                            </CardDescription>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium text-green-800">
                            {currentLesson.startTime} - {currentLesson.endTime}
                        </div>
                        <div className="text-xs text-green-600">
                            {currentDay}, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                        <User className="h-4 w-4" />
                        <span>{currentLesson.teacher}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-700">
                        <MapPin className="h-4 w-4" />
                        <span>{currentLesson.room}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-700">
                        <BookOpen className="h-4 w-4" />
                        <span>Jam Pelajaran {currentLesson.lessonNumber}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
