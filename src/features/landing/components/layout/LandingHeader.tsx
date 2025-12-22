'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, GraduationCap, LogIn } from 'lucide-react';

interface LandingHeaderProps {
    scrolled: boolean;
    isMobileMenuOpen: boolean;
    onMobileMenuToggle: () => void;
    onLoginClick: () => void;
    onNavigate: (sectionId: string) => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
    scrolled,
    isMobileMenuOpen,
    onMobileMenuToggle,
    onLoginClick,
    onNavigate,
}) => {
    const [activeSection, setActiveSection] = useState('hero');

    const menuItems = [
        { label: 'Beranda', id: 'hero' },
        { label: 'Fitur', id: 'fitur' },
        { label: 'Tentang', id: 'tentang' }
    ];

    // Track active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['hero', 'fitur', 'tentang'];
            const scrollPosition = window.scrollY + 100;

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled
                ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/50'
                : 'bg-transparent'
                }`}
        >
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <div className="relative h-12 w-12 bg-gradient-to-br from-primary via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                            <GraduationCap className="w-6 h-6 text-white" strokeWidth={2.5} />
                            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div>
                            <h1 className="font-extrabold text-xl leading-tight bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
                                SIMAP
                            </h1>
                            <p className="text-xs text-slate-500 font-medium">
                                SMAIT Al-Fityan Kubu Raya
                            </p>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`
                                    relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300
                                    ${activeSection === item.id
                                        ? 'text-primary'
                                        : 'text-slate-600 hover:text-primary'
                                    }
                                `}
                            >
                                {item.label}
                                <span className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                            </button>
                        ))}

                        <div className="ml-4 pl-4 border-l border-slate-200">
                            <Button
                                onClick={onLoginClick}
                                className="relative overflow-hidden rounded-xl px-6 h-11 font-bold bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-primary shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                            >
                                <LogIn className="w-4 h-4 mr-2" />
                                <span className="relative z-10">Masuk Portal</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className={`
                            md:hidden p-2.5 rounded-xl transition-all duration-300
                            ${scrolled ? 'bg-slate-100 hover:bg-slate-200' : 'bg-white/10 hover:bg-white/20'}
                        `}
                        onClick={onMobileMenuToggle}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-5 h-5 text-slate-700" />
                        ) : (
                            <Menu className="w-5 h-5 text-slate-700" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Content */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl animate-in slide-in-from-top-5 duration-300">
                    <div className="px-4 py-6 space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`
                                    block w-full text-left px-4 py-3 rounded-xl font-semibold transition-all duration-300
                                    ${activeSection === item.id
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }
                                `}
                            >
                                {item.label}
                            </button>
                        ))}
                        <div className="pt-4">
                            <Button
                                onClick={onLoginClick}
                                className="w-full h-12 rounded-xl font-bold bg-gradient-to-r from-primary to-blue-700 shadow-lg"
                            >
                                <LogIn className="w-4 h-4 mr-2" />
                                Masuk Portal
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
