"use client";

import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { TrendingUp } from "lucide-react";
import type { SemesterSummary } from "./types";

interface TrendChartProps {
    history: SemesterSummary[];
}

interface ChartDataPoint {
    name: string;
    nilai: number;
    peringkat: number;
    delta: number | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const color = payload.nilai >= 75 ? "#16a34a" : "#dc2626";
    return (
        <circle
            cx={cx}
            cy={cy}
            r={5}
            fill={color}
            stroke="white"
            strokeWidth={2}
        />
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomActiveDot = (props: any) => {
    const { cx, cy, payload } = props;
    const color = payload.nilai >= 75 ? "#16a34a" : "#dc2626";
    return (
        <circle
            cx={cx}
            cy={cy}
            r={7}
            fill={color}
            stroke="white"
            strokeWidth={2}
        />
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    const data: ChartDataPoint = payload[0].payload;
    const deltaText =
        data.delta !== null
            ? data.delta >= 0
                ? `+${data.delta.toFixed(1)}`
                : `${data.delta.toFixed(1)}`
            : null;
    const deltaColor = data.delta !== null && data.delta >= 0 ? "#16a34a" : "#dc2626";

    return (
        <div
            style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "10px 14px",
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
        >
            <p style={{ fontWeight: 600, color: "#1e293b", marginBottom: 4 }}>{label}</p>
            <p style={{ color: "#475569" }}>
                Rata-rata:{" "}
                <span style={{ fontWeight: 700, color: data.nilai >= 75 ? "#16a34a" : "#dc2626" }}>
                    {data.nilai}
                </span>
            </p>
            {deltaText !== null && (
                <p style={{ color: deltaColor, fontWeight: 600 }}>
                    {deltaText} dari semester lalu
                </p>
            )}
        </div>
    );
};

export const TrendChart: React.FC<TrendChartProps> = ({ history }) => {
    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Belum Ada Data Tren</h3>
                <p className="text-sm text-slate-500 max-w-md mt-1">
                    Data tren nilai akan muncul setelah minimal 2 semester selesai dan nilai difinalisasi
                </p>
            </div>
        );
    }

    if (history.length === 1) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 border border-dashed border-blue-200 flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Data Tren Belum Cukup</h3>
                <p className="text-sm text-slate-500 max-w-md mt-1">
                    Butuh minimal 2 semester untuk menampilkan tren
                </p>
            </div>
        );
    }

    // Data is already ordered oldest-to-newest from backend (ascending start_date)
    const chartData: ChartDataPoint[] = history.map((h, i) => ({
        name: `${h.semester} ${h.academicYear.slice(-4)}`,
        nilai: h.averageScore,
        peringkat: h.rank,
        delta: i === 0 ? null : +(h.averageScore - history[i - 1].averageScore).toFixed(1),
    }));

    const allScores = chartData.map(d => d.nilai);
    const minScore = Math.min(...allScores);
    const yMin = Math.max(0, Math.floor((minScore - 5) / 10) * 10);

    return (
        <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorNilai" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    domain={[yMin, 100]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                />
                <ReferenceLine
                    y={75}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    label={{ value: "KKM", position: "right", fontSize: 10, fill: "#f59e0b" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey="nilai"
                    stroke="#1d4ed8"
                    strokeWidth={2.5}
                    fill="url(#colorNilai)"
                    dot={<CustomDot />}
                    activeDot={<CustomActiveDot />}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};
