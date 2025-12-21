import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { RELATED_APPS } from '../../data/apps';

export const RelatedAppsSection: React.FC = () => (
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
