"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Calendar, Clock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface AttendanceFormProps {
    tutorName: string;
    extracurricularName: string;
    selectedDate: string;
    startTime: string;
    endTime: string;
    topic?: string;
    onDateChange: (d: string) => void;
    onStartTimeChange: (t: string) => void;
    onEndTimeChange: (t: string) => void;
    onTopicChange?: (t: string) => void;
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({
    tutorName,
    extracurricularName,
    selectedDate,
    startTime,
    endTime,
    topic = "",
    onDateChange,
    onStartTimeChange,
    onEndTimeChange,
    onTopicChange,
}) => (
    <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Clock className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-lg font-semibold">Informasi Kegiatan</CardTitle>
                    <CardDescription>Lengkapi detail waktu dan tanggal pelaksanaan kegiatan</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="tutor-name" className="text-sm font-semibold">Nama Tutor</Label>
                        <Input id="tutor-name" value={tutorName} readOnly className="h-11 bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="type-eskul" className="text-sm font-semibold">Jenis Ekstrakurikuler</Label>
                        <Input id="type-eskul" value={extracurricularName || "—"} readOnly className="h-11 bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="topic" className="text-sm font-semibold flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            Materi / Topik Pertemuan
                        </Label>
                        <Textarea
                            id="topic"
                            value={topic}
                            onChange={(e) => onTopicChange?.(e.target.value)}
                            placeholder="Contoh: Teknik dasar dribbling, Latihan formasi, Pengenalan alat musik, dll."
                            className="resize-none h-20"
                            readOnly={!onTopicChange}
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="attendance-date" className="text-sm font-semibold">
                            Tanggal Kegiatan <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="attendance-date"
                                type="date"
                                value={selectedDate}
                                onChange={(e) => onDateChange(e.target.value)}
                                className="h-11 pl-10"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start-time" className="text-sm font-semibold">
                                Waktu Mulai <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="start-time"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => onStartTimeChange(e.target.value)}
                                    className="h-11 pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end-time" className="text-sm font-semibold">
                                Waktu Selesai <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="end-time"
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => onEndTimeChange(e.target.value)}
                                    className="h-11 pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);
