"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, RefreshCw, LayoutDashboard, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function AdvisorError({ error, reset }: ErrorProps) {
    const router = useRouter();

    useEffect(() => {
        console.error("[Advisor Error]", error);
    }, [error]);

    const isNetworkError =
        error.message?.toLowerCase().includes("fetch") ||
        error.message?.toLowerCase().includes("network") ||
        error.message?.toLowerCase().includes("failed to fetch");

    const isAuthError =
        error.message?.toLowerCase().includes("401") ||
        error.message?.toLowerCase().includes("unauthorized") ||
        error.message?.toLowerCase().includes("token");

    const getErrorInfo = () => {
        if (isAuthError) {
            return {
                title: "Sesi Berakhir",
                description: "Sesi login Anda telah berakhir. Silakan login kembali.",
                action: () => router.push("/"),
                actionLabel: "Login Kembali",
            };
        }
        if (isNetworkError) {
            return {
                title: "Koneksi Bermasalah",
                description: "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
                action: reset,
                actionLabel: "Coba Lagi",
            };
        }
        return {
            title: "Terjadi Kesalahan",
            description: "Halaman ini mengalami kesalahan yang tidak terduga.",
            action: reset,
            actionLabel: "Coba Lagi",
        };
    };

    const { title, description, action, actionLabel } = getErrorInfo();

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-6">
            <Card className="w-full max-w-md border-red-100">
                <CardContent className="pt-8 pb-8 text-center space-y-6">
                    {/* Icon — no shadow */}
                    <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                            {isNetworkError ? (
                                <ServerCrash className="h-8 w-8 text-red-500" />
                            ) : (
                                <AlertTriangle className="h-8 w-8 text-red-500" />
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
                        {error.digest && (
                            <p className="text-xs text-slate-400 font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 inline-block">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-slate-100" />
                        <div className="w-1.5 h-1.5 rotate-45 border border-yellow-400 bg-white" />
                        <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    {/* Actions — no shadow */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/extracurricular-advisor/dashboard")}
                            className="gap-2 border-slate-200 text-slate-600 hover:text-slate-900 shadow-none"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Button>
                        <Button
                            onClick={action}
                            className="gap-2 bg-blue-500 hover:bg-blue-600 text-white shadow-none"
                        >
                            <RefreshCw className="h-4 w-4" />
                            {actionLabel}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
