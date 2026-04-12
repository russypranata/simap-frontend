"use client";

import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { TrendingUp } from "lucide-react";
import type { SemesterSummary } from "./types";

interface TrendChartProps {
    history: SemesterSummary[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ history }) => {
    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Belum Ada Data Tren</h3>
                <p className="text-sm text-slate-500 max-w-md mt-1">Data tren nilai akan muncul setelah minimal 2 semester selesai dan nilai difinalisasi</p>
            </div>
        );
    }

    // Reverse so oldest is on the left
    const chartData = [...history].reverse().map(h => ({
        name: `${h.semester.slice(0, 3)} ${h.academicYear.slice(-4)}`,
        nilai: h.averageScore,
        peringkat: h.rank,
    }));

    return (
        <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <ReferenceLine y={75} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "KKM", position: "right", fontSize: 10, fill: "#f59e0b" }} />
                <RechartsTooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }}
                    formatter={(value: number) => [`${value}`, "Rata-rata"]}
                />
                <Line
                    type="monotone"
                    dataKey="nilai"
                    stroke="#1d4ed8"
                    strokeWidth={2.5}
                    dot={{ fill: "#1d4ed8", r: 5, strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 7 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};
