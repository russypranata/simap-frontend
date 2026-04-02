"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Users,
    Activity,
    AlertCircle,
    CheckCircle,
    FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/features/shared/utils/dateFormatter";
import { EmptyState } from "@/features/shared/components";
import { type AdvisorMember } from "../../services/advisorMembersService";

interface MemberDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member: AdvisorMember | null;
    isLoading: boolean;
}

export const MemberDetailDialog: React.FC<MemberDetailDialogProps> = ({
    open,
    onOpenChange,
    member,
    isLoading,
}) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
            <DialogHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <DialogTitle>Detail Anggota</DialogTitle>
                        <DialogDescription>Informasi lengkap anggota ekstrakurikuler</DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            {isLoading ? (
                <div className="space-y-4 p-2">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-14 w-14 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                </div>
            ) : member ? (
                <div className="space-y-4">
                    {/* Profile Header */}
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-primary">{member.name.charAt(0)}</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                NIS: <span className="font-mono">{member.nis}</span>
                            </p>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Kelas</p>
                            <Badge className="bg-blue-50 text-blue-800 border-blue-200">{member.class}</Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Ekstrakurikuler</p>
                            <Badge className="bg-blue-50 text-blue-800 border-blue-200">Pramuka</Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Tanggal Bergabung</p>
                            <p className="text-sm font-medium">
                                {formatDate(new Date(member.joinDate), "dd MMMM yyyy")}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Kehadiran</p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold">{member.attendance}%</span>
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full",
                                            member.attendance >= 90
                                                ? "bg-emerald-500"
                                                : member.attendance >= 75
                                                ? "bg-amber-500"
                                                : "bg-red-500"
                                        )}
                                        style={{ width: `${member.attendance}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attendance Detail */}
                    <div>
                        <p className="text-xs text-muted-foreground mb-2">Detail Kehadiran</p>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                {
                                    label: "Hadir",
                                    icon: CheckCircle,
                                    color: "green",
                                    value: Math.round((member.attendance / 100) * 14),
                                },
                                {
                                    label: "Alpa",
                                    icon: AlertCircle,
                                    color: "red",
                                    value: 14 - Math.round((member.attendance / 100) * 14),
                                },
                                { label: "Izin", icon: FileText, color: "blue", value: 0 },
                                { label: "Sakit", icon: Activity, color: "orange", value: 0 },
                            ].map(({ label, icon: Icon, color, value }) => (
                                <div
                                    key={label}
                                    className={`flex items-center justify-between p-2 bg-${color}-50 border border-${color}-100 rounded-md`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon className={`h-3.5 w-3.5 text-${color}-600`} />
                                        <span className={`text-xs font-medium text-${color}-700`}>{label}</span>
                                    </div>
                                    <span className={`text-sm font-bold text-${color}-800`}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <EmptyState icon={Users} title="Data tidak ditemukan" />
            )}

            <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Tutup
                </Button>
            </div>
        </DialogContent>
    </Dialog>
);
