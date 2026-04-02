"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    startIndex: number;
    endIndex: number;
    itemsPerPage: number;
    itemLabel?: string;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (value: number) => void;
    itemsPerPageOptions?: number[];
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    itemsPerPage,
    itemLabel = "entri",
    onPageChange,
    onItemsPerPageChange,
    itemsPerPageOptions = [5, 10, 20, 50],
}) => {
    if (totalItems === 0) return null;

    return (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm text-muted-foreground w-full lg:w-auto justify-center lg:justify-start">
                <span>Menampilkan</span>
                <span className="font-medium text-foreground">{startIndex}</span>
                <span>-</span>
                <span className="font-medium text-foreground">{endIndex}</span>
                <span>dari</span>
                <span className="font-medium text-foreground">{totalItems}</span>
                <span>{itemLabel}</span>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">
                <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(val) => onItemsPerPageChange(Number(val))}
                >
                    <SelectTrigger className="w-[100px] h-8">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {itemsPerPageOptions.map((opt) => (
                            <SelectItem key={opt} value={opt.toString()}>
                                {opt} / hal
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <span className="text-sm text-muted-foreground">
                    Hal {currentPage}/{totalPages}
                </span>

                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNumber = i + 1;
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => onPageChange(pageNumber)}
                                className={cn(
                                    "w-8 h-8 p-0 rounded-lg font-medium text-sm transition-colors flex items-center justify-center",
                                    currentPage === pageNumber
                                        ? "bg-blue-800 text-white"
                                        : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
                                )}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}
                    {totalPages > 5 && (
                        <>
                            <span className="text-sm text-muted-foreground px-1">...</span>
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className={cn(
                                    "w-8 h-8 p-0 rounded-lg font-medium text-sm transition-colors flex items-center justify-center border border-slate-300 bg-white text-slate-600 hover:bg-slate-100",
                                    currentPage === totalPages && "bg-blue-800 text-white"
                                )}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                </div>

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};
