 
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiSelectOption {
    value: string;
    label: string;
}

interface MultiSelectDropdownProps {
    options: MultiSelectOption[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    className?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
    options,
    selected,
    onChange,
    placeholder = 'Pilih',
    className,
}) => {
    const [open, setOpen] = useState(false);

    const allSelected = selected.length === options.length && options.length > 0;
    const noneSelected = selected.length === 0;

    const handleToggleAll = () => {
        if (allSelected) {
            onChange([]);
        } else {
            onChange(options.map(opt => opt.value));
        }
    };

    const handleToggleOption = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter(v => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const handleClearAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange([]);
    };

    const getDisplayText = () => {
        if (noneSelected) {
            return placeholder;
        }
        if (allSelected) {
            return `Semua (${options.length})`;
        }
        if (selected.length === 1) {
            const option = options.find(opt => opt.value === selected[0]);
            return option?.label || placeholder;
        }
        if (selected.length === 2) {
            const labels = selected.map(val => {
                const opt = options.find(o => o.value === val);
                return opt?.label || val;
            });
            return labels.join(', ');
        }
        return `${selected.length} dipilih`;
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        'w-full justify-between font-normal',
                        noneSelected && 'text-muted-foreground',
                        className
                    )}
                >
                    <span className="truncate">{getDisplayText()}</span>
                    <div className="flex items-center gap-1">
                        {!noneSelected && !allSelected && (
                            <X
                                className="h-4 w-4 opacity-50 hover:opacity-100"
                                onClick={handleClearAll}
                            />
                        )}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <div className="max-h-64 overflow-y-auto p-2">
                    {/* Select All Option */}
                    <div className="flex items-center space-x-2 px-2 py-2 hover:bg-accent rounded-sm cursor-pointer">
                        <Checkbox
                            id="select-all"
                            checked={allSelected}
                            onCheckedChange={handleToggleAll}
                        />
                        <label
                            htmlFor="select-all"
                            className="text-sm font-medium cursor-pointer flex-1"
                        >
                            Semua
                        </label>
                    </div>

                    <div className="border-t my-1" />

                    {/* Individual Options */}
                    {options.map((option) => {
                        const isSelected = selected.includes(option.value);
                        return (
                            <div
                                key={option.value}
                                className="flex items-center space-x-2 px-2 py-2 hover:bg-accent rounded-sm cursor-pointer"
                            >
                                <Checkbox
                                    id={`option-${option.value}`}
                                    checked={isSelected}
                                    onCheckedChange={() => handleToggleOption(option.value)}
                                />
                                <label
                                    htmlFor={`option-${option.value}`}
                                    className="text-sm cursor-pointer flex-1"
                                >
                                    {option.label}
                                </label>
                            </div>
                        );
                    })}

                    {options.length === 0 && (
                        <div className="text-sm text-muted-foreground text-center py-4">
                            Tidak ada opsi tersedia
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};
