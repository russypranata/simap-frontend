"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { School, RefreshCw, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    const router = useRouter();

    useEffect(() => {
        console.error("[App Error]", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 text-slate-900/[0.03]">
                    <School className="w-64 h-64" strokeWidth={0.5} />
                </div>
                <div className="absolute bottom-10 right-10 text-slate-900/[0.03]">
                    <AlertTriangle className="w-48 h-48" strokeWidth={0.5} />
                </div>
            </div>

            <div className="relative z-10 text-center max-w-md w-full space-y-8">
                {/* Logo — no shadow */}
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400 rounded-2xl flex items-center justify-center">
                        <School className="h-10 w-10 text-white" />
                    </div>
                </div>

                {/* Error icon + title */}
                <div className="space-y-3">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Terjadi Kesalahan
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Terjadi kesalahan yang tidak terduga. Silakan coba lagi atau kembali ke beranda.
                    </p>
                    {error.digest && (
                        <p className="text-xs text-slate-400 font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 inline-block">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-200" />
                    <div className="w-2 h-2 rotate-45 border-2 border-yellow-400 bg-white" />
                    <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Actions — no shadow */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        variant="outline"
                        onClick={reset}
                        className="gap-2 border-slate-200 text-slate-600 hover:text-slate-900 shadow-none"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Coba Lagi
                    </Button>
                    <Button
                        onClick={() => router.push("/")}
                        className="gap-2 bg-blue-500 hover:bg-blue-600 text-white shadow-none"
                    >
                        <Home className="h-4 w-4" />
                        Ke Beranda
                    </Button>
                </div>

                <p className="text-slate-400 text-xs">
                    &copy; 2026 SMAIT Al-Fityan Kubu Raya
                </p>
            </div>
        </div>
    );
}
