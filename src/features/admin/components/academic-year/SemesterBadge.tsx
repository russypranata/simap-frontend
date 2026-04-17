'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SemesterBadgeProps {
    name: string;
    isActive?: boolean;
    className?: string;
}

export const SemesterBadge: React.FC<SemesterBadgeProps> = ({
    name,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isActive: _isActive = false,
    className,
}) => {
    const isGanjil = name === 'Ganjil' || name === '1';

    return (
        <Badge
            variant="secondary"
            className={cn(
                'font-medium',
                'bg-blue-100 text-blue-800 border-blue-200',
                className
            )}
        >
            {isGanjil ? 'Ganjil' : 'Genap'}
        </Badge>
    );
};

interface StatusBadgeProps {
    isActive: boolean;
    className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    isActive,
    className,
}) => {
    return (
        <Badge
            variant={isActive ? 'default' : 'outline'}
            className={cn(
                'font-medium text-xs px-2.5 py-0.5',
                isActive
                    ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-50',
                className
            )}
        >
            {isActive ? 'Aktif' : 'Tidak Aktif'}
        </Badge>
    );
};
