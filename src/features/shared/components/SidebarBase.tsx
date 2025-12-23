"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
    const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

    const toggleSubmenu = (href: string) => {
        setOpenSubmenus((prev) =>
            prev.includes(href)
                ? prev.filter((item) => item !== href)
                : [...prev, href]
        );
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
                    <div className="pl-2 pr-4 py-2 space-y-1">
                        <nav>
                            {filteredMenuItems.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    (pathname === "/" &&
                                        defaultDashboardHref &&
                                        item.href === defaultDashboardHref);
                                const Icon = item.icon;
                                const hasSubItems = item.subItems && item.subItems.length > 0;
                                const isSubmenuOpen = openSubmenus.includes(item.href);
                                const isChildActive = item.subItems?.some(
                                    (sub) => pathname === sub.href
                                );

                                if (hasSubItems && !collapsed) {
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
                                                        "w-full justify-start mb-1 h-10 px-3",
                                                        (isActive || isChildActive) &&
                                                        "bg-primary text-primary-foreground hover:bg-primary/90"
                                                    )}
                                                >
                                                    <Icon className="h-4 w-4 mr-3" />
                                                    <span className="flex-1 text-left">{item.title}</span>
                                                    <ChevronDown
                                                        className={cn(
                                                            "h-4 w-4 transition-transform duration-200",
                                                            isSubmenuOpen ? "rotate-180" : ""
                                                        )}
                                                    />
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="space-y-1">
                                                {item.subItems!.map((subItem) => {
                                                    const isSubActive = pathname === subItem.href;
                                                    const SubIcon = subItem.icon;

                                                    const ButtonContent = (
                                                        <Button
                                                            variant="ghost"
                                                            className={cn(
                                                                "w-full justify-start h-9 pl-12 pr-3 text-sm mb-1",
                                                                isSubActive
                                                                    ? "text-primary font-medium bg-primary/5"
                                                                    : "text-foreground hover:bg-muted/50"
                                                            )}
                                                        >
                                                            <SubIcon
                                                                className={cn(
                                                                    "h-4 w-4 mr-3",
                                                                    isSubActive ? "text-primary" : "opacity-70"
                                                                )}
                                                            />
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
                                            "w-full justify-start mb-1",
                                            collapsed ? "h-10 w-10 p-0" : "h-10 px-3",
                                            isActive &&
                                            "bg-primary text-primary-foreground hover:bg-primary/90"
                                        )}
                                    >
                                        <Icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
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
            <div className="p-2 border-t shrink-0">
                <Button
                    variant="ghost"
                    onClick={onLogout}
                    className={cn(
                        "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
                        collapsed ? "h-10 w-10 p-0" : "h-10 px-3"
                    )}
                >
                    <LogOut className={cn("h-4 w-4", !collapsed && "mr-3")} />
                    {!collapsed && <span>Keluar</span>}
                </Button>
            </div>
        </div>
    );
};
