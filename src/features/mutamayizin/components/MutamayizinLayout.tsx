"use client";

import React from "react";
import { BaseLayout } from "@/features/shared/components/BaseLayout";
import { MutamayizinSidebar } from "./MutamayizinSidebar";
import { Navbar } from "@/features/shared/components/Navbar";
import { Footer } from "@/features/shared/components/Footer";

interface MutamayizinLayoutProps {
    children: React.ReactNode;
}

export const MutamayizinLayout: React.FC<MutamayizinLayoutProps> = ({ children }) => {
    return (
        <BaseLayout
            sidebar={<MutamayizinSidebar />}
            navbar={<Navbar title="SIMAP" showNotifications={true} />}
            footer={<Footer />}
        >
            {children}
        </BaseLayout>
    );
};
