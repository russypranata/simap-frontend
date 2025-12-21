import React from 'react';
import { FEATURES } from '../../data/features';

export const FeaturesSection: React.FC = () => (
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
