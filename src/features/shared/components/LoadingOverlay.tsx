"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
    message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = "Memuat data..." }) => (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-30 flex items-center justify-center rounded-xl">
        <div className="flex items-center gap-3 bg-white border border-slate-200 shadow-lg rounded-xl px-5 py-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-medium text-slate-600">{message}</span>
        </div>
    </div>
);
