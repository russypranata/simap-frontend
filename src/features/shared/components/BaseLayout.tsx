"use client";

import React, { useState, createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { NavbarBreadcrumb } from "./NavbarBreadcrumb";

interface BaseLayoutProps {
    children: React.ReactNode;
    sidebar: React.ReactNode;
    navbar: React.ReactNode;
    footer?: React.ReactNode;
    title?: string;
}

// Context for sidebar collapse state
const SidebarContext = createContext<{
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}>({
    collapsed: false,
    setCollapsed: () => { },
});

export const useSidebarContext = () => useContext(SidebarContext);

export const BaseLayout: React.FC<BaseLayoutProps> = ({
    children,
    sidebar,
    navbar,
    footer,
}) => {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <SidebarContext.Provider value={{ collapsed: sidebarCollapsed, setCollapsed: setSidebarCollapsed }}>
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
                <div
                    className={cn(
                        "flex flex-col min-w-0 w-full transition-all duration-300",
                        sidebarCollapsed ? "md:ml-16" : "md:ml-64"
                    )}
                >
                    {/* Navbar - Fixed at the top */}
                    <header
                        className={cn(
                            "fixed top-0 right-0 z-30 h-16 w-full bg-white shadow-sm transition-all duration-300",
                            sidebarCollapsed ? "md:w-[calc(100%-4rem)]" : "md:w-[calc(100%-16rem)]"
                        )}
                    >
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
                        <div className="min-h-full p-6">
                            <div className="mb-6">
                                <NavbarBreadcrumb />
                            </div>
                            {children}
                        </div>
                        {footer}
                    </main>
                </div>
            </div>
        </SidebarContext.Provider>
    );
};
