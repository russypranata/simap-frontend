"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
    error: string;
    onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
    <Card className="border-red-200 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-red-100 rounded-full mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Gagal Memuat Data</h3>
            <p className="text-sm text-slate-500 max-w-md mb-6">{error}</p>
            <Button onClick={onRetry} variant="outline" className="gap-2 border-red-200 text-red-700 hover:bg-red-50">
                <RefreshCw className="h-4 w-4" />
                Coba Lagi
            </Button>
        </CardContent>
    </Card>
);
