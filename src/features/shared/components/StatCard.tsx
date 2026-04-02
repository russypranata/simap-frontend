"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type ColorVariant = "blue" | "green" | "amber" | "emerald" | "purple" | "red" | "rose" | "indigo" | "pink" | "orange";

const colorMap: Record<ColorVariant, { bg: string; text: string; ring: string; bar: string; badge: string }> = {
    blue:    { bg: "bg-blue-100/80",    text: "text-blue-600",    ring: "ring-blue-200/50",    bar: "bg-blue-500",    badge: "bg-blue-50 text-blue-600 border-blue-100" },
    green:   { bg: "bg-green-100/80",   text: "text-green-600",   ring: "ring-green-200/50",   bar: "bg-green-500",   badge: "bg-green-50 text-green-600 border-green-100" },
    amber:   { bg: "bg-amber-100/80",   text: "text-amber-600",   ring: "ring-amber-200/50",   bar: "bg-amber-500",   badge: "bg-amber-50 text-amber-600 border-amber-100" },
    emerald: { bg: "bg-emerald-100/80", text: "text-emerald-600", ring: "ring-emerald-200/50", bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    purple:  { bg: "bg-purple-100/80",  text: "text-purple-600",  ring: "ring-purple-200/50",  bar: "bg-purple-500",  badge: "bg-purple-50 text-purple-600 border-purple-100" },
    red:     { bg: "bg-red-100/80",     text: "text-red-600",     ring: "ring-red-200/50",     bar: "bg-red-500",     badge: "bg-red-50 text-red-600 border-red-100" },
    rose:    { bg: "bg-rose-100/80",    text: "text-rose-600",    ring: "ring-rose-200/50",    bar: "bg-rose-500",    badge: "bg-rose-50 text-rose-600 border-rose-100" },
    indigo:  { bg: "bg-indigo-100/80",  text: "text-indigo-600",  ring: "ring-indigo-200/50",  bar: "bg-indigo-500",  badge: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    pink:    { bg: "bg-pink-100/80",    text: "text-pink-600",    ring: "ring-pink-200/50",    bar: "bg-pink-500",    badge: "bg-pink-50 text-pink-600 border-pink-100" },
    orange:  { bg: "bg-orange-100/80",  text: "text-orange-600",  ring: "ring-orange-200/50",  bar: "bg-orange-500",  badge: "bg-orange-50 text-orange-600 border-orange-100" },
};

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    unit?: string;
    icon: React.ElementType;
    color: ColorVariant;
    className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtitle,
    unit,
    icon: Icon,
    color,
    className,
}) => {
    const cfg = colorMap[color];
    return (
        <div className={cn(
            "group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 flex flex-col",
            className
        )}>
            <div className="px-5 pt-4 pb-3 pl-6 flex items-center gap-4 flex-1">
                <div className="relative flex-shrink-0">
                    <div className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center ring-2 transition-transform duration-300 group-hover:scale-105",
                        cfg.bg, cfg.ring
                    )}>
                        <Icon className={cn("h-5 w-5", cfg.text)} />
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <TooltipProvider delayDuration={300}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold truncate cursor-default">
                                    {title}
                                </p>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">
                                {title}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="flex items-baseline gap-2 mt-0.5">
                        <p className="text-2xl font-bold text-slate-800 leading-none tabular-nums">{value}</p>
                        {unit && <p className="text-xs text-muted-foreground font-medium">{unit}</p>}
                    </div>
                </div>
            </div>

            {/* Subtitle badge footer */}
            {subtitle && (
                <div className={cn(
                    "mx-4 mb-3 px-2.5 py-1 rounded-md border text-[11px] font-medium truncate",
                    cfg.badge
                )}>
                    {subtitle}
                </div>
            )}
        </div>
    );
};
