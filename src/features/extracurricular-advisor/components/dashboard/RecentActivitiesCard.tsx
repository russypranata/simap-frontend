"use client";

import React from "react";
import { Calendar, ClipboardList, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { type RecentActivityItem } from "../../services/advisorDashboardService";

interface RecentActivitiesCardProps {
    recentActivities: RecentActivityItem[];
}

export const RecentActivitiesCard: React.FC<RecentActivitiesCardProps> = ({ recentActivities }) => {
    const router = useRouter();

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <ClipboardList className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">Presensi Siswa</CardTitle>
                            <CardDescription>Kehadiran 3 pertemuan terakhir</CardDescription>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary"
                        onClick={() => router.push("/extracurricular-advisor/attendance?tab=history")}
                    >
                        Lihat Semua
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-2">
                    {recentActivities.map((activity) => (
                        <div
                            key={activity.id}
                            onClick={() => router.push(`/extracurricular-advisor/attendance/${activity.id}`)}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer hover:scale-[1.02]",
                                activity.attendance >= 90
                                    ? "bg-green-50 border-green-200 hover:bg-green-100/80 hover:border-green-300"
                                    : activity.attendance >= 75
                                    ? "bg-yellow-50 border-yellow-200 hover:bg-yellow-100/80 hover:border-yellow-300"
                                    : "bg-red-50 border-red-200 hover:bg-red-100/80 hover:border-red-300"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        "p-2 rounded-full",
                                        activity.attendance >= 90
                                            ? "bg-green-100 text-green-600"
                                            : activity.attendance >= 75
                                            ? "bg-yellow-100 text-yellow-600"
                                            : "bg-red-100 text-red-600"
                                    )}
                                >
                                    <Calendar className="h-4 w-4" />
                                </div>
                                <div>
                                    <p
                                        className={cn(
                                            "font-medium text-sm",
                                            activity.attendance >= 90
                                                ? "text-green-900"
                                                : activity.attendance >= 75
                                                ? "text-yellow-900"
                                                : "text-red-900"
                                        )}
                                    >
                                        {activity.day}, {activity.date}
                                    </p>
                                    <p
                                        className={cn(
                                            "text-xs",
                                            activity.attendance >= 90
                                                ? "text-green-700"
                                                : activity.attendance >= 75
                                                ? "text-yellow-700"
                                                : "text-red-700"
                                        )}
                                    >
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                className={cn(
                                    activity.attendance >= 90
                                        ? "bg-green-100 text-green-700 border-green-200"
                                        : activity.attendance >= 75
                                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                        : "bg-red-100 text-red-700 border-red-200"
                                )}
                            >
                                {activity.attendance}%
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
