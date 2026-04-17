'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RoleProvider } from './context/RoleContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,                    // selalu refetch saat mount — data selalu fresh
            gcTime: 5 * 60 * 1000,          // cache disimpan 5 menit setelah tidak dipakai
            retry: 1,                        // retry 1x kalau gagal
            refetchOnWindowFocus: false,     // tidak refetch saat tab di-focus ulang
        },
    },
});

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <RoleProvider>
                    {children}
                    <Toaster />
                    <SonnerToaster />
                </RoleProvider>
            </ThemeProvider>
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    );
}
