"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";

interface Child {
    id: string;
    name: string;
    class: string;
}

interface ChildSelectorProps {
    childList: Child[];
    selectedChildId: string;
    onSelect: (id: string) => void;
}

export const ChildSelector: React.FC<ChildSelectorProps> = ({
    childList,
    selectedChildId,
    onSelect,
}) => {
    if (childList.length <= 1) return null;

    return (
        <Select value={selectedChildId} onValueChange={onSelect}>
            <SelectTrigger className="w-full sm:w-[220px] h-9 bg-white shadow-sm border-slate-200">
                <Users className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
                <div className="flex-1 text-left truncate">
                    <SelectValue placeholder="Pilih Anak" />
                </div>
            </SelectTrigger>
            <SelectContent>
                {childList.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                        {child.name} — {child.class}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
