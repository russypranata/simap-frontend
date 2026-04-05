"use client";

import React from "react";

interface PageHeaderProps {
    title: string;
    titleHighlight: string;
    icon: React.ElementType;
    description?: string;
    children?: React.ReactNode; // for right-side actions (filter, child selector, etc.)
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    titleHighlight,
    icon: Icon,
    description,
    children,
}) => (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                        {title}{" "}
                    </span>
                    <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                        {titleHighlight}
                    </span>
                    <span className="inline-flex items-center align-middle ml-3">
                        <span className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Icon className="h-5 w-5" />
                        </span>
                    </span>
                </h1>
            </div>
            {description && (
                <p className="text-muted-foreground mt-1">{description}</p>
            )}
        </div>
        {children && (
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 no-print w-full lg:w-auto mt-4 lg:mt-0 flex-wrap lg:flex-nowrap justify-end">
                {children}
            </div>
        )}
    </div>
);
