"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { User, RefreshCw } from "lucide-react";
import { PageHeader } from "@/features/shared/components";
import { ProfileSkeleton } from "../components/profile";
import { ProfileInfoCard } from "../components/profile/ProfileInfoCard";
import { ProfileStatsCard } from "../components/profile/ProfileStatsCard";
import { useAdvisorProfile } from "../hooks/useAdvisorProfile";

export const ExtracurricularAdvisorProfile: React.FC = () => {
    const router = useRouter();
    const { profile, stats, isLoading, isFetching } = useAdvisorProfile();

    if (isLoading || !profile) return <ProfileSkeleton />;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Profil"
                titleHighlight="Saya"
                icon={User}
                description="Kelola informasi profil dan pengaturan akun Anda"
            >
                {isFetching && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        Memperbarui...
                    </div>
                )}
            </PageHeader>

            <ProfileInfoCard
                profile={profile}
                onEditProfile={() => router.push("/extracurricular-advisor/profile/edit")}
            />

            <ProfileStatsCard stats={stats} />
        </div>
    );
};
