"use client";

import React from "react";
import { BaseLayout } from "@/features/shared/components/BaseLayout";
import { TeacherSidebar } from "./TeacherSidebar";
import { Navbar } from "@/features/shared/components/Navbar";
import { Footer } from "@/features/shared/components/Footer";

interface TeacherLayoutProps {
    children: React.ReactNode;
}

export const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children }) => {
    return (
        <BaseLayout
            sidebar={<TeacherSidebar />}
            navbar={<Navbar title="SIMAP" showNotifications={true} />}
            footer={<Footer />}
        >
            {children}
        </BaseLayout>
    );
};
