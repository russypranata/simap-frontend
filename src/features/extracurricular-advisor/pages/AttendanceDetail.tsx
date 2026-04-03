"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";
import { PageHeader } from "@/features/shared/components";
import { AttendanceDetailSkeleton } from "../components/AdvisorSkeletons";
import { AttendanceInfoCard, AttendanceStudentTable } from "../components/attendance";
import { useAdvisorAttendanceDetail } from "../hooks/useAdvisorAttendanceDetail";

export const AttendanceDetailPage: React.FC = () => {
    const params = useParams();
    const id = Number(params.id);

    const {
        detail, stats, isLoading,
        searchTerm, setSearchTerm,
        statusFilter, setStatusFilter,
        classFilter, setClassFilter,
        uniqueClasses,
        currentPage, setCurrentPage, itemsPerPage,
        filteredStudents, paginatedStudents, totalPages,
    } = useAdvisorAttendanceDetail(id);

    if (isLoading) return <AttendanceDetailSkeleton />;

    if (!detail) return (
        <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-lg font-semibold">Data Tidak Ditemukan</h2>
            <p className="text-muted-foreground">Detail presensi tidak dapat ditemukan.</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Coba Lagi</Button>
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Detail Riwayat"
                titleHighlight="Presensi"
                icon={CheckCircle}
                description="Rincian lengkap data kehadiran siswa pada pertemuan ekstrakurikuler"
            />

            <AttendanceInfoCard detail={detail} stats={stats} />

            <AttendanceStudentTable
                paginatedStudents={paginatedStudents}
                filteredStudents={filteredStudents}
                uniqueClasses={uniqueClasses}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                classFilter={classFilter}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onSearchChange={setSearchTerm}
                onStatusFilterChange={setStatusFilter}
                onClassFilterChange={setClassFilter}
                onPageChange={setCurrentPage}
                onResetFilters={() => { setSearchTerm(""); setStatusFilter("all"); setClassFilter("all"); }}
            />
        </div>
    );
};
