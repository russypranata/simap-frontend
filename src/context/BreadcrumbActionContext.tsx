"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface BreadcrumbActionContextType {
    action: React.ReactNode;
    setAction: (node: React.ReactNode) => void;
    clearAction: () => void;
}

const BreadcrumbActionContext = createContext<BreadcrumbActionContextType>({
    action: null,
    setAction: () => {},
    clearAction: () => {},
});

export const BreadcrumbActionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [action, setActionState] = useState<React.ReactNode>(null);

    const setAction = useCallback((node: React.ReactNode) => setActionState(node), []);
    const clearAction = useCallback(() => setActionState(null), []);

    return (
        <BreadcrumbActionContext.Provider value={{ action, setAction, clearAction }}>
            {children}
        </BreadcrumbActionContext.Provider>
    );
};

export const useBreadcrumbAction = () => useContext(BreadcrumbActionContext);
