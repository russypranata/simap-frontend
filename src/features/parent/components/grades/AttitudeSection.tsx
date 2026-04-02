"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, UserCheck, Users } from "lucide-react";
import type { AttitudeScore } from "./types";

interface AttitudeSectionProps {
    attitude: AttitudeScore;
}

export const AttitudeSection: React.FC<AttitudeSectionProps> = ({ attitude }) => (
    <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 rounded-xl">
                    <UserCheck className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">Nilai Sikap</CardTitle>
                    <CardDescription className="text-sm text-slate-600">Penilaian sikap spiritual dan sosial</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Star className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Sikap Spiritual</p>
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200">{attitude.spiritual.score}</Badge>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-slate-700 mb-2">{attitude.spiritual.predicate}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{attitude.spiritual.description}</p>
                </div>
                <div className="p-4 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Sikap Sosial</p>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">{attitude.social.score}</Badge>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-slate-700 mb-2">{attitude.social.predicate}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{attitude.social.description}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);
