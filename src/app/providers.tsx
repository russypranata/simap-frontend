'use client';

import { RoleProvider } from './context/RoleContext';
import { ThemeProvider } from './context/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <RoleProvider>
        {children}
      </RoleProvider>
    </ThemeProvider>
  );
}
