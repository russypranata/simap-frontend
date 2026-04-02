"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";

export interface FilterBadge {
    key: string;
    label: string;
    icon?: React.ElementType;
    onRemove: () => void;
}

interface ActiveFilterBadgesProps {
    badges: FilterBadge[];
    onClearAll?: () => void;
    className?: string;
}

export const ActiveFilterBadges: React.FC<ActiveFilterBadgesProps> = ({
    badges,
    onClearAll,
    className,
}) => {
    if (badges.length === 0) return null;

    return (
        <div className={`flex flex-wrap items-center gap-2 px-1 no-print ${className ?? ""}`}>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                <SlidersHorizontal className="h-3 w-3" />
                <span>Filter Aktif:</span>
            </div>

            {badges.map((badge) => {
                const Icon = badge.icon;
                return (
                    <Badge
                        key={badge.key}
                        variant="secondary"
                        className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium"
                    >
                        {Icon && <Icon className="h-3.5 w-3.5" />}
                        {badge.label}
                        <button
                            onClick={badge.onRemove}
                            className="inline-flex items-center justify-center h-4 w-4 hover:text-white/70 transition-colors -mr-1"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </Badge>
                );
            })}

            {onClearAll && badges.length > 1 && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-[11px] text-red-500 hover:text-red-600 hover:bg-red-50 gap-1.5 ml-1"
                    onClick={onClearAll}
                >
                    <RotateCcw className="h-3 w-3" />
                    Hapus Semua
                </Button>
            )}
        </div>
    );
};
