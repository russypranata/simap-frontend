"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton() {
    return (
        <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2 border-slate-200 text-slate-600 hover:text-slate-900"
        >
            <ArrowLeft className="h-4 w-4" />
            Kembali
        </Button>
    );
}
