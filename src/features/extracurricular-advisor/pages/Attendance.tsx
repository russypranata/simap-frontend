"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Users, RefreshCw, History, TrendingUp, Calendar, ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PageHeader, StatCard, SkeletonPageHeader, SkeletonStatCard, SkeletonTableRow, ErrorState } from "@/features/shared/components";
import { useAdvisorAttendance } from "../hooks/useAdvisorAttendance";
import { AttendanceForm, AttendanceTable, AttendanceHistoryTab } from "../components/attendance";

const AttendanceSkeleton: React.FC = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <SkeletonPageHeader withAction />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
        {/* Tabs skeleton */}
        <div className="flex gap-1 p-1.5 bg-muted/50 rounded-full w-fit">
            <Skeleton className="h-9 w-32 rounded-full" />
            <Skeleton className="h-9 w-36 rounded-full" />
        </div>
        {/* Form card skeleton */}
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-56" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Skeleton className="h-11 w-full" />
                        <Skeleton className="h-11 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-11 w-full" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-11 w-full" />
                            <Skeleton className="h-11 w-full" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
        {/* Table card skeleton */}
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-44" />
                        </div>
                    </div>
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="px-6 py-4 border-b flex gap-3">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-44" />
                </div>
                <table className="w-full">
                    <tbody>
                        {Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} cols={6} />)}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    </div>
);

export const ExtracurricularAttendance: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        members, history, tutorName, extracurricularName, isLoading, isHistoryLoading, isRefreshing,
        selectedDate, setSelectedDate, startTime, setStartTime, endTime, setEndTime,
        topic, setTopic,
        attendanceRecords, handleStatusChange, handleMarkAllPresent, handleSaveAttendance,
        searchTerm, setSearchTerm, statusFilter, setStatusFilter,
        currentPage, setCurrentPage, itemsPerPage, setItemsPerPage,
        filteredMembers, paginatedMembers, totalPages, presentCount, currentSessionPercentage,
        activeTab, setActiveTab,
        historySearchTerm, setHistorySearchTerm, historyDateRange, setHistoryDateRange,
        activeDateFilter, setActiveDateFilter,
        historyPage, setHistoryPage, historyItemsPerPage, setHistoryItemsPerPage,
        filteredHistory, paginatedHistory, totalHistoryPages,
        setToday, setThisWeek, setThisMonth,
        latestPresent, overallAveragePercentage, attendanceColor,
        handleRefresh, getStatusBadgeClass,
        error,
    } = useAdvisorAttendance();

    if (isLoading) return <AttendanceSkeleton />;
    if (error) return <ErrorState error={error} onRetry={handleRefresh} />;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Presensi"
                titleHighlight="Ekstrakurikuler"
                icon={ClipboardCheck}
                description="Kelola presensi dan kegiatan ekstrakurikuler pada Tahun Ajaran aktif"
            >
                <Button onClick={handleRefresh} disabled={isRefreshing} className="bg-blue-800 text-white hover:bg-blue-900">
                    <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                    Refresh
                </Button>
            </PageHeader>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard title="Total Anggota" value={members.length} subtitle="Anggota aktif" icon={Users} color="blue" />
                <StatCard title="Hadir Terakhir" value={latestPresent} subtitle="Pertemuan lalu" icon={CheckCircle} color="green" />
                <StatCard title="Rata-rata Kehadiran" value={`${overallAveragePercentage}%`} subtitle="Tahun ajaran ini" icon={TrendingUp} color={attendanceColor} />
                <StatCard title="Total Pertemuan" value={history.length} subtitle="Kegiatan tercatat" icon={Calendar} color="purple" />
            </div>

            <Tabs
                value={activeTab}
                onValueChange={(value) => {
                    setActiveTab(value);
                    const newParams = new URLSearchParams(searchParams.toString());
                    newParams.set("tab", value);
                    router.push(`?${newParams.toString()}`, { scroll: false });
                }}
                className="space-y-6"
            >
                <TabsList className="inline-flex h-auto items-center justify-center rounded-full bg-muted/50 p-1.5 gap-1">
                    <TabsTrigger value="attendance" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 h-9 py-2 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Isi Presensi
                    </TabsTrigger>
                    <TabsTrigger value="history" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 h-9 py-2 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                        <History className="h-4 w-4 mr-2" />
                        Riwayat Presensi
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="attendance" className="space-y-6">
                    <AttendanceForm
                        tutorName={tutorName}
                        extracurricularName={extracurricularName}
                        selectedDate={selectedDate}
                        startTime={startTime}
                        endTime={endTime}
                        topic={topic}
                        onDateChange={setSelectedDate}
                        onStartTimeChange={setStartTime}
                        onEndTimeChange={setEndTime}
                        onTopicChange={setTopic}
                    />
                    <AttendanceTable
                        members={members}
                        paginatedMembers={paginatedMembers}
                        filteredMembers={filteredMembers}
                        attendanceRecords={attendanceRecords}
                        isLoading={false}
                        presentCount={presentCount}
                        currentSessionPercentage={currentSessionPercentage}
                        searchTerm={searchTerm}
                        statusFilter={statusFilter}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        onSearchChange={setSearchTerm}
                        onStatusFilterChange={setStatusFilter}
                        onStatusChange={handleStatusChange}
                        onMarkAllPresent={handleMarkAllPresent}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                        onSave={handleSaveAttendance}
                        getStatusBadgeClass={getStatusBadgeClass}
                    />
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                    <AttendanceHistoryTab
                        isHistoryLoading={isHistoryLoading}
                        filteredHistory={filteredHistory}
                        paginatedHistory={paginatedHistory}
                        historySearchTerm={historySearchTerm}
                        historyDateRange={historyDateRange}
                        activeDateFilter={activeDateFilter}
                        historyPage={historyPage}
                        historyItemsPerPage={historyItemsPerPage}
                        totalHistoryPages={totalHistoryPages}
                        onSearchChange={setHistorySearchTerm}
                        onDateRangeChange={setHistoryDateRange}
                        onActiveDateFilterChange={setActiveDateFilter}
                        onPageChange={setHistoryPage}
                        onItemsPerPageChange={setHistoryItemsPerPage}
                        onViewDetail={(id) => router.push(`/extracurricular-advisor/attendance/${id}?tab=${activeTab}`)}
                        onSetToday={setToday}
                        onSetThisWeek={setThisWeek}
                        onSetThisMonth={setThisMonth}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};
