'use client';

import React, { useState, useEffect } from 'react';
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
    LogIn,
    User,
    Lock,
    Menu,
    X,
    Zap,
    ArrowRight,
    Play,
    GraduationCap,
    BookOpen,
    Shield,
    TrendingUp,
    Sparkles,
    Star,
    Globe,
    Users,
    ChevronUp,
    Clock,
    FileSpreadsheet,
    UserRound,
} from 'lucide-react';

// --- Data Constants ---

const FEATURES = [
    {
        id: 'student-management',
        name: 'Manajemen Siswa',
        description: 'Kelola data siswa secara komprehensif',
        icon: Users,
        color: 'blue',
        items: [
            'Database siswa bulanan',
            'Profil & prestasi siswa',
            'Riwayat kelakuan',
            'Pencatatan prestasi',
        ],
    },
    {
        id: 'attendance',
        name: 'Absensi & Monitoring',
        description: 'Sistem absensi digital yang komprehensif',
        icon: UserRound,
        color: 'yellow',
        items: [
            'Absen pagi & harian',
            'Ringkasan kehadiran',
            'Monitoring sholat',
            'Kegiatan ekskul',
        ],
    },
    {
        id: 'academic-records',
        name: 'Raport & Nilai',
        description: 'Sistem penilaian dan pelaporan akademik',
        icon: FileSpreadsheet,
        color: 'blue',
        items: [
            'Pengelolaan nilai terstruktur',
            'Manajemen remedial',
            'E-rapor digital',
            'Rapor Quran (Tahfidz)',
        ],
    },
    {
        id: 'teaching-docs',
        name: 'Administrasi Guru',
        description: 'Dokumentasi kegiatan mengajar',
        icon: BookOpen,
        color: 'yellow',
        items: [
            'Jurnal mengajar harian',
            'Laporan tugas piket',
            'Dokumentasi digital',
            'Arsip pembelajaran',
        ],
    },
    {
        id: 'class-admin',
        name: 'Administrasi Walas',
        description: 'Administrasi wali kelas',
        icon: School,
        color: 'blue',
        items: [
            'Pengelolaan kelas',
            'Arsip rapor digital',
            'Transkrip nilai (E-ijazah)',
            'Monitoring kelas',
        ],
    },
];

const TESTIMONIALS = [
    {
        id: 1,
        name: 'Ahmad Fauzi',
        role: 'Kepala Sekolah',
        content:
            'SIMAP telah merevolusi sistem administrasi kami. Pengelolaan data siswa menjadi lebih terstruktur.',
        rating: 5,
    },
    {
        id: 2,
        name: 'Siti Nurhaliza',
        role: 'Wali Kelas XI',
        content:
            'Fitur e-rapor dan absensi digital sangat membantu dalam pekerjaan sehari-hari.',
        rating: 5,
    },
    {
        id: 3,
        name: 'Budi Santoso',
        role: 'Orang Tua Siswa',
        content:
            'Saya sangat terbantu dengan sistem informasi yang transparan. Bisa pantau anak real-time.',
        rating: 4,
    },
];

const STATS = [
    {
        value: '1200+',
        label: 'Total Pengguna',
        description: 'Guru, siswa, dan orang tua',
        icon: Users,
        color: 'primary',
    },
    {
        value: '98%',
        label: 'Tingkat Kepuasan',
        description: 'Berdasarkan survei',
        icon: Star,
        color: 'secondary',
    },
    {
        value: '250+',
        label: 'Siswa Aktif',
        description: 'Menggunakan setiap hari',
        icon: Users,
        color: 'primary',
    },
    {
        value: '70%',
        label: 'Efisiensi Waktu',
        description: 'Hemat waktu admin',
        icon: Clock,
        color: 'secondary',
    },
];

// --- Sub-Components ---

