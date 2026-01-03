'use client';

import React from 'react';
import { School } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm mt-auto">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0 px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <School className="h-4 w-4" />
          <span>© {currentYear} SIMAP - <span className="hidden sm:inline">Sistem Informasi Manajemen Administrasi dan Pendidikan</span><span className="sm:hidden">SIMAP</span></span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Bantuan</a>
          <a href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</a>
          <span className="text-muted-foreground/40 font-mono text-xs">v1.2.0</span>
        </div>
      </div>
    </footer>
  );
};