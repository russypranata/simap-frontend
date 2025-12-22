import React from 'react';
import { ArrowRight, ExternalLink, Sparkles, Globe } from 'lucide-react';
import { RELATED_APPS } from '../../data/apps';

export const RelatedAppsSection: React.FC = () => (
    <section id="related-apps" className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* Large Background Icon Decoration */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-[0.02] pointer-events-none">
            <Globe className="w-[700px] h-[700px] text-slate-900" strokeWidth={0.5} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header - Centered with Badge */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-200 mb-4">
                    <Sparkles className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-semibold text-yellow-700">
                        Ekosistem Digital
                    </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                    <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                        Aplikasi
                    </span>{' '}
                    <span className="text-slate-900">Terkait</span>
                </h2>

                <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Akses mudah ke berbagai{' '}
                    <span className="font-semibold text-blue-600">platform digital</span>{' '}
                    pendukung kegiatan pendidikan di{' '}
                    <span className="font-semibold text-yellow-600">SMAIT Al-Fityan</span>
                </p>
            </div>

            {/* App Cards - Creative Non-Card Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {RELATED_APPS.map((app, index) => (
                    <a
                        key={app.id}
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex flex-col"
                        style={{
                            animationDelay: `${index * 75}ms`
                        }}
                    >
                        {/* Floating Icon with Colored Background */}
                        <div className="relative mb-8">
                            <div className={`absolute inset-0 ${app.color} opacity-20 rounded-2xl blur-xl group-hover:opacity-40 transition-all duration-500 scale-110`}></div>
                            <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${app.color} bg-opacity-20`}>
                                <app.icon className="h-7 w-7" />
                            </div>
                        </div>

                        {/* Content with Left Border Accent */}
                        <div className="relative pl-6 border-l-2 border-slate-200 group-hover:border-blue-500 transition-all duration-300">
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                                {app.name}
                                <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h3>
                            <p className="text-base text-slate-600 leading-relaxed mb-5">
                                {app.description}
                            </p>

                            {/* CTA with Arrow */}
                            <div className="flex items-center text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                                Akses Sekarang
                                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        {/* Subtle Background on Hover */}
                        <div className="absolute inset-0 -z-10 bg-slate-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-2"></div>
                    </a>
                ))}
            </div>
        </div>
    </section>
);
