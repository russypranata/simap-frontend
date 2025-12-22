import React from 'react';
import { FEATURES } from '../../data/features';
import { Sparkles, Zap } from 'lucide-react';

export const FeaturesSection: React.FC = () => (
    <section id="fitur" className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        {/* Large Background Icon Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
            <Zap className="w-[800px] h-[800px] text-slate-900" strokeWidth={0.5} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header - Centered with Badge */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-200 mb-4">
                    <Sparkles className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-semibold text-yellow-700">
                        Fitur Unggulan
                    </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                    <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                        Smart School
                    </span>{' '}
                    <span className="text-slate-900">System</span>
                </h2>

                <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Kelola berbagai administrasi pendidikan dengan lebih{' '}
                    <span className="font-semibold text-blue-600">mudah</span>,{' '}
                    <span className="font-semibold text-blue-600">efisien</span>, dan{' '}
                    <span className="font-semibold text-yellow-600">terintegrasi</span>.
                </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {FEATURES.map((feature, index) => (
                    <div
                        key={feature.id}
                        className="group relative"
                        style={{
                            animationDelay: `${index * 100}ms`
                        }}
                    >
                        {/* Card */}
                        <div className="relative h-full bg-white rounded-2xl p-8 border-2 border-slate-100 transition-all duration-300 group-hover:border-slate-200 group-hover:-translate-y-1">
                            {/* Icon */}
                            <div className="relative inline-flex mb-6">
                                <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${feature.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-primary'}`}>
                                    <feature.icon className="h-7 w-7" />
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                                {feature.name}
                            </h3>

                            {/* Description */}
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Feature Items */}
                            <ul className="space-y-3">
                                {feature.items.map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start text-sm text-slate-600"
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 mr-3 flex-shrink-0 ${feature.color === 'yellow' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Decorative Corner Element */}
                            <div className={`absolute bottom-0 right-0 w-24 h-24 ${feature.color === 'yellow' ? 'bg-yellow-50' : 'bg-blue-50'} rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
