"use client";

import React from "react";
import { BaseLayout } from "@/features/shared/components/BaseLayout";
import { AdvisorSidebar } from "./AdvisorSidebar";
import { Navbar } from "@/features/shared/components/Navbar";
import { Footer } from "@/features/shared/components/Footer";

interface AdvisorLayoutProps {
    children: React.ReactNode;
}

export const AdvisorLayout: React.FC<AdvisorLayoutProps> = ({ children }) => {
    return (
        <BaseLayout
            sidebar={<AdvisorSidebar />}
            navbar={<Navbar title="SIMAP" showNotifications={true} />}
            footer={<Footer />}
        >
            {children}
        </BaseLayout>
    );
};
