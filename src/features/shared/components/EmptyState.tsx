"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon: React.ElementType;
    title: string;
    description?: string;
    className?: string;
    children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    className,
    children,
}) => (
    <div className={cn("flex flex-col items-center justify-center text-center py-20 px-4", className)}>
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mb-4 transition-transform hover:scale-110">
            <Icon className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {description && (
            <p className="text-sm text-slate-500 max-w-md mt-1">{description}</p>
        )}
        {children}
    </div>
);
