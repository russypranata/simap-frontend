"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/features/shared/components/Navbar";
import { Footer } from "@/features/shared/components/Footer";
import { Sidebar } from "./Sidebar";
import { useRole } from "@/app/context/RoleContext";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  showSidebar?: boolean;
  showNavbar?: boolean;
  showFooter?: boolean;
  currentPath?: string; // Keep for backwards compatibility but not used
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = "SIMAP",
  showSidebar = true,
  showNavbar = true,
  showFooter = true,
}) => {
  const { isAuthenticated } = useRole();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Dynamic sidebar width based on collapsed state
  const sidebarWidth = sidebarCollapsed ? "w-16" : "w-64";
  const sidebarWidthClass = sidebarCollapsed ? "md:ml-16" : "md:ml-64";
  const navbarWidthClass = sidebarCollapsed
    ? "md:w-[calc(100%-4rem)]"
    : "md:w-[calc(100%-16rem)]";

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  // Close mobile sidebar when desktop sidebar is toggled
  const handleCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
    // Close mobile sidebar if desktop sidebar is being collapsed
    if (collapsed) {
      setMobileSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar - Fixed on the left, hidden on mobile */}
      {showSidebar && isAuthenticated && (
        <aside
          className={cn(
            "fixed left-0 top-0 z-40 h-full bg-white shadow-md transition-all duration-300 hidden md:block",
            sidebarWidth
          )}
        >
          <Sidebar
            onCollapseChange={handleCollapseChange}
          />
        </aside>
      )}

      {/* Mobile Sidebar Drawer - Overlay on mobile devices */}
      {showSidebar && isAuthenticated && (
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
              "fixed left-0 top-0 z-50 h-full bg-white shadow-md transition-transform duration-300 md:hidden",
              "w-64",
              mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <Sidebar
              onCollapseChange={handleCollapseChange}
            />
          </aside>
        </>
      )}

      {/* Main content area */}
      <div
        className={cn(
          "flex flex-col min-w-0 w-full transition-all duration-300",
          showSidebar && sidebarWidthClass
        )}
      >
        {/* Navbar - Fixed at the top */}
        {showNavbar && isAuthenticated && (
          <header
            className={cn(
              "fixed top-0 right-0 z-30 h-16 w-full bg-white shadow-sm transition-all duration-300",
              showSidebar && navbarWidthClass
            )}
          >
            <div className="flex h-16 items-center justify-between px-4">
              {/* Hamburger menu for mobile */}
              {showSidebar && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMobileSidebar}
                  className="md:hidden h-9 w-9 p-0"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}

              <div className="flex-1">
                <Navbar showNotifications={true} />
              </div>
            </div>
          </header>
        )}

        {/* Page content - only this area can scroll */}
        <main
          className={cn(
            "flex-1 overflow-y-auto overflow-x-auto pt-16", // Both vertical and horizontal scroll
            showSidebar && "md:ml-0"
          )}
        >
          <div className="min-h-full p-6">{children}</div>

          {showFooter && <Footer />}
        </main>
      </div>
    </div>
  );
};