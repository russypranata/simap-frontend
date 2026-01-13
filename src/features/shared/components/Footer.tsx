'use client';

import React from 'react';
import { School, HelpCircle, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-slate-50/50 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-5">
          {/* Left - Copyright */}
          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <div className="p-1.5 rounded-md bg-primary/10">
              <School className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-medium">© {currentYear} SIMAP</span>
            <span className="hidden sm:inline text-slate-500">• All rights reserved</span>
          </div>

          {/* Right - Links & Version */}
          <div className="flex items-center gap-5">
            <a href="#" className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-800 transition-colors">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Bantuan</span>
            </a>
            <div className="h-4 w-px bg-slate-300"></div>
            <a href="#" className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-800 transition-colors">
              <Shield className="h-3.5 w-3.5" />
              <span>Privasi</span>
            </a>
            <div className="h-4 w-px bg-slate-300"></div>
            <div className="px-2.5 py-1 rounded-md bg-blue-800 text-xs font-mono font-semibold text-white">
              v1.2.0
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};