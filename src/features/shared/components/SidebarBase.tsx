"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    LogOut,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
} from "lucide-react";
import { useSidebarContext } from "./BaseLayout";

export interface SidebarItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    condition?: boolean;
    subItems?: SidebarItem[];
    isExternal?: boolean;
    defaultOpen?: boolean;
    isGroup?: boolean;
    sectionHeader?: boolean;
}

interface SidebarBaseProps {
    menuItems: SidebarItem[];
    onLogout: () => void;
    defaultDashboardHref?: string;
    className?: string;
}

export const SidebarBase: React.FC<SidebarBaseProps> = ({
    menuItems,
    onLogout,
    defaultDashboardHref,
    className,
}) => {
    const { collapsed, setCollapsed } = useSidebarContext();
    const pathname = usePathname();

    // Initialize openSubmenus — persist in localStorage so it survives refresh
    const getDefaultOpenSubmenus = () => {
        // Always open the submenu that contains the current active path
        const activeParents = menuItems
            .filter(item =>
                item.defaultOpen ||
                item.subItems?.some(sub => pathname === sub.href || pathname?.startsWith(sub.href))
            )
            .map(item => item.href);

        // Also restore previously opened submenus from localStorage
        try {
            const saved = localStorage.getItem('sidebar_open_submenus');
            if (saved) {
                const parsed: string[] = JSON.parse(saved);
                // Merge: always include active parents, plus any saved ones
                return Array.from(new Set([...activeParents, ...parsed]));
            }
        } catch { /* ignore */ }

        return activeParents;
    };

    const [openSubmenus, setOpenSubmenus] = useState<string[]>(getDefaultOpenSubmenus);

    const toggleSubmenu = (href: string) => {
        setOpenSubmenus((prev) => {
            const next = prev.includes(href)
                ? prev.filter((item) => item !== href)
                : [...prev, href];
            // Persist to localStorage
            try { localStorage.setItem('sidebar_open_submenus', JSON.stringify(next)); } catch { /* ignore */ }
            return next;
        });
    };

    const filteredMenuItems = menuItems.filter(
        (item) => item.condition !== false
    );

    return (
        <div
            className={cn(
                "relative flex flex-col h-full bg-card border-r transition-all duration-300",
                collapsed ? "w-16" : "w-64",
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 h-16 shrink-0 border-b">
                {!collapsed && (
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">
                                S
                            </span>
                        </div>
                        <span className="font-semibold text-foreground">SIMAP</span>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCollapsed(!collapsed)}
                    className="h-8 w-8 p-0"
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="pl-2 pr-4 py-3 space-y-1">
                        <nav>
                            {filteredMenuItems.map((item) => {
                                if (item.sectionHeader) {
                                    if (collapsed) {
                                        return <div key={item.title} className="my-2 border-t border-border/50" />;
                                    }
                                    return (
                                        <div key={item.title} className="px-4 py-2 mt-4 mb-2">
                                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                {item.title}
                                            </h3>
                                        </div>
                                    );
                                }

                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== "/" && pathname?.startsWith(item.href)) ||
                                    (pathname === "/" &&
                                        defaultDashboardHref &&
                                        item.href === defaultDashboardHref);
                                const Icon = item.icon;
                                const hasSubItems = item.subItems && item.subItems.length > 0;
                                const isSubmenuOpen = openSubmenus.includes(item.href);
                                const isChildActive = item.subItems?.some(
                                    (sub) => pathname === sub.href || pathname?.startsWith(sub.href + "/")
                                );

                                if (hasSubItems && !collapsed) {
                                    // Check if this is a static group (always visible, no collapse)
                                    if (item.isGroup) {
                                        return (
                                            <div key={item.href}>
                                                {/* Group Label - Use Button for consistent alignment */}
                                                <Button
                                                    variant="ghost"
                                                    className="w-full h-11 px-3 justify-start mb-1 cursor-default hover:bg-transparent"
                                                    disabled={false}
                                                    tabIndex={-1}
                                                >
                                                    <Icon className="h-5 w-5 mr-3 text-muted-foreground" />
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        {item.title}
                                                    </span>
                                                </Button>
                                                {/* Sub Items - With left border connector */}
                                                <div className="ml-5 pl-3 border-l-2 border-muted space-y-1">
                                                    {item.subItems!.map((subItem) => {
                                                        // Check if any other submenu has a more specific match
                                                        const hasMoreSpecificMatch = item.subItems!.some(
                                                            other =>
                                                                other.href !== subItem.href &&
                                                                other.href.startsWith(subItem.href) &&
                                                                (pathname === other.href || pathname?.startsWith(other.href + "/"))
                                                        );

                                                        // Only active if exact match or starts with this href (but no more specific match exists)
                                                        const isSubActive = !hasMoreSpecificMatch && (
                                                            pathname === subItem.href ||
                                                            (pathname?.startsWith(subItem.href + "/") ?? false)
                                                        );
                                                        const SubIcon = subItem.icon;

                                                        const ButtonContent = (
                                                            <Button
                                                                variant={isSubActive ? "secondary" : "ghost"}
                                                                className={cn(
                                                                    "w-full justify-start h-10 px-3 text-sm",
                                                                    isSubActive &&
                                                                    "bg-primary text-primary-foreground hover:bg-primary/90"
                                                                )}
                                                            >
                                                                {SubIcon && (
                                                                    <SubIcon
                                                                        className={cn(
                                                                            "h-4 w-4 mr-3",
                                                                            isSubActive ? "" : "opacity-70"
                                                                        )}
                                                                    />
                                                                )}
                                                                <span className="flex-1 text-left truncate">
                                                                    {subItem.title}
                                                                </span>
                                                            </Button>
                                                        );

                                                        if (subItem.isExternal) {
                                                            return (
                                                                <a
                                                                    key={subItem.href}
                                                                    href={subItem.href}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="block"
                                                                >
                                                                    {ButtonContent}
                                                                </a>
                                                            );
                                                        }

                                                        return (
                                                            <Link key={subItem.href} href={subItem.href}>
                                                                {ButtonContent}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    }

                                    // Collapsible submenu (existing behavior)
                                    return (
                                        <Collapsible
                                            key={item.href}
                                            open={isSubmenuOpen}
                                            onOpenChange={() => toggleSubmenu(item.href)}
                                            className="space-y-1"
                                        >
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant={
                                                        isActive || isChildActive ? "secondary" : "ghost"
                                                    }
                                                    className={cn(
                                                        "w-full justify-start mb-1 h-11 px-3",
                                                        (isActive || isChildActive) &&
                                                        "bg-primary text-primary-foreground hover:bg-primary/90"
                                                    )}
                                                >
                                                    <Icon className="h-5 w-5 mr-3" />
                                                    <span className="flex-1 text-left">{item.title}</span>
                                                    <ChevronDown
                                                        className={cn(
                                                            "h-4 w-4 transition-transform duration-200",
                                                            isSubmenuOpen ? "rotate-180" : ""
                                                        )}
                                                    />
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="ml-5 pl-3 border-l-2 border-muted space-y-1">
                                                {item.subItems!.map((subItem) => {
                                                    // Check if any other submenu has a more specific match
                                                    const hasMoreSpecificMatch = item.subItems!.some(
                                                        other =>
                                                            other.href !== subItem.href &&
                                                            other.href.startsWith(subItem.href) &&
                                                            (pathname === other.href || pathname?.startsWith(other.href + "/"))
                                                    );

                                                    // Only active if exact match or starts with this href (but no more specific match exists)
                                                    const isSubActive = !hasMoreSpecificMatch && (
                                                        pathname === subItem.href ||
                                                        (pathname?.startsWith(subItem.href + "/") ?? false)
                                                    );
                                                    const SubIcon = subItem.icon;

                                                    const ButtonContent = (
                                                        <Button
                                                            variant="ghost"
                                                            className={cn(
                                                                "w-full justify-start h-10 px-3 text-sm mb-1",
                                                                isSubActive
                                                                    ? "text-primary font-medium bg-primary/5"
                                                                    : "text-foreground hover:bg-muted/50"
                                                            )}
                                                        >
                                                            {SubIcon && (
                                                                <SubIcon
                                                                    className={cn(
                                                                        "h-4 w-4 mr-3",
                                                                        isSubActive ? "text-primary" : "opacity-70"
                                                                    )}
                                                                />
                                                            )}
                                                            <span className="flex-1 text-left truncate">
                                                                {subItem.title}
                                                            </span>
                                                        </Button>
                                                    );

                                                    if (subItem.isExternal) {
                                                        return (
                                                            <a
                                                                key={subItem.href}
                                                                href={subItem.href}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block"
                                                            >
                                                                {ButtonContent}
                                                            </a>
                                                        );
                                                    }

                                                    return (
                                                        <Link key={subItem.href} href={subItem.href}>
                                                            {ButtonContent}
                                                        </Link>
                                                    );
                                                })}
                                            </CollapsibleContent>
                                        </Collapsible>
                                    );
                                }

                                const ButtonContent = (
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full mb-1",
                                            collapsed
                                                ? "h-10 w-10 p-0 justify-center"
                                                : "h-11 px-3 justify-start",
                                            isActive &&
                                            "bg-primary text-primary-foreground hover:bg-primary/90"
                                        )}
                                    >
                                        <Icon className={cn(collapsed ? "h-4 w-4" : "h-5 w-5", !collapsed && "mr-3")} />
                                        {!collapsed && (
                                            <>
                                                <span className="flex-1 text-left">{item.title}</span>
                                                {item.badge && (
                                                    <Badge variant="secondary" className="ml-auto">
                                                        {item.badge}
                                                    </Badge>
                                                )}
                                            </>
                                        )}
                                    </Button>
                                );

                                return (
                                    <Link key={item.href} href={item.href}>
                                        {ButtonContent}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </ScrollArea>
            </div>

            {/* Footer */}
            <div className="p-3 border-t shrink-0">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100/50 transition-all",
                                collapsed ? "h-10 w-10 p-0 justify-center" : "h-10 px-3 bg-red-50/30"
                            )}
                        >
                            <LogOut className={cn("h-4 w-4", !collapsed && "mr-3")} />
                            {!collapsed && <span className="font-bold">Keluar Aplikasi</span>}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-[420px] p-0 overflow-hidden border-none shadow-xl">
                        <div className="flex flex-col sm:flex-row h-full">
                            <div className="w-full sm:w-24 bg-red-50 flex items-center justify-center p-6 sm:p-0">
                                <div className="p-3 bg-red-100 rounded-2xl rotate-3">
                                    <LogOut className="h-8 w-8 text-red-600" />
                                </div>
                            </div>
                            <div className="flex-1 p-6 sm:p-8 bg-card">
                                <AlertDialogHeader className="text-left space-y-3">
                                    <AlertDialogTitle className="text-xl font-bold">
                                        Akhiri Sesi?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-left leading-relaxed">
                                        Sesi Anda saat ini akan segera diakhiri. Mohon pastikan seluruh data dan perubahan pekerjaan Anda telah tersimpan dengan aman sebelum melanjutkan untuk keluar dari aplikasi.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="mt-8 gap-3 sm:space-x-0 sm:justify-end">
                                    <AlertDialogCancel className="border-0 bg-muted hover:bg-muted/80 h-11 rounded-xl px-5">
                                        Batal
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={onLogout}
                                        className="bg-red-600 hover:bg-red-700 text-white h-11 rounded-xl px-6"
                                    >
                                        Ya, Keluar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </div>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};
