import React from 'react';
import {
    GraduationCap,
    Shield,
    TrendingUp,
    Globe,
} from 'lucide-react';

export const AboutSection: React.FC = () => (
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
