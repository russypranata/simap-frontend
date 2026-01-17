'use client';

import React from 'react';
import { BaseLayout } from '@/features/shared/components/BaseLayout';
import { AdminSidebar } from './AdminSidebar';
import { Navbar } from '@/features/shared/components/Navbar';
import { Footer } from '@/features/shared/components/Footer';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <BaseLayout
            sidebar={<AdminSidebar />}
            navbar={<Navbar showNotifications={true} />}
            footer={<Footer />}
        >
            {children}
        </BaseLayout>
    );
};

