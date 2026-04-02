"use client";

import { useState, useMemo, useEffect } from "react";
import { getStudentAchievements, type Achievement } from "../services/studentAchievementsService";

const ITEMS_PER_PAGE = 5;

export const useStudentAchievements = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [levelFilter, setLevelFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getStudentAchievements().then(setAchievements);
    }, []);

    const filteredAchievements = useMemo(() => {
        return achievements.filter((achievement) => {
            const matchesSearch =
                achievement.competitionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                achievement.eventName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLevel = levelFilter === "all" || achievement.level === levelFilter;
            return matchesSearch && matchesLevel;
        });
    }, [achievements, searchQuery, levelFilter]);

    const totalPages = Math.ceil(filteredAchievements.length / ITEMS_PER_PAGE);
    const paginatedAchievements = filteredAchievements.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalAchievements = achievements.length;
    const nationalAchievements = achievements.filter((a) => a.level === "Nasional" || a.level === "Internasional").length;
    const firstPlaceCount = achievements.filter((a) => a.rank === "Juara 1").length;

    return {
        achievements,
        searchQuery,
        setSearchQuery,
        levelFilter,
        setLevelFilter,
        currentPage,
        setCurrentPage,
        filteredAchievements,
        paginatedAchievements,
        totalPages,
        totalAchievements,
        nationalAchievements,
        firstPlaceCount,
        ITEMS_PER_PAGE,
    };
};
