'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50"
                    >
                        {/* Breathing Logo */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.8, 1, 0.8]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative mb-6"
                        >
                            <div className="p-4 bg-white rounded-2xl">
                                <School className="w-12 h-12 text-blue-600" />
                            </div>
                        </motion.div>

                        {/* Bouncing Dots */}
                        <div className="flex gap-2">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, -10, 0],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: "easeInOut"
                                    }}
                                    className={`w-3 h-3 rounded-full ${i === 1 ? 'bg-yellow-400' : 'bg-blue-600'}`}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Left Side - Form Container */}
            <div className="w-full lg:w-1/2 flex flex-col bg-white h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-8 w-full">

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
                                    className="mx-auto w-20 h-20 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-6 cursor-pointer"
                                >
                                    <School className="h-10 w-10 text-white" />
                                </motion.div>
                                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                    Selamat Datang
                                </h1>
                                <p className="text-slate-500 text-lg">
                                    Silakan masuk ke akun SIMAP Anda
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
                    )}      <div className="mt-8 text-center">
                        <p className="text-slate-400 text-xs font-medium">
                            &copy; 2025 SMAIT Al-Fityan Kubu Raya. All rights reserved.
                        </p>
                    </div>
                </div>


            </div>

            {/* Right Side - Image/Background */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
                {/* Background Image with Parallax-like effect */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/assets/hero.webp')" }}
                />

                {/* Modern Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-yellow-900/30 backdrop-blur-[3px]" />

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 w-full max-w-2xl p-8 flex flex-col justify-center min-h-[500px] lg:h-full">
                    <div className="mb-6 text-center space-y-2">
                        <div className="inline-flex items-center justify-center p-2 bg-white/5 rounded-full backdrop-blur-md border border-white/10 mb-4 shadow-lg">
                            <Sparkles className="w-5 h-5 text-yellow-400 mr-2" />
                            <span className="text-slate-200 text-sm font-medium pr-2">Integrated School System</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white tracking-tight">
                            Ekosistem <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300">SIMAP</span>
                        </h2>
                        <p className="text-slate-300 text-lg max-w-md mx-auto leading-relaxed">
                            Satu platform terintegrasi untuk seluruh warga sekolah SMAIT Al-Fityan Kubu Raya.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { name: 'Guru Mapel', icon: BookOpen },
                            { name: 'Guru Piket', icon: Clock },
                            { name: 'Wali Kelas', icon: UserRound },
                            { name: 'Pembina Ekskul', icon: Star },
                            { name: 'PJ Mutamayizin', icon: Sparkles },
                            { name: 'Siswa', icon: GraduationCap },
                            { name: 'Kepala Sekolah', icon: School },
                            { name: 'Administrator', icon: Shield },
                            { name: 'Orang Tua', icon: Users },
                        ].map((role, i) => (
                            <motion.div
                                key={role.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i, duration: 0.4 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className={`
                                    flex flex-col items-center justify-center p-3 rounded-xl
                                    bg-white/5 backdrop-blur-md border border-white/10
                                    hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-black/20
                                    transition-all cursor-default group
                                `}
                            >
                                <div className="p-2 rounded-lg mb-2 bg-yellow-400/10 border border-yellow-400/20 group-hover:bg-yellow-400/20 transition-all duration-300 group-hover:scale-110">
                                    <role.icon className="w-6 h-6 text-yellow-400" />
                                </div>
                                <span className="text-xs font-semibold text-slate-300 text-center group-hover:text-white transition-colors">
                                    {role.name}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/20" />
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" />
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/20" />
                    </div>


                </div>
            </div>
        </div>
    );
}
