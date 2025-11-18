'use client';

import React from 'react';
import { School } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <School className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                SIMAP - Sistem Informasi Manajemen Administrasi dan Pendidikan
              </p>
              <p className="text-xs text-muted-foreground">
                © {currentYear} SIMAP. Semua hak dilindungi.
              </p>
            </div>
          </div>
          
          {/* <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-xs text-muted-foreground">
            <span>Versi 1.0.0</span>
            <span>•</span>
            <span>Dikembangkan dengan Next.js</span>
            <span>•</span>
            <span>Bantuan & Dukungan</span>
          </div> */}
        </div>
      </div>
    </footer>
  );
};