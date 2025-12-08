import React from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, CalendarDays, FileText, BarChart3, Clock, Trophy, CheckCircle, XCircle } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface StudentExtracurricularDetailProps {
    student: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    periodFilter: string;
    onPeriodFilterChange: (value: string) => void;
}

export const StudentExtracurricularDetail = ({
    student,
    open,
    onOpenChange,
    periodFilter,
    onPeriodFilterChange
}: StudentExtracurricularDetailProps) => {
    if (!student) return null;

    // Mock history data generator
    const generateEskulHistory = (eskulName: string) => {
        return Array.from({ length: 5 }).map((_, i) => ({
            id: i,
            date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
            status: Math.random() > 0.1 ? "Hadir" : "Tidak Hadir",
            notes: Math.random() > 0.9 ? "Latihan fisik" : "Materi rutin",
            coach: "Coach Budi"
        }));
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl p-0 h-screen max-h-screen z-[100] flex flex-col">
                <div className="flex flex-col flex-shrink-0 bg-background border-b shadow-sm z-10 p-6 pb-2">
                    <SheetHeader className="mb-6 text-left">
                        <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16 border-2 border-border/50 shadow-md">
                                <AvatarImage src={student.foto} />
                                <AvatarFallback className="text-xl bg-primary/5 text-primary">
                                    {student.name ? student.name.substring(0, 2).toUpperCase() : "SISWA"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1.5 pt-1">
                                <SheetTitle className="text-xl font-bold leading-none">{student.name}</SheetTitle>
                                <SheetDescription className="text-sm font-medium text-foreground/80">
                                    {student.class || "XII A"}
                                </SheetDescription>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs bg-muted/50 px-2 py-0.5 rounded text-muted-foreground border">
                                        {student.nis}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </SheetHeader>

                    {/* Filter is less relevant for Eskul structure usually, but keeping for consistency or it could filter the history inside accordions */}
                    <Tabs value={periodFilter} onValueChange={onPeriodFilterChange} className="w-full">
                        <TabsList className="bg-transparent p-0 h-auto gap-3 justify-start flex-wrap w-full overflow-x-auto pb-2">
                            <TabsTrigger value="harian" className="rounded-full border border-muted-foreground/30 px-3 py-1.5 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-sm hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2">
                                <CalendarIcon className="h-3.5 w-3.5" /> Harian
                            </TabsTrigger>
                            <TabsTrigger value="mingguan" className="rounded-full border border-muted-foreground/30 px-3 py-1.5 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-sm hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2">
                                <CalendarDays className="h-3.5 w-3.5" /> Mingguan
                            </TabsTrigger>
                            <TabsTrigger value="bulanan" className="rounded-full border border-muted-foreground/30 px-3 py-1.5 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-sm hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2">
                                <FileText className="h-3.5 w-3.5" /> Bulanan
                            </TabsTrigger>
                            <TabsTrigger value="semester" className="rounded-full border border-muted-foreground/30 px-3 py-1.5 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-sm hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2">
                                <BarChart3 className="h-3.5 w-3.5" /> Semester
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <ScrollArea className="flex-1 w-full bg-muted/5 p-6 pb-24 h-[calc(100vh-200px)]">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold flex items-center gap-2 text-sm text-foreground/80">
                                    <Trophy className="h-4 w-4" />
                                    Ekstrakurikuler yang Diikuti
                                </h4>
                                <Badge variant="secondary">{student.activeEskuls.length} Aktivitas</Badge>
                            </div>

                            <Accordion type="multiple" className="w-full space-y-3" defaultValue={student.activeEskuls.map((e: any) => e.name)}>
                                {student.activeEskuls.map((eskul: any, index: number) => (
                                    <AccordionItem key={index} value={eskul.name} className="bg-card rounded-xl border shadow-sm px-4">
                                        <AccordionTrigger className="hover:no-underline py-4">
                                            <div className="flex items-center gap-4 w-full text-left">
                                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    <Trophy className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-base">{eskul.name}</div>
                                                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                                                        <span>{eskul.schedule || "Jadwal Belum Diatur"}</span>
                                                        <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                                        <span className={cn(
                                                            "font-medium",
                                                            parseInt(eskul.attendance) > 80 ? "text-emerald-600" : "text-amber-600"
                                                        )}>
                                                            Kehadiran {eskul.attendance}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-4 pt-0">
                                            <div className="pl-[3.5rem] space-y-3">
                                                <div className="border-t pb-2" />
                                                <div className="space-y-2">
                                                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Riwayat Pertemuan</h5>
                                                    <div className="space-y-2">
                                                        {generateEskulHistory(eskul.name).map((history) => (
                                                            <div key={history.id} className="flex items-center justify-between text-sm py-1">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={cn(
                                                                        "w-2 h-2 rounded-full",
                                                                        history.status === "Hadir" ? "bg-emerald-500" : "bg-red-500"
                                                                    )} />
                                                                    <span className="font-medium text-foreground">{history.date}</span>
                                                                </div>
                                                                <Badge variant="outline" className={cn(
                                                                    "text-xs font-normal border-0",
                                                                    history.status === "Hadir" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                                                                )}>
                                                                    {history.status}
                                                                </Badge>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};
