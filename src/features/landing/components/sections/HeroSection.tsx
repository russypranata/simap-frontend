'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Rocket, BookOpen, Sparkles } from 'lucide-react';

interface HeroSectionProps {
    onLoginClick: () => void;
}

const slides = [
    {
        id: 1,
        image: '/assets/hero-slide-1.png',
        alt: 'Student Attendance Dashboard'
    },
    {
        id: 2,
        image: '/assets/hero-slide-2.png',
        alt: 'Classroom Management Interface'
    },
    {
        id: 3,
        image: '/assets/hero-slide-3.png',
        alt: 'School Administration System'
    }
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onLoginClick }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-slide effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000); // Change slide every 4 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center bg-white overflow-hidden"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/assets/hero.webp"
                    alt="Hero Background"
                    fill
                    className="object-cover object-center"
                    priority
                    quality={85}
                />
                <div className="absolute inset-0 bg-white/80"></div>
            </div>

            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
            </div>

            <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8 z-10 w-full">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div className="text-center lg:text-left space-y-4">
                        {/* Tagline Badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 border border-blue-200 mx-auto lg:mx-0">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">
                                Integrated School Management System
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Sistem{' '}
                            </span>
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Informasi
                            </span>
                            <span className="block mt-2">
                                <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                    Manajemen{' '}
                                </span>
                                <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                    Administrasi{' '}
                                </span>
                                <span className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                                    Pendidikan
                                </span>
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            <span className="font-bold text-slate-900">SIMAP</span> adalah solusi terpadu manajemen sekolah modern. Kelola
                            administrasi, pembelajaran, dan kolaborasi dalam satu
                            platform yang{' '}
                            <span className="text-primary font-semibold">
                                powerful
                            </span>{' '}
                            dan{' '}
                            <span className="text-yellow-600 font-semibold">
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
                                <Rocket className="w-5 h-5 mr-2" />
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
                                    className="flex items-center"
                                >
                                    <BookOpen className="w-5 h-5 mr-2" />
                                    E-Learning
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Stacked Cards Slider */}
                    <div className="hidden lg:flex justify-center items-center">
                        <div className="relative w-[480px] h-[350px]">
                            {/* Stack of 3 cards */}
                            {slides.map((slide, index) => {
                                const position = (index - currentSlide + slides.length) % slides.length;

                                return (
                                    <div
                                        key={slide.id}
                                        className="absolute inset-0 transition-all duration-700 ease-out"
                                        style={{
                                            transform: `
                                                translateX(${position * 8}px) 
                                                translateY(${position * -20}px) 
                                                scale(${1 - position * 0.08})
                                                rotateZ(${position * -3}deg)
                                            `,
                                            zIndex: slides.length - position,
                                            opacity: position === 0 ? 1 : position === 1 ? 0.85 : 0.6,
                                            transformOrigin: 'top center',
                                        }}
                                    >
                                        <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-white bg-white relative">
                                            <Image
                                                src={slide.image}
                                                alt={slide.alt}
                                                fill
                                                className="object-cover"
                                                priority={index === 0} // Priority load only the first/active slide
                                                sizes="(max-width: 768px) 100vw, 480px"
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Yellow Dot Pagination */}
                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`
                                            w-2.5 h-2.5 rounded-full transition-all duration-300
                                            ${currentSlide === index
                                                ? 'bg-yellow-500 w-8'
                                                : 'bg-yellow-500/40 hover:bg-yellow-500/60'
                                            }
                                        `}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