const HeroSection = ({ onLoginClick }: { onLoginClick: () => void }) => (
    <section
        id="hero"
        className="relative min-h-screen flex items-center bg-white overflow-hidden"
    >
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/assets/hero.webp')" }}
            ></div>
            <div className="absolute inset-0 bg-white/80"></div>
        </div>

        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8 z-10 w-full">
            <div className="grid items-center gap-12 lg:grid-cols-2">
                <div className="text-center lg:text-left space-y-8">
                    <div className="inline-flex items-center rounded-full border border-secondary/30 bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary-foreground backdrop-blur-sm shadow-sm">
                        <span className="flex h-2 w-2 rounded-full bg-secondary mr-2 animate-pulse"></span>
                        Platform Pendidikan Digital Terdepan
                    </div>

                    <h1 className="text-4xl text-slate-900 font-extrabold tracking-tight sm:text-5xl lg:text-7xl leading-[1.1]">
                        Transformasi
                        <span className="block text-primary">
                            Pendidikan Digital
                        </span>
                    </h1>

                    <p className="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        Solusi terpadu manajemen sekolah modern. Kelola
                        administrasi, pembelajaran, dan kolaborasi dalam satu
                        platform yang{' '}
                        <span className="text-primary font-semibold">
                            powerful
                        </span>{' '}
                        dan{' '}
                        <span className="text-secondary-foreground font-semibold">
                            intuitif
                        </span>
                        .
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Button
                            size="lg"
                            onClick={onLoginClick}
                            className="bg-primary hover:bg-blue-700 text-white font-bold h-14 px-8 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1"
                        >
                            Mulai Sekarang
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-14 px-8 rounded-xl font-semibold border-slate-200 hover:bg-slate-50 text-slate-700"
                            asChild
                        >
                            <a
                                href="https://moodle.codebois.xyz/login"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Play className="mr-2 h-5 w-5 fill-current" />
                                E-Learning
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="hidden lg:block relative">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-slate-100">
                        <img
                            src="/assets/illustrations/education-illustration.webp"
                            alt="Dashboard Preview"
                            className="w-full h-auto object-cover transform transition-transform hover:scale-105 duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none"></div>

                        {/* Floating Cards */}
                        <div className="absolute bottom-8 left-8 right-8 flex gap-4">
                            <div className="flex-1 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200 flex items-center gap-3">
                                <div className="p-2.5 bg-blue-100 rounded-lg text-primary">
                                    <GraduationCap className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">
                                        Siswa
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Data Terpusat
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200 flex items-center gap-3">
                                <div className="p-2.5 bg-yellow-100 rounded-lg text-yellow-700">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">
                                        Statistik
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Real-time Update
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative dots */}
                    <div className="absolute -z-10 -top-8 -right-8">
                        <div className="w-24 h-24 bg-pattern-dots opacity-20"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const StatsSection = () => (
    <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
                    Angka yang Membuktikan
                </h2>
                <p className="text-lg text-slate-600">
                    Transformasi digital yang telah dirasakan oleh ribuan
                    pengguna di lingkungan sekolah kami.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {STATS.map((stat, idx) => (
                    <div
                        key={idx}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                    >
                        <div
                            className={`
                            w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg
                            ${
                                stat.color === 'primary'
                                    ? 'bg-primary'
                                    : 'bg-secondary text-secondary-foreground'
                            }
                        `}
                        >
                            <stat.icon className="h-7 w-7" />
                        </div>
                        <h3
                            className={`text-4xl font-bold mb-2 ${
                                stat.color === 'primary'
                                    ? 'text-primary'
                                    : 'text-yellow-600'
                            }`}
                        >
                            {stat.value}
                        </h3>
                        <p className="font-semibold text-slate-900 text-lg mb-1">
                            {stat.label}
                        </p>
                        <p className="text-slate-500 text-sm">
                            {stat.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FeaturesSection = () => (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
                <span className="text-primary font-semibold tracking-wider uppercase text-sm">
                    Fitur Unggulan
                </span>
                <h2 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">
                    Smart School System
                </h2>
                <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
                    Kelola berbagai administrasi pendidikan dengan lebih mudah,
                    efisien, dan terintegrasi.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {FEATURES.map((feature) => (
                    <div
                        key={feature.id}
                        className="group relative bg-slate-50 rounded-2xl p-8 transition-all hover:bg-white hover:shadow-2xl border border-transparent hover:border-primary/20"
                    >
                        <div
                            className={`
                            w-14 h-14 rounded-xl mb-6 flex items-center justify-center transition-transform group-hover:scale-110
                            ${
                                feature.color === 'yellow'
                                    ? 'bg-yellow-100 text-yellow-600'
                                    : 'bg-blue-100 text-primary'
                            }
                        `}
                        >
                            <feature.icon className="h-7 w-7" />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                            {feature.name}
                        </h3>
                        <p className="text-slate-600 mb-6">
                            {feature.description}
                        </p>

                        <ul className="space-y-3">
                            {feature.items.map((item, i) => (
                                <li
                                    key={i}
                                    className="flex items-center text-sm text-slate-600"
                                >
                                    <div
                                        className={`w-2 h-2 rounded-full mr-3 ${
                                            feature.color === 'yellow'
                                                ? 'bg-secondary'
                                                : 'bg-primary'
                                        }`}
                                    ></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const TestimonialsSection = () => (
    <section id="testimoni" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                    Dipercaya Komunitas
                </h2>
                <p className="mt-4 text-lg text-slate-600">
                    Apa kata mereka tentang pengalaman menggunakan SIMAP
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TESTIMONIALS.map((testi) => (
                    <div
                        key={testi.id}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
                    >
                        <div className="flex gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-5 w-5 ${
                                        i < testi.rating
                                            ? 'text-secondary fill-secondary'
                                            : 'text-slate-200'
                                    }`}
                                />
                            ))}
                        </div>
                        <blockquote className="mb-6 text-slate-700 leading-relaxed italic">
                            "{testi.content}"
                        </blockquote>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold text-lg">
                                {testi.name[0]}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">
                                    {testi.name}
                                </div>
                                <div className="text-sm text-slate-500">
                                    {testi.role}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const AboutSection = () => (
    <section id="tentang" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <div className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-50 text-primary font-semibold text-sm">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Tentang Sekolah
                    </div>
                    <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                        Membangun Generasi <br />
                        <span className="text-primary">Unggul</span> &{' '}
                        <span className="text-secondary-foreground">
                            Berakhlak
                        </span>
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        SMAIT Al-Fityan berkomitmen mencetak generasi yang tidak
                        hanya unggul secara akademis, tetapi juga memiliki
                        karakter islami yang kuat. SIMAP hadir sebagai wujud
                        nyata transformasi digital dalam mendukung visi
                        pendidikan kami.
                    </p>

                    <div className="grid grid-cols-2 gap-6 pt-4">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="text-3xl font-bold text-primary mb-1">
                                2013
                            </div>
                            <div className="text-sm text-slate-500">
                                Tahun Berdiri
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="text-3xl font-bold text-secondary-foreground mb-1">
                                250+
                            </div>
                            <div className="text-sm text-slate-500">
                                Siswa Aktif
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary opacity-20 blur-3xl rounded-full"></div>
                    <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
                        <div className="grid gap-6">
                            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="p-3 rounded-lg bg-blue-100 text-primary">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">
                                        Keamanan Data
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                        Enkripsi ketat dan backup otomatis untuk
                                        melindungi privasi.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="p-3 rounded-lg bg-yellow-100 text-yellow-700">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">
                                        Efisiensi Tinggi
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                        Menghemat waktu administrasi hingga 70%
                                        dengan otomatisasi.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="p-3 rounded-lg bg-green-100 text-green-700">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">
                                        Akses Dimana Saja
                                    </h4>
                                    <p className="text-sm text-slate-600">
                                        Platform berbasis cloud yang dapat
                                        diakses 24/7 dari perangkat apapun.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// --- Main Component ---

export const WelcomeScreen: React.FC = () => {
    const { login } = useRole();
    const [showLogin, setShowLogin] = useState(false);
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
        role: 'guru' as 'guru' | 'siswa' | 'admin' | 'orang_tua',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (loginData.username && loginData.password) {
            login(loginData.role);
        }
        setIsLoading(false);
    };

    const handleQuickLogin = (role: 'guru' | 'siswa' | 'admin' | 'orang_tua') =>
        login(role);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    if (showLogin) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-2xl border-0 animate-in fade-in zoom-in duration-300">
                    <CardHeader className="text-center space-y-2 pt-8">
                        <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-4">
                            <School className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            Masuk ke SIMAP
                        </CardTitle>
                        <CardDescription>
                            Sistem Informasi Manajemen Akademik
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pb-8">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Peran Pengguna</Label>
                                <Select
                                    value={loginData.role}
                                    onValueChange={(val: any) =>
                                        setLoginData((prev) => ({
                                            ...prev,
                                            role: val,
                                        }))
                                    }
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="guru">
                                            Guru
                                        </SelectItem>
                                        <SelectItem value="siswa">
                                            Siswa
                                        </SelectItem>
                                        <SelectItem value="admin">
                                            Administrator
                                        </SelectItem>
                                        <SelectItem value="orang_tua">
                                            Orang Tua
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Username</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        className="pl-10 h-11"
                                        placeholder="Masukkan username"
                                        value={loginData.username}
                                        onChange={(e) =>
                                            setLoginData((prev) => ({
                                                ...prev,
                                                username: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        type="password"
                                        className="pl-10 h-11"
                                        placeholder="Masukkan password"
                                        value={loginData.password}
                                        onChange={(e) =>
                                            setLoginData((prev) => ({
                                                ...prev,
                                                password: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 font-semibold"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Memproses...' : 'Masuk sekarang'}
                            </Button>

                            <Button
                                variant="ghost"
                                type="button"
                                className="w-full"
                                onClick={() => setShowLogin(false)}
                            >
                                Kembali ke Beranda
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-500">
                                    Quick Login (Demo)
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {['guru', 'siswa', 'admin', 'orang_tua'].map(
                                (r) => (
                                    <Button
                                        key={r}
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleQuickLogin(r as any)
                                        }
                                        className="capitalize"
                                    >
                                        {r.replace('_', ' ')}
                                    </Button>
                                )
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20 selection:text-primary">
            {/* Header / Nav */}
            <header
                className={`fixed top-0 z-50 w-full transition-all duration-300 ${
                    scrolled
                        ? 'bg-white/90 backdrop-blur-md shadow-sm'
                        : 'bg-transparent'
                }`}
            >
                <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() =>
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }
                        >
                            <div className="h-10 w-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">
                                    S
                                </span>
                            </div>
                            <div>
                                <h1 className="font-bold text-lg leading-tight">
                                    SIMAP
                                </h1>
                                <p className="text-xs text-slate-500 font-medium">
                                    SMAIT Al-Fityan
                                </p>
                            </div>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            {['Beranda', 'Fitur', 'Testimoni', 'Tentang'].map(
                                (item) => (
                                    <button
                                        key={item}
                                        onClick={() =>
                                            scrollToSection(
                                                item === 'Beranda'
                                                    ? 'hero'
                                                    : item.toLowerCase()
                                            )
                                        }
                                        className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
                                    >
                                        {item}
                                    </button>
                                )
                            )}
                            <Button
                                onClick={() => setShowLogin(true)}
                                className="rounded-full px-6 transition-transform hover:scale-105"
                            >
                                Masuk Portal
                            </Button>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="md:hidden p-2"
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu Content */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-b p-4 space-y-4 shadow-lg animate-in slide-in-from-top-5">
                        {['Beranda', 'Fitur', 'Testimoni', 'Tentang'].map(
                            (item) => (
                                <button
                                    key={item}
                                    onClick={() =>
                                        scrollToSection(
                                            item === 'Beranda'
                                                ? 'hero'
                                                : item.toLowerCase()
                                        )
                                    }
                                    className="block w-full text-left py-2 font-medium text-slate-600"
                                >
                                    {item}
                                </button>
                            )
                        )}
                        <Button
                            onClick={() => setShowLogin(true)}
                            className="w-full"
                        >
                            Masuk Portal
                        </Button>
                    </div>
                )}
            </header>

            <main>
                <HeroSection onLoginClick={() => setShowLogin(true)} />
                <StatsSection />
                <FeaturesSection />
                <TestimonialsSection />
                <AboutSection />
            </main>

            <footer className="bg-slate-50 py-12 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                    <School className="h-5 w-5" />
                                </div>
                                <span className="font-bold text-xl">SIMAP</span>
                            </div>
                            <p className="text-slate-500 max-w-sm">
                                Platform sistem informasi manajemen sekolah
                                terpadu untuk efisiensi dan transparansi
                                pendidikan.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Tautan</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li>
                                    <a href="#" className="hover:text-primary">
                                        Beranda
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary">
                                        Fitur
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary">
                                        Kontak
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Hubungi Kami</h4>
                            <p className="text-sm text-slate-500 mb-2">
                                info@alfityan.sch.id
                            </p>
                            <p className="text-sm text-slate-500">
                                (021) 1234-5678
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-500">
                            © {new Date().getFullYear()} SIMAP SMAIT Al-Fityan.
                            All rights reserved.
                        </p>
                        <div className="flex gap-4">
                            {/* Social icons could go here */}
                        </div>
                    </div>
                </div>
            </footer>

            <div
                className={`fixed right-6 bottom-6 z-40 transition-all duration-500 ${
                    scrolled
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-10'
                }`}
            >
                <Button
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                    size="icon"
                    className="rounded-full shadow-lg bg-secondary hover:bg-yellow-500 text-secondary-foreground h-12 w-12"
                >
                    <ChevronUp className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
};
