"use client";

import React from "react";
import { BaseLayout } from "@/features/shared/components/BaseLayout";
import { CompetitionAdvisorSidebar } from "./CompetitionAdvisorSidebar";
import { Navbar } from "@/features/shared/components/Navbar";
import { Footer } from "@/features/shared/components/Footer";

interface CompetitionAdvisorLayoutProps {
  children: React.ReactNode;
}

export const CompetitionAdvisorLayout: React.FC<CompetitionAdvisorLayoutProps> = ({
  children,
}) => {
  return (
    <BaseLayout
      sidebar={<CompetitionAdvisorSidebar />}
      navbar={<Navbar title="SIMAP" showNotifications={true} />}
      footer={<Footer />}
    >
      {children}
    </BaseLayout>
  );
};
