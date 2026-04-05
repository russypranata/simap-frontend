"use client";

import React from "react";

/**
 * Full-page skeleton shown during auth initialization (localStorage read).
 * Replaces `return null` in route layouts to avoid blank screen flash.
 * Renders a generic sidebar + topbar + content skeleton that fits all roles.
 */
export const AuthLoadingSkeleton: React.FC = () => (
    <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar skeleton */}
        <div className="hidden md:flex flex-col w-64 border-r bg-card shrink-0">
            {/* Logo area */}
            <div className="h-16 border-b px-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
                <div className="h-4 w-28 rounded bg-muted animate-pulse" />
            </div>
            {/* Nav items */}
            <div className="flex-1 p-4 space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2">
                        <div className="h-5 w-5 rounded bg-muted animate-pulse" />
                        <div className="h-4 rounded bg-muted animate-pulse" style={{ width: `${55 + (i % 3) * 15}%` }} />
                    </div>
                ))}
            </div>
        </div>

        {/* Main area */}
        <div className="flex flex-col flex-1 min-w-0">
            {/* Topbar skeleton */}
            <div className="h-16 border-b bg-card flex items-center justify-between px-4 shrink-0">
                <div className="h-7 w-36 rounded-full bg-muted animate-pulse" />
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                    <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
                </div>
            </div>

            {/* Page content skeleton */}
            <div className="flex-1 overflow-auto p-6 space-y-6">
                {/* Page header */}
                <div className="space-y-2">
                    <div className="h-8 w-64 rounded bg-muted animate-pulse" />
                    <div className="h-4 w-48 rounded bg-muted animate-pulse" />
                </div>
                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
                    ))}
                </div>
                {/* Content cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-64 rounded-xl bg-muted animate-pulse" />
                    <div className="h-64 rounded-xl bg-muted animate-pulse" />
                </div>
            </div>
        </div>
    </div>
);
