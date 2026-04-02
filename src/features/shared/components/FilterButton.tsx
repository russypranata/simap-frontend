"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

interface FilterButtonProps {
    activeCount?: number;
    onClick?: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ activeCount = 0, onClick }) => (
    <Button variant="outline" className="h-9 gap-2 bg-white text-slate-700 border-slate-200 shadow-sm font-medium" onClick={onClick}>
        <Filter className="h-4 w-4 text-slate-500" />
        <span className="hidden sm:inline">Filter</span>
        {activeCount > 0 && (
            <Badge className="ml-0.5 h-5 w-5 min-w-[20px] px-0 bg-blue-800 text-white text-[10px] flex items-center justify-center border-0 rounded-full">
                {activeCount}
            </Badge>
        )}
    </Button>
);
