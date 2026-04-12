"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { getGradeColor } from "./helpers";
import type { Extracurricular } from "./types";

interface ExtracurricularSectionProps {
    extracurriculars: Extracurricular[];
}

export const ExtracurricularSection: React.FC<ExtracurricularSectionProps> = ({ extracurriculars }) => (
    <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 rounded-xl">
                    <Medal className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">Ekstrakurikuler</CardTitle>
                    <CardDescription className="text-sm text-slate-600">Prestasi dan partisipasi ekstrakurikuler</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            {extracurriculars.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-14 h-14 rounded-full bg-purple-50 border border-dashed border-purple-200 flex items-center justify-center mb-3">
                        <Medal className="h-6 w-6 text-purple-300" />
                    </div>
                    <p className="text-sm font-medium text-slate-600">Belum ada data ekstrakurikuler</p>
                    <p className="text-xs text-slate-400 mt-1">Data akan muncul setelah ada presensi ekskul yang tercatat</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {extracurriculars.map((ekskul, index) => (
                        <div key={index} className="p-4 rounded-xl border border-slate-200 hover:border-purple-200 hover:bg-purple-50/30 transition-all">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                                        <Medal className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800">{ekskul.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs bg-slate-50">{ekskul.type}</Badge>
                                            <Badge className={cn("text-xs", getGradeColor(ekskul.score))}>{ekskul.score} - {ekskul.predicate}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{ekskul.description}</p>
                            <p className="text-xs text-slate-500">Pembina: {ekskul.instructor}</p>
                        </div>
                    ))}
                </div>
            )}
        </CardContent>
    </Card>
);
