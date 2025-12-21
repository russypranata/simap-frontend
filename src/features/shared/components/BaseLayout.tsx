"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface BaseLayoutProps {
    children: React.ReactNode;
    sidebar: React.ReactNode;
    navbar: React.ReactNode;
    footer?: React.ReactNode;
    title?: string;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
    children,
    sidebar,
    navbar,
    footer,
}) => {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Desktop Sidebar - Fixed on the left, hidden on mobile */}
            <aside className="fixed left-0 top-0 z-40 h-full bg-white shadow-md transition-all duration-300 hidden md:block">
                {sidebar}
            </aside>

            {/* Mobile Sidebar Drawer - Overlay on mobile devices */}
            <>
                {/* Overlay for mobile sidebar */}
                {mobileSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 md:hidden"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                )}

                {/* Mobile sidebar */}
                <aside
                    className={cn(
                        "fixed left-0 top-0 z-50 h-full bg-white shadow-md transition-transform duration-300 md:hidden w-64",
                        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    {sidebar}
                </aside>
            </>

            {/* Main content area */}
            <div className="flex flex-col min-w-0 w-full transition-all duration-300 md:ml-64">
                {/* Navbar - Fixed at the top */}
                <header className="fixed top-0 right-0 z-30 h-16 w-full md:w-[calc(100%-16rem)] bg-white shadow-sm transition-all duration-300">
                    <div className="flex h-16 items-center justify-between px-4">
                        {/* Hamburger menu for mobile */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                            className="md:hidden h-9 w-9 p-0"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div className="flex-1">{navbar}</div>
                    </div>
                </header>

                {/* Page content - only this area can scroll */}
                <main className="flex-1 overflow-y-auto overflow-x-auto pt-16">
                    <div className="min-h-full p-6">{children}</div>
                    {footer}
                </main>
            </div>
        </div>
    );
};
