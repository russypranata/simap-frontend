"use client";

import React from "react";
import { Users, CheckCircle, Activity, AlertCircle } from "lucide-react";
import { PageHeader, StatCard, SkeletonPageHeader, SkeletonStatCard, SkeletonTableRow, ErrorState } from "@/features/shared/components";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAdvisorMembers } from "../hooks/useAdvisorMembers";
import { MembersTable, MemberDetailDialog } from "../components/members";

// ==================== SKELETON ====================
const MembersSkeleton: React.FC = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <SkeletonPageHeader />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
        <Card>
            <CardHeader>
                <div className="h-5 w-48 bg-slate-100 rounded" />
            </CardHeader>
            <CardContent className="p-0">
                <div className="p-4 border-b">
                    <div className="h-10 w-full bg-slate-100 rounded" />
                </div>
                <table className="w-full">
                    <tbody>
                        {Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} cols={7} />)}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    </div>
);

// ==================== MAIN ====================
export const ExtracurricularMembers: React.FC = () => {
    const {
        members, stats, isLoading, error,
        currentPage, setCurrentPage, totalPages, totalItems, itemsPerPage, setItemsPerPage,
        startIndex, endIndex,
        searchQuery, setSearchQuery, classFilter, setClassFilter,
        isDetailDialogOpen, setIsDetailDialogOpen, selectedMember, isDetailLoading, handleViewDetail,
    } = useAdvisorMembers();

    if (isLoading && members.length === 0) return <MembersSkeleton />;
    if (error) return <ErrorState error={error} onRetry={() => window.location.reload()} />;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Anggota"
                titleHighlight="Ekstrakurikuler"
                icon={Users}
                description="Menampilkan anggota ekstrakurikuler pada Tahun Ajaran aktif"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
                ) : (
                    <>
                        <StatCard title="Total Anggota" value={stats.totalMembers || totalItems} subtitle="Anggota aktif" icon={Users} color="blue" />
                        <StatCard title="Siswa Rajin" value={stats.topPerformers} subtitle="Kehadiran ≥ 90%" icon={CheckCircle} color="green" />
                        <StatCard title="Rata-rata Kehadiran" value={`${stats.avgAttendance}%`} subtitle="Tahun ajaran ini" icon={Activity} color="purple" />
                        <StatCard title="Perlu Perhatian" value={stats.needsAttention} subtitle="Kehadiran < 75%" icon={AlertCircle} color="red" />
                    </>
                )}
            </div>

            <MembersTable
                members={members}
                isLoading={isLoading}
                totalItems={totalItems}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                startIndex={startIndex}
                endIndex={endIndex}
                searchQuery={searchQuery}
                classFilter={classFilter}
                onSearchChange={setSearchQuery}
                onClassFilterChange={setClassFilter}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
                onViewDetail={handleViewDetail}
            />

            <MemberDetailDialog
                open={isDetailDialogOpen}
                onOpenChange={setIsDetailDialogOpen}
                member={selectedMember}
                isLoading={isDetailLoading}
            />
        </div>
    );
};
