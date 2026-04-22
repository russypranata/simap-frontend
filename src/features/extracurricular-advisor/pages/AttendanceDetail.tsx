"use client";

import React from "react";
import { useParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { PageHeader, ErrorState } from "@/features/shared/components";
import { AttendanceDetailSkeleton } from "../components/AdvisorSkeletons";
import { AttendanceInfoCard, AttendanceStudentTable } from "../components/attendance";
import { useAdvisorAttendanceDetail } from "../hooks/useAdvisorAttendanceDetail";

export const AttendanceDetailPage: React.FC = () => {
    const params = useParams();
    const id = Number(params.id);

    const {
        detail, stats, isLoading, isError, refetch,
        extracurricularName,
        searchTerm, setSearchTerm,
        statusFilter, setStatusFilter,
        classFilter, setClassFilter,
        uniqueClasses,
        currentPage, setCurrentPage, itemsPerPage,
        filteredStudents, paginatedStudents, totalPages,
    } = useAdvisorAttendanceDetail(id);

    if (isLoading) return <AttendanceDetailSkeleton />;
    if (isError || !detail) return (
        <ErrorState
            error="Detail presensi tidak dapat ditemukan atau gagal dimuat."
            onRetry={refetch}
        />
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Detail Riwayat"
                titleHighlight="Presensi"
                icon={CheckCircle}
                description="Rincian lengkap data kehadiran siswa pada pertemuan ekstrakurikuler"
            />

            <AttendanceInfoCard detail={detail} stats={stats} extracurricularName={extracurricularName} />

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
