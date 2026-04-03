"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { PageHeader } from "@/features/shared/components";
import { ProfileSkeleton } from "../components/profile";
import { ProfileInfoCard } from "../components/profile/ProfileInfoCard";
import { ProfileStatsCard } from "../components/profile/ProfileStatsCard";
import { useAdvisorProfile } from "../hooks/useAdvisorProfile";

export const ExtracurricularAdvisorProfile: React.FC = () => {
    const router = useRouter();
    const { profile, stats, isLoading } = useAdvisorProfile();

    if (isLoading || !profile) return <ProfileSkeleton />;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Profil"
                titleHighlight="Saya"
                icon={User}
                description="Kelola informasi profil dan pengaturan akun Anda"
            />

            <ProfileInfoCard
                profile={profile}
                onEditProfile={() => router.push("/extracurricular-advisor/profile/edit")}
            />

            <ProfileStatsCard stats={stats} />
        </div>
    );
};
