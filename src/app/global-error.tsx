"use client";

import { useEffect } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    useEffect(() => {
        console.error("[Global Error]", error);
    }, [error]);

    return (
        <html lang="id">
            <body className="min-h-screen bg-white flex items-center justify-center p-6 font-sans antialiased">
                <div className="text-center max-w-md w-full space-y-6">
                    {/* Icon — no shadow, gradient biru tua */}
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400 flex items-center justify-center">
                            <AlertTriangle className="h-10 w-10 text-white" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-extrabold text-slate-900">
                            Sistem Mengalami Gangguan
                        </h1>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Terjadi kesalahan kritis pada aplikasi. Silakan muat ulang halaman.
                        </p>
                        {error.digest && (
                            <p className="text-xs text-slate-400 font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 inline-block">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>

                    {/* Button — no shadow, gradient biru tua */}
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Muat Ulang
                    </button>

                    <p className="text-slate-400 text-xs">
                        &copy; 2026 SMAIT Al-Fityan Kubu Raya
                    </p>
                </div>
            </body>
        </html>
    );
}
