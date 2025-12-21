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
    Facebook,
    Instagram,
    Youtube,
    MapPin,
    Phone,
    Mail,
    ExternalLink,
    Monitor,
    Library,
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


const ROLES = [
    {
        id: 'guru_mapel',
        title: 'Guru Mapel',
        description:
            'Pengelola pembelajaran & penilaian. Presensi mapel, jurnal, nilai (formatif/sumatif), & administrasi (ATP).',
        icon: BookOpen,
        color: 'bg-blue-50 text-blue-600',
        borderColor: 'group-hover:border-blue-200',
        gradient: 'from-blue-500/10 to-transparent',
    },
    {
        id: 'guru_piket',
        title: 'Guru Piket',
        description:
            'Garda kedisiplinan. Mencatat kehadiran pagi, keterlambatan, & monitoring sholat siswa.',
        icon: Clock,
        color: 'bg-orange-50 text-orange-600',
        borderColor: 'group-hover:border-orange-200',
        gradient: 'from-orange-500/10 to-transparent',
    },
    {
        id: 'walas',
        title: 'Wali Kelas',
        description:
            'Orang tua di sekolah. Monitoring track record siswa, kehadiran, & penanganan masalah kelas.',
        icon: UserRound,
        color: 'bg-emerald-50 text-emerald-600',
        borderColor: 'group-hover:border-emerald-200',
        gradient: 'from-emerald-500/10 to-transparent',
    },
    {
        id: 'ekskul',
        title: 'Pembina Ekskul',
        description:
            'Mengembangkan bakat minat. Presensi & pengajuan kegiatan ekstrakurikuler siswa.',
        icon: Star,
        color: 'bg-violet-50 text-violet-600',
        borderColor: 'group-hover:border-violet-200',
        gradient: 'from-violet-500/10 to-transparent',
    },
    {
        id: 'mutamayizin',
        title: 'PJ Mutamayizin',
        description:
            'Pengelola program unggulan. Manajemen data prestasi & kegiatan siswa juara.',
        icon: Sparkles,
        color: 'bg-pink-50 text-pink-600',
        borderColor: 'group-hover:border-pink-200',
        gradient: 'from-pink-500/10 to-transparent',
    },
    {
        id: 'siswa',
        title: 'Siswa',
        description:
            'End-user aktif. Pantau nilai, pelanggaran, e-rapor, & track record pribadi secara mandiri.',
        icon: User,
        color: 'bg-cyan-50 text-cyan-600',
        borderColor: 'group-hover:border-cyan-200',
        gradient: 'from-cyan-500/10 to-transparent',
    },
    {
        id: 'kepala_sekolah',
        title: 'Kepala Sekolah',
        description:
            'pimpinan sekolah. Monitoring kinerja sekolah, persetujuan, & evaluasi guru.',
        icon: GraduationCap,
        color: 'bg-indigo-50 text-indigo-600',
        borderColor: 'group-hover:border-indigo-200',
        gradient: 'from-indigo-500/10 to-transparent',
    },
    {
        id: 'admin',
        title: 'Administrator',
        description:
            'Teknis & Data. Manajemen user, database siswa/guru, & konfigurasi sistem sekolah.',
        icon: Shield,
        color: 'bg-slate-50 text-slate-700',
        borderColor: 'group-hover:border-slate-300',
        gradient: 'from-slate-500/10 to-transparent',
    },
    {
        id: 'orang_tua',
        title: 'Orang Tua',
        description:
            'Partner Sekolah. Monitoring kehadiran, nilai, & perkembangan karakter anak secara real-time.',
        icon: Users,
        color: 'bg-teal-50 text-teal-600',
        borderColor: 'group-hover:border-teal-200',
        gradient: 'from-teal-500/10 to-transparent',
    },
];

