import React from 'react';
import { ROLES } from '../../data/roles';

export const RolesSection: React.FC = () => (
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
