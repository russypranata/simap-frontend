import React from 'react';
import { ROLES } from '../../data/roles';
import { Sparkles, Users, GraduationCap, Network } from 'lucide-react';

export const RolesSection: React.FC = () => (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden" id="roles">
        {/* Large Background Icon Decorations */}
        <div className="absolute top-20 right-0 opacity-[0.03] pointer-events-none">
            <Users className="w-[600px] h-[600px] text-slate-900" strokeWidth={0.5} />
        </div>
        <div className="absolute bottom-10 left-0 opacity-[0.03] pointer-events-none">
            <GraduationCap className="w-[500px] h-[500px] text-slate-900" strokeWidth={0.5} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
            <Network className="w-[700px] h-[700px] text-slate-900" strokeWidth={0.5} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header - Left Aligned with Yellow Accent */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-200 mb-4">
                        <Sparkles className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-semibold text-yellow-700">
                            Ekosistem Sekolah
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                        <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                            Peran Pengguna
                        </span>
                        <br />
                        <span className="text-slate-900">& Klasifikasi</span>
                    </h2>
                </div>
                <div className="max-w-md">
                    <div className="flex gap-4 items-start">
                        {/* Yellow Divider */}
                        <div className="w-1 h-16 bg-yellow-500 rounded-full flex-shrink-0"></div>

                        {/* Description Text */}
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Setiap elemen sekolah memiliki peran spesifik yang{' '}
                            <span className="font-semibold text-yellow-600">saling terintegrasi</span>{' '}
                            dalam satu sistem
                        </p>
                    </div>
                </div>
            </div>

            {/* Role Cards - Creative Non-Card Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {ROLES.map((role, index) => (
                    <div
                        key={role.id}
                        className="group relative pt-8"
                        style={{
                            animationDelay: `${index * 50}ms`
                        }}
                    >
                        {/* Floating Background Blob */}
                        <div className={`absolute -inset-4 ${role.color.split(' ')[0]} rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110`}></div>

                        {/* Main Content Container - Colored Background */}
                        <div className={`relative h-full backdrop-blur-sm ${role.color.split(' ')[0]}/50 rounded-3xl overflow-visible transition-all duration-500 group-hover:${role.color.split(' ')[0]}/70 group-hover:scale-105 group-hover:-translate-y-2`}>
                            {/* Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-30 group-hover:opacity-50 transition-opacity duration-500 rounded-3xl`}></div>

                            {/* Floating Icon - Outside the box */}
                            <div className="absolute -top-8 left-6 z-20">
                                <div className="relative">
                                    {/* Icon Glow */}
                                    <div className={`absolute inset-0 ${role.color.split(' ')[0]} rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-300 scale-150`}></div>
                                    {/* Icon Container */}
                                    <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${role.color}`}>
                                        <role.icon className="h-8 w-8" />
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 pt-14 pb-8 px-6">
                                {/* Title with Underline Accent */}
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                                        {role.title}
                                    </h3>
                                    <div className={`h-1 w-12 rounded-full ${role.color.split(' ')[0]} group-hover:w-20 transition-all duration-300`}></div>
                                </div>

                                {/* Description */}
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {role.description}
                                </p>

                                {/* Decorative Corner Element */}
                                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity duration-500 overflow-hidden rounded-3xl">
                                    <div className={`absolute inset-0 ${role.color.split(' ')[0]} rounded-tl-full`}></div>
                                </div>

                                {/* Floating Dots Decoration */}
                                <div className="absolute top-4 right-4 flex gap-1 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
                                    <div className={`w-1.5 h-1.5 rounded-full ${role.color.split(' ')[0]}`}></div>
                                    <div className={`w-1.5 h-1.5 rounded-full ${role.color.split(' ')[0]}`}></div>
                                    <div className={`w-1.5 h-1.5 rounded-full ${role.color.split(' ')[0]}`}></div>
                                </div>
                            </div>

                            {/* Shimmer Effect on Hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
