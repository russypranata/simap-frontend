"use client";

import React from "react";
import { BaseLayout } from "@/features/shared/components/BaseLayout";
import { StudentSidebar } from "./StudentSidebar";
import { Navbar } from "@/features/shared/components/Navbar";
import { Footer } from "@/features/shared/components/Footer";

interface StudentLayoutProps {
    children: React.ReactNode;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
    return (
        <BaseLayout
            sidebar={<StudentSidebar />}
            navbar={<Navbar showNotifications={true} />}
            footer={<Footer />}
        >
            {children}
        </BaseLayout>
    );
};
