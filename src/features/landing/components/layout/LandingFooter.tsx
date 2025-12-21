import React from 'react';
import {
    School,
    MapPin,
    Mail,
    Phone,
    Facebook,
    Instagram,
    Youtube,
} from 'lucide-react';

interface LandingFooterProps {
    onLoginClick: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onLoginClick }) => {
    const socialIcons = [
        { Icon: Facebook, href: '#' },
        { Icon: Instagram, href: '#' },
        { Icon: Youtube, href: '#' },
    ];

    return (
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
                            Platform sistem informasi manajemen sekolah terpadu.
                            Mewujudkan pendidikan digital yang efisien, transparan,
                            dan terintegrasi.
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
                            {[
                                'Manajemen Siswa',
                                'Absensi Digital',
                                'E-Rapor & Penilaian',
                                'Monitoring Pelanggaran',
                            ].map((feature) => (
                                <li key={feature}>
                                    <a
                                        href="#"
                                        className="hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                                        {feature}
                                    </a>
                                </li>
                            ))}
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
                                    onClick={onLoginClick}
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
                            {socialIcons.map(({ Icon, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-1"
                                >
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} SIMAP SMAIT Al-Fityan Kubu
                        Raya. All rights reserved.
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
    );
};
