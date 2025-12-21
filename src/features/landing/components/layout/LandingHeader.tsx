import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

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
    const menuItems = ['Beranda', 'Fitur', 'Tentang'];

    const getSectionId = (item: string) => {
        return item === 'Beranda' ? 'hero' : item.toLowerCase();
    };

    return (
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
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <div className="h-10 w-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight">SIMAP</h1>
                            <p className="text-xs text-slate-500 font-medium">
                                SMAIT Al-Fityan Kubu Raya
                            </p>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {menuItems.map((item) => (
                            <button
                                key={item}
                                onClick={() => onNavigate(getSectionId(item))}
                                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
                            >
                                {item}
                            </button>
                        ))}
                        <Button
                            onClick={onLoginClick}
                            className="rounded-full px-6 transition-transform hover:scale-105"
                        >
                            Masuk Portal
                        </Button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2"
                        onClick={onMobileMenuToggle}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Content */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-b p-4 space-y-4 shadow-lg animate-in slide-in-from-top-5">
                    {menuItems.map((item) => (
                        <button
                            key={item}
                            onClick={() => onNavigate(getSectionId(item))}
                            className="block w-full text-left py-2 font-medium text-slate-600"
                        >
                            {item}
                        </button>
                    ))}
                    <Button onClick={onLoginClick} className="w-full">
                        Masuk Portal
                    </Button>
                </div>
            )}
        </header>
    );
};
