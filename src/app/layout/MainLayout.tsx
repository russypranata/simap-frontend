'use client';

import React from 'react';
import { Navbar } from '@/features/shared/components/Navbar';
import { Footer } from '@/features/shared/components/Footer';
import { Sidebar } from './Sidebar';
import { useRole } from '@/app/context/RoleContext';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  showSidebar?: boolean;
  showNavbar?: boolean;
  showFooter?: boolean;
  currentPath?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'SIMAP',
  showSidebar = true,
  showNavbar = true,
  showFooter = true,
  currentPath = '/',
}) => {
  const { isAuthenticated } = useRole();

  return (
    <div className="min-h-screen bg-background">
      {showNavbar && isAuthenticated && (
        <Navbar title={title} showNotifications={true} />
      )}
      
      <div className="flex">
        {showSidebar && isAuthenticated && (
          <div className="hidden md:block">
            <Sidebar currentPath={currentPath} />
          </div>
        )}
        
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
          
          {showFooter && (
            <Footer />
          )}
        </main>
      </div>
    </div>
  );
};