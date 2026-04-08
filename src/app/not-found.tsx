import Link from "next/link";
import { School, Home, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/features/shared/components/BackButton";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 text-slate-900/[0.03]">
                    <School className="w-64 h-64" strokeWidth={0.5} />
                </div>
                <div className="absolute bottom-10 right-10 text-slate-900/[0.03]">
                    <MapPin className="w-48 h-48" strokeWidth={0.5} />
                </div>
            </div>

            <div className="relative z-10 text-center max-w-md w-full space-y-8">
                {/* Logo — no shadow */}
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400 rounded-2xl flex items-center justify-center">
                        <School className="h-10 w-10 text-white" />
                    </div>
                </div>

                {/* 404 */}
                <div className="space-y-2">
                    <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400 leading-none">
                        404
                    </h1>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Halaman Tidak Ditemukan
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Halaman yang Anda cari tidak ada atau telah dipindahkan.
                        Pastikan URL yang Anda masukkan sudah benar.
                    </p>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-200" />
                    <div className="w-2 h-2 rotate-45 border-2 border-yellow-400 bg-white" />
                    <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Actions — no shadow */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <BackButton />
                    <Button
                        asChild
                        className="gap-2 bg-blue-500 hover:bg-blue-600 text-white shadow-none"
                    >
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Ke Beranda
                        </Link>
                    </Button>
                </div>

                <p className="text-slate-400 text-xs">
                    &copy; 2026 SMAIT Al-Fityan Kubu Raya
                </p>
            </div>
        </div>
    );
}