const RELATED_APPS = [
    {
        id: 'lms',
        name: 'E-Learning (LMS)',
        description: 'Platform pembelajaran daring berbasis Moodle. Akses materi, tugas, dan kuis secara online.',
        icon: Monitor,
        url: 'https://lms.fityankuburaya.sch.id/',
        color: 'bg-orange-50 text-orange-600',
    },
    {
        id: 'website',
        name: 'Website Resmi',
        description: 'Portal informasi utama sekolah. Berita, profil, dan agenda kegiatan terbaru.',
        icon: Globe,
        url: '#',
        color: 'bg-blue-50 text-blue-600',
    },
    {
        id: 'ppdb',
        name: 'PPDB Online',
        description: 'Sistem Penerimaan Peserta Didik Baru. Pendaftaran dan seleksi siswa baru.',
        icon: FileSpreadsheet,
        url: '#',
        color: 'bg-green-50 text-green-600',
    },
    {
        id: 'library',
        name: 'Perpustakaan Digital',
        description: 'Akses koleksi buku digital dan katalog perpustakaan sekolah.',
        icon: Library,
        url: '#',
        color: 'bg-purple-50 text-purple-600',
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
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                        Sistem Informasi{' '}
                        <span className="text-primary block mt-2">
                            Manajemen Administrasi Pendidikan
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
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
                            className="bg-primary hover:bg-blue-700 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1"
                        >
                            Mulai Sekarang
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-12 px-6 rounded-xl font-semibold border-slate-200 hover:bg-slate-50 text-slate-700"
                            asChild
                        >
                            <a
                                href="https://lms.fityankuburaya.sch.id/login/index.php"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                E-Learning
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="hidden lg:block relative">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-slate-100 max-w-[92%] mx-auto">
                        <img
                            src="/assets/illustrations/education-illustration.webp"
                            alt="Dashboard Preview"
                            className="w-full h-auto object-cover transform transition-transform hover:scale-105 duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-6 left-6 z-10">
                            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/90 px-4 py-2 text-sm font-bold text-primary shadow-lg backdrop-blur-md">
                                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                                Platform Pendidikan Digital Terdepan
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

const RolesSection = () => (
    <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <span className="text-primary font-semibold tracking-wider uppercase text-sm">
                    Ekosistem Sekolah
                </span>
                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                    Peran Pengguna & Klasifikasi
                </h2>
                <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                    Setiap elemen sekolah memiliki peran spesifik yang saling
                    terintegrasi dalam satu sistem
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
                {ROLES.map((role) => (
                    <div
                        key={role.id}
                        className={`group relative p-8 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 ${role.borderColor} w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex flex-col`}
                    >

                        <div className="relative z-10 flex-1 flex flex-col">
                            <div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 ${role.color}`}
                            >
                                <role.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">
                                {role.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                {role.description}
                            </p>
                        </div>
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
                            ${feature.color === 'yellow'
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
                                        className={`w-2 h-2 rounded-full mr-3 ${feature.color === 'yellow'
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




const RelatedAppsSection = () => (
    <section id="related-apps" className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
                <span className="text-primary font-semibold tracking-wider uppercase text-sm">
                    Ekosistem Digital
                </span>
                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                    Aplikasi Terkait
                </h2>
                <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                    Akses mudah ke berbagai platform digital pendukung kegiatan pendidikan di SMAIT Al-Fityan
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {RELATED_APPS.map((app) => (
                    <a
                        key={app.id}
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${app.color} bg-opacity-20`}>
                            <app.icon className="h-6 w-6" />
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                                {app.name}
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {app.description}
                            </p>
                        </div>

                        <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                            Akses Sekarang <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                    </a>
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
                className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled
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
                                    SMAIT Al-Fityan Kubu Raya
                                </p>
                            </div>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            {['Beranda', 'Fitur', 'Tentang'].map(
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
                        {['Beranda', 'Fitur', 'Tentang'].map(
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
                <RolesSection />
                <FeaturesSection />
                <RelatedAppsSection />
                <AboutSection />
            </main>

            <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        {/* Brand Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
                                    <School className="h-6 w-6" />
                                </div>
                                <div>
                                    <span className="font-bold text-2xl text-white tracking-tight">
                                        SIMAP
                                    </span>
                                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                                        SMAIT Al-Fityan Kubu Raya
                                    </p>
                                </div>
                            </div>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                Platform sistem informasi manajemen sekolah
                                terpadu. Mewujudkan pendidikan digital yang
                                efisien, transparan, dan terintegrasi.
                            </p>
                            <div className="flex items-start gap-3 text-sm text-slate-400">
                                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <span>
                                    Jl. Raya Sungai Kakap, Pal 9, <br />
                                    Kubu Raya, Kalimantan Barat
                                </span>
                            </div>
                        </div>

                        {/* Features Links */}
                        <div>
                            <h4 className="font-bold text-white text-lg mb-6">
                                Fitur Utama
                            </h4>
                            <ul className="space-y-4 text-sm">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                                        Manajemen Siswa
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                                        Absensi Digital
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                                        E-Rapor & Penilaian
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                                        Monitoring Pelanggaran
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-bold text-white text-lg mb-6">
                                Tautan Cepat
                            </h4>
                            <ul className="space-y-4 text-sm">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Beranda
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Tentang Sekolah
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Informasi PPDB
                                    </a>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setShowLogin(true)}
                                        className="hover:text-white transition-colors text-left"
                                    >
                                        Portal Login
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Contact & Social */}
                        <div>
                            <h4 className="font-bold text-white text-lg mb-6">
                                Terhubung
                            </h4>
                            <div className="space-y-4 mb-8">
                                <a
                                    href="mailto:info@alfityan.sch.id"
                                    className="flex items-center gap-3 text-sm hover:text-white transition-colors"
                                >
                                    <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-primary">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    info@alfityan.sch.id
                                </a>
                                <a
                                    href="tel:02112345678"
                                    className="flex items-center gap-3 text-sm hover:text-white transition-colors"
                                >
                                    <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-primary">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    (021) 1234-5678
                                </a>
                            </div>
                            <div className="flex gap-3">
                                {[Facebook, Instagram, Youtube].map(
                                    (Icon, i) => (
                                        <a
                                            key={i}
                                            href="#"
                                            className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <Icon className="h-5 w-5" />
                                        </a>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-500">
                            © {new Date().getFullYear()} SIMAP SMAIT Al-Fityan
                            Kubu Raya. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <a
                                href="#"
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            <div
                className={`fixed right-6 bottom-6 z-40 transition-all duration-500 ${scrolled
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
