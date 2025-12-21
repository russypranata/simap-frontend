import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
    onLoginClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLoginClick }) => (
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
