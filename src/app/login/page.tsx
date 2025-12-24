'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useRole } from '@/app/context/RoleContext';
import {
    School,
    User,
    Lock,
    ArrowRight,
    Shield,
    Users,
    GraduationCap,
    BookOpen,
    Clock,
    UserRound,
    Star,
    Sparkles,
    PanelRightClose,
    PanelRightOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
    const { login } = useRole();
    const router = useRouter();
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

    const [view, setView] = useState<'login' | 'forgot_password'>('login');
    const [forgotPasswordData, setForgotPasswordData] = useState({ email: '' });
    const [forgotMessage, setForgotMessage] = useState({ type: '', text: '' });

    const handleLoginNavigation = (role: string) => {
        switch (role) {
            case 'guru':
                router.push('/teacher/dashboard');
                break;
            case 'siswa':
                router.push('/student/dashboard');
                break;
            case 'admin':
                router.push('/admin/dashboard');
                break;
            case 'orang_tua':
                router.push('/parent/dashboard');
                break;
            case 'pembina_ekskul':
                router.push('/extracurricular-advisor/dashboard');
                break;
            default:
                router.push('/teacher/dashboard');
        }
    };

    const determineRole = (username: string): 'guru' | 'siswa' | 'admin' | 'orang_tua' => {
        const lower = username.toLowerCase();
        if (lower.includes('admin')) return 'admin';
        if (lower.includes('siswa') || lower.includes('student') || lower.includes('nis')) return 'siswa';
        if (lower.includes('ortu') || lower.includes('parent')) return 'orang_tua';
        // Check for teacher explicitly
        if (lower.includes('guru') || lower.includes('teacher') || lower.includes('nip')) return 'guru';

        // Default to guru for dummy purposes
        return 'guru';
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // --- API INTEGRATION (LOGIN) START --- 
            // const res = await api.post('/auth/login', { username, password });

            // MOCK DELAY
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // --- DUMMY CREDENTIALS CHECK ---
            if (loginData.username === 'guru' && loginData.password === '123') {
                login('guru');
                handleLoginNavigation('guru');
                return;
            } else if (loginData.username === 'siswa' && loginData.password === '123') {
                login('siswa');
                handleLoginNavigation('siswa');
                return;
            } else if (loginData.username === 'pembina' && loginData.password === '123') {
                login('pembina_ekskul');
                handleLoginNavigation('pembina_ekskul');
                return;
            }

            throw new Error('Username atau password salah');

        } catch (err: any) {
            setError(err.message || 'Gagal masuk ke sistem.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setForgotMessage({ type: '', text: '' });

        try {
            // --- API INTEGRATION (FORGOT PASSWORD) START ---
            // const res = await api.post('/auth/forgot-password', { email: forgotPasswordData.email });

            // MOCK DELAY
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // MOCK SUCCESS
            setForgotMessage({
                type: 'success',
                text: 'Link reset password telah dikirim ke email Anda. Silakan cek inbox/spam.',
            });

        } catch (err: any) {
            setForgotMessage({
                type: 'error',
                text: 'Gagal mengirim permintaan reset password.',
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen w-full flex relative">
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
                    >
                        {/* Spiral Flow Spinner */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col items-center gap-4"
                        >
                            {/* Spiral Container */}
                            <div className="relative w-24 h-24">
                                {/* Blue Spiral - Clockwise */}
                                <motion.div
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        rotate: {
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "linear"
                                        },
                                        scale: {
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }
                                    }}
                                    className="absolute inset-0"
                                >
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <path
                                            d="M 50 15 A 35 35 0 0 1 85 50"
                                            fill="none"
                                            stroke="#3b82f6"
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                            opacity="0.9"
                                        />
                                        <path
                                            d="M 85 50 A 35 35 0 0 1 50 85"
                                            fill="none"
                                            stroke="#3b82f6"
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                            opacity="0.6"
                                        />
                                    </svg>
                                </motion.div>

                                {/* Yellow Spiral - Counter-clockwise */}
                                <motion.div
                                    animate={{
                                        rotate: -360,
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        rotate: {
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "linear"
                                        },
                                        scale: {
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: 1
                                        }
                                    }}
                                    className="absolute inset-0"
                                >
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <path
                                            d="M 50 85 A 35 35 0 0 1 15 50"
                                            fill="none"
                                            stroke="#fbbf24"
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                            opacity="0.9"
                                        />
                                        <path
                                            d="M 15 50 A 35 35 0 0 1 50 15"
                                            fill="none"
                                            stroke="#fbbf24"
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                            opacity="0.6"
                                        />
                                    </svg>
                                </motion.div>

                                {/* Center Logo with Pulse */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <School className="w-9 h-9 text-white drop-shadow-lg" />
                                </motion.div>
                            </div>

                            {/* Loading Text */}
                            <motion.p
                                animate={{
                                    opacity: [0.7, 1, 0.7]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="text-white text-sm font-medium"
                            >
                                Memproses...
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Left Side - Form Container */}
            <motion.div
                layout
                className={`flex flex-col bg-white h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative transition-all duration-500 ease-in-out ${isRightPanelOpen ? 'w-full lg:w-1/2' : 'w-full'}`}
            >
                {/* Toggle Right Panel Button */}
                <button
                    onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                    className={`absolute top-6 right-6 z-50 p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${isRightPanelOpen
                        ? 'bg-white text-slate-600 hover:text-blue-600 border border-slate-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-500'
                        }`}
                    title={isRightPanelOpen ? "Tutup Panel Informasi" : "Buka Panel Informasi"}
                >
                    {isRightPanelOpen ? (
                        <PanelRightClose className="w-5 h-5" />
                    ) : (
                        <PanelRightOpen className="w-5 h-5" />
                    )}
                </button>

                {/* Background Decorations */}
                <div className="absolute top-10 left-10 text-slate-900/[0.03] pointer-events-none -z-0">
                    <School className="w-64 h-64" strokeWidth={0.5} />
                </div>
                <div className="absolute bottom-10 right-10 text-slate-900/[0.03] pointer-events-none -z-0">
                    <BookOpen className="w-48 h-48" strokeWidth={0.5} />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-900/[0.015] pointer-events-none -z-0">
                    <GraduationCap className="w-96 h-96" strokeWidth={0.5} />
                </div>

                <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-8 w-full z-10">

                    {/* --- LOGIN VIEW --- */}
                    {view === 'login' && (
                        <motion.div
                            key="login-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full max-w-md space-y-6"
                        >
                            {/* Header */}
                            <div className="text-center space-y-3">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                                    className="mx-auto w-20 h-20 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mb-6 cursor-pointer"
                                >
                                    <School className="h-10 w-10 text-white" />
                                </motion.div>
                                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                    Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">SIMAP</span>
                                </h1>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Akses layanan akademik dan administrasi sekolah dalam satu pintu
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleLogin} className="space-y-5 mt-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-5"
                                >
                                    {/* Error Alert */}
                                    {error && (
                                        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            {error}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-semibold pl-1">ID Pengguna / Username</Label>
                                        <div className="relative group">
                                            <div className="absolute left-3 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <Input
                                                className="pl-10 h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all rounded-xl shadow-sm text-base"
                                                placeholder="Masukkan NIP, NIS, atau Username"
                                                value={loginData.username}
                                                onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-slate-700 font-semibold pl-1">Password</Label>
                                            <button
                                                type="button"
                                                onClick={() => setView('forgot_password')}
                                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                                            >
                                                Lupa password?
                                            </button>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute left-3 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                                <Lock className="h-5 w-5" />
                                            </div>
                                            <Input
                                                type="password"
                                                className="pl-10 h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all rounded-xl shadow-sm text-base"
                                                placeholder="Masukkan password Anda"
                                                value={loginData.password}
                                                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                                                required
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-base font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white transition-all hover:scale-[1.01] active:scale-[0.99] rounded-xl shadow-md"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Memproses...</span>
                                            </div>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                Masuk Sekarang
                                            </span>
                                        )}
                                    </Button>
                                </motion.div>
                            </form>
                        </motion.div>
                    )}

                    {/* --- FORGOT PASSWORD VIEW --- */}
                    {view === 'forgot_password' && (
                        <motion.div
                            key="forgot-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full max-w-md space-y-6"
                        >
                            <div className="text-center space-y-3">
                                <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                                    <Lock className="h-8 w-8" />
                                </div>
                                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                    Lupa Password?
                                </h1>
                                <p className="text-slate-500 text-base">
                                    Masukkan email Anda untuk menerima instruksi reset password.
                                </p>
                            </div>

                            <form onSubmit={handleForgotPassword} className="space-y-6 mt-6">
                                {forgotMessage.text && (
                                    <div className={`p-4 rounded-xl text-sm font-medium flex items-start gap-2 ${forgotMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                                        }`}>
                                        {forgotMessage.type === 'success' ? <Sparkles className="w-4 h-4 mt-0.5" /> : <Shield className="w-4 h-4 mt-0.5" />}
                                        {forgotMessage.text}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-semibold pl-1">Email Terdaftar</Label>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <Input
                                            type="email"
                                            className="pl-10 h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all rounded-xl shadow-sm text-base"
                                            placeholder="contoh@sekolah.sch.id"
                                            value={forgotPasswordData.email}
                                            onChange={(e) => setForgotPasswordData({ email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white transition-all hover:scale-[1.01] active:scale-[0.99] rounded-xl shadow-md"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Mengirim Link...</span>
                                            </div>
                                        ) : (
                                            "Kirim Link Reset"
                                        )}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                            setView('login');
                                            setForgotMessage({ type: '', text: '' });
                                        }}
                                        className="w-full text-slate-500 hover:text-slate-900 font-semibold"
                                        disabled={isLoading}
                                    >
                                        Kembali ke Halaman Login
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    <div className="mt-8 text-center">
                        <p className="text-slate-400 text-xs font-medium">
                            &copy; 2025 SMAIT Al-Fityan Kubu Raya. All rights reserved.
                        </p>
                    </div>
                </div>

            </motion.div>

            <AnimatePresence mode="wait">
                {isRightPanelOpen && (
                    <>
                        {/* Geometric Divider - Modern & Clean */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 h-[80%] w-[2px] flex-col items-center justify-center pointer-events-none select-none"
                        >
                            {/* Top Fade Line */}
                            <div className="w-full flex-1 bg-gradient-to-b from-transparent via-slate-200 to-blue-300"></div>

                            {/* Center Decor */}
                            <div className="py-4 flex flex-col items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></div>
                                <div className="w-3 h-3 rotate-45 border-2 border-yellow-400 bg-white shadow-sm"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></div>
                            </div>

                            {/* Bottom Fade Line */}
                            <div className="w-full flex-1 bg-gradient-to-b from-blue-300 via-slate-200 to-transparent"></div>
                        </motion.div>

                        {/* Right Side - Image/Background */}
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "50%", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="hidden lg:flex relative bg-gradient-to-b from-white to-slate-50 overflow-hidden items-center justify-center"
                        >
                            <div className="min-w-[50vw] h-full relative flex items-center justify-center"> {/* Container to prevent content squishing during transition */}
                                {/* Background Image - Optimized with Next.js Image */}
                                <div className="absolute inset-0">
                                    <Image
                                        src="/assets/illustrations/sketch-al-fityan.png"
                                        alt="Sketch Al-Fityan Background"
                                        fill
                                        className="object-cover object-center"
                                        priority
                                        quality={90}
                                    />
                                </div>

                                {/* White Overlay - lighter to show sketch */}
                                <div className="absolute inset-0 bg-white/85" />



                                <div className="relative z-10 w-full max-w-2xl px-8 py-6 flex flex-col justify-center lg:h-full">
                                    {/* Header - Left Aligned with Yellow Accent */}
                                    <div className="mb-5 space-y-1.5">
                                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 mb-3">
                                            <Sparkles className="w-4 h-4 text-yellow-600" />
                                            <span className="text-xs font-semibold text-yellow-700">
                                                Smart Login System
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
                                            <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                                                Akses Otomatis
                                            </span>
                                            {' '}
                                            <span className="text-slate-900">Berdasarkan Role</span>
                                        </h2>
                                        <div className="flex gap-3 items-start mt-2.5">
                                            {/* Yellow Divider */}
                                            <div className="w-0.5 h-12 bg-yellow-500 rounded-full flex-shrink-0"></div>

                                            {/* Description Text */}
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                Sistem akan{' '}
                                                <span className="font-semibold text-yellow-600">mendeteksi role Anda secara otomatis</span>{' '}
                                                dan mengarahkan ke dashboard yang sesuai
                                            </p>
                                        </div>
                                    </div>

                                    {/* Role Cards - Creative Non-Card Design */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { name: 'Guru Mapel', icon: BookOpen, color: 'bg-blue-50 text-blue-700', borderColor: 'border-blue-200', gradient: 'from-blue-600/20 to-transparent' },
                                            { name: 'Guru Piket', icon: Clock, color: 'bg-orange-50 text-orange-700', borderColor: 'border-orange-200', gradient: 'from-orange-600/20 to-transparent' },
                                            { name: 'Wali Kelas', icon: UserRound, color: 'bg-emerald-50 text-emerald-700', borderColor: 'border-emerald-200', gradient: 'from-emerald-600/20 to-transparent' },
                                            { name: 'Pembina Ekskul', icon: Star, color: 'bg-violet-50 text-violet-700', borderColor: 'border-violet-200', gradient: 'from-violet-600/20 to-transparent' },
                                            { name: 'PJ Mutamayizin', icon: Sparkles, color: 'bg-pink-50 text-pink-700', borderColor: 'border-pink-200', gradient: 'from-pink-600/20 to-transparent' },
                                            { name: 'Siswa', icon: User, color: 'bg-cyan-50 text-cyan-700', borderColor: 'border-cyan-200', gradient: 'from-cyan-600/20 to-transparent' },
                                            { name: 'Kepala Sekolah', icon: GraduationCap, color: 'bg-indigo-50 text-indigo-700', borderColor: 'border-indigo-200', gradient: 'from-indigo-600/20 to-transparent' },
                                            { name: 'Administrator', icon: Shield, color: 'bg-slate-50 text-slate-700', borderColor: 'border-slate-200', gradient: 'from-slate-600/20 to-transparent' },
                                            { name: 'Orang Tua', icon: Users, color: 'bg-teal-50 text-teal-700', borderColor: 'border-teal-200', gradient: 'from-teal-600/20 to-transparent' },
                                        ].map((role, i) => (
                                            <motion.div
                                                key={role.name}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.05 * i, duration: 0.4 }}
                                                className="group relative pt-5"
                                            >
                                                {/* Floating Background Blob */}
                                                <div className={`absolute -inset-2 ${role.color.split(' ')[0]} rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500 group-hover:scale-110`}></div>

                                                {/* Main Content Container - Colored Background */}
                                                <div className={`relative h-full backdrop-blur-sm ${role.color.split(' ')[0]} border ${role.borderColor} rounded-xl overflow-visible transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1 shadow-sm group-hover:shadow-md`}>
                                                    {/* Gradient Overlay */}
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-30 group-hover:opacity-50 transition-opacity duration-500 rounded-xl`}></div>

                                                    {/* Floating Icon - Outside the box */}
                                                    <div className="absolute -top-5 left-2.5 z-20">
                                                        <div className="relative">
                                                            {/* Icon Glow */}
                                                            <div className={`absolute inset-0 ${role.color.split(' ')[0]} rounded-lg blur-lg opacity-0 group-hover:opacity-50 transition-all duration-300 scale-150`}></div>
                                                            {/* Icon Container */}
                                                            <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${role.color} border ${role.borderColor} bg-white shadow-sm`}>
                                                                <role.icon className="h-5 w-5" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="relative z-10 pt-8 pb-3 px-2.5">
                                                        {/* Title with Underline Accent */}
                                                        <div className="mb-1.5">
                                                            <h3 className="text-[11px] font-medium text-slate-900 mb-0.5 group-hover:text-blue-700 transition-colors duration-300 leading-tight tracking-wide">
                                                                {role.name}
                                                            </h3>
                                                            <div className={`h-1 w-6 rounded-full ${role.color.split(' ')[1].replace('text', 'bg')} group-hover:w-10 transition-all duration-300`}></div>
                                                        </div>

                                                        {/* Decorative Corner Element */}
                                                        <div className="absolute bottom-0 right-0 w-12 h-12 opacity-20 group-hover:opacity-40 transition-opacity duration-500 overflow-hidden rounded-xl">
                                                            <div className={`absolute inset-0 ${role.color.split(' ')[0]} rounded-tl-full`}></div>
                                                        </div>

                                                        {/* Floating Dots Decoration */}
                                                        <div className="absolute top-1.5 right-1.5 flex gap-0.5 opacity-50 group-hover:opacity-80 transition-opacity duration-300">
                                                            <div className={`w-1 h-1 rounded-full ${role.color.split(' ')[1].replace('text', 'bg')}`}></div>
                                                            <div className={`w-1 h-1 rounded-full ${role.color.split(' ')[1].replace('text', 'bg')}`}></div>
                                                            <div className={`w-1 h-1 rounded-full ${role.color.split(' ')[1].replace('text', 'bg')}`}></div>
                                                        </div>
                                                    </div>

                                                    {/* Shimmer Effect on Hover */}
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl overflow-hidden">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div> {/* End of inner container */}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div >
    );
}
