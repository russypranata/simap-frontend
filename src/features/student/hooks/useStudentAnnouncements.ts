"use client";

import { useState, useMemo, useEffect } from "react";
import { getStudentAnnouncements, type Announcement } from "../services/studentAnnouncementsService";

const ITEMS_PER_PAGE = 5;

export const useStudentAnnouncements = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        getStudentAnnouncements().then(setAnnouncements);
    }, []);

    const filteredAnnouncements = useMemo(() => {
        return announcements.filter((announcement) => {
            const matchesSearch =
                announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === "all" || announcement.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [announcements, searchQuery, categoryFilter]);

    const sortedAnnouncements = useMemo(() => {
        return [...filteredAnnouncements].sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    }, [filteredAnnouncements]);

    const totalPages = Math.ceil(sortedAnnouncements.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedAnnouncements = sortedAnnouncements.slice(startIndex, endIndex);

    const unreadCount = announcements.filter(a => !a.isRead).length;

    const handleViewDetail = (announcement: Announcement) => {
        if (!announcement.isRead) {
            setAnnouncements(prev => prev.map(a =>
                a.id === announcement.id ? { ...a, isRead: true } : a
            ));
        }
        setSelectedAnnouncement(announcement);
        setIsDialogOpen(true);
    };

    return {
        announcements,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        currentPage,
        setCurrentPage,
        selectedAnnouncement,
        setSelectedAnnouncement,
        isDialogOpen,
        setIsDialogOpen,
        filteredAnnouncements,
        sortedAnnouncements,
        paginatedAnnouncements,
        totalPages,
        startIndex,
        endIndex,
        unreadCount,
        handleViewDetail,
        ITEMS_PER_PAGE,
    };
};
