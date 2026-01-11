"use client";

import React from "react";
import { BaseLayout } from "@/features/shared/components/BaseLayout";
import { ParentSidebar } from "./ParentSidebar";
import { Navbar } from "@/features/shared/components/Navbar";
import { Footer } from "@/features/shared/components/Footer";

interface ParentLayoutProps {
    children: React.ReactNode;
}

export const ParentLayout: React.FC<ParentLayoutProps> = ({ children }) => {
    return (
        <BaseLayout
            sidebar={<ParentSidebar />}
            navbar={<Navbar title="SIMAP - Orang Tua" showNotifications={true} />}
            footer={<Footer />}
        >
            {children}
        </BaseLayout>
    );
};
