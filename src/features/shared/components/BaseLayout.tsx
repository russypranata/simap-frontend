"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { NavbarBreadcrumb } from "./NavbarBreadcrumb";
import { BreadcrumbActionProvider, useBreadcrumbAction } from "@/context/BreadcrumbActionContext";

interface BaseLayoutProps {
    children: React.ReactNode;
    sidebar: React.ReactNode;
    navbar: React.ReactNode;
    footer?: React.ReactNode;
    title?: string;
    breadcrumbAction?: React.ReactNode;
}

const BreadcrumbRow: React.FC = () => {
    const { action } = useBreadcrumbAction();
    return (
        <div className="mb-4 flex items-center justify-between">
            <NavbarBreadcrumb />
            {action && <div className="flex items-center">{action}</div>}
        </div>
    );
};

const SidebarContext = createContext<{
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}>({
    collapsed: false,
    setCollapsed: () => { },
});

export const useSidebarContext = () => useContext(SidebarContext);

const SIDEBAR_COLLAPSED_KEY = 'sidebar_collapsed';

export const BaseLayout: React.FC<BaseLayoutProps> = ({
    children,
    sidebar,
    navbar,
    footer,
}) => {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Persist collapsed state in localStorage so it survives navigation & refresh
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Read from localStorage after mount to avoid SSR hydration mismatch
    useEffect(() => {
        const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
        if (saved === 'true') setSidebarCollapsed(true);
    }, []);

    const handleSetCollapsed = (value: boolean) => {
        setSidebarCollapsed(value);
        if (typeof window !== 'undefined') {
            localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(value));
        }
    };

    return (
        <BreadcrumbActionProvider>
        <SidebarContext.Provider value={{ collapsed: sidebarCollapsed, setCollapsed: handleSetCollapsed }}>
            <div className="flex min-h-screen bg-background">
                {/* Desktop Sidebar */}
                <aside className="fixed left-0 top-0 z-40 h-full bg-white shadow-md transition-all duration-300 hidden md:block">
                    {sidebar}
                </aside>

                {/* Mobile Sidebar Drawer */}
                <>
                    {mobileSidebarOpen && (
                        <div
                            className="fixed inset-0 z-40 bg-black/50 md:hidden"
                            onClick={() => setMobileSidebarOpen(false)}
                        />
                    )}
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
                <div
                    className={cn(
                        "flex flex-col min-w-0 w-full transition-all duration-300",
                        sidebarCollapsed ? "md:ml-16" : "md:ml-64"
                    )}
                >
                    <header
                        className={cn(
                            "fixed top-0 right-0 z-30 h-16 w-full bg-white shadow-sm transition-all duration-300",
                            sidebarCollapsed ? "md:w-[calc(100%-4rem)]" : "md:w-[calc(100%-16rem)]"
                        )}
                    >
                        <div className="flex h-16 items-center justify-between px-4">
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

                    <main className="flex-1 pt-16">
                        <div className="p-6">
                            <BreadcrumbRow />
                            {children}
                        </div>
                        {footer}
                    </main>
                </div>
            </div>
        </SidebarContext.Provider>
        </BreadcrumbActionProvider>
    );
};
