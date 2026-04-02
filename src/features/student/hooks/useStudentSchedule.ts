"use client";

import { useState, useMemo, useEffect } from "react";
import { getStudentSchedule, getSubjectColor, type ScheduleItem } from "../services/studentScheduleService";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export const useStudentSchedule = () => {
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [selectedDay, setSelectedDay] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"daily" | "weekly">("weekly");

    useEffect(() => {
        getStudentSchedule().then(setSchedule);
    }, []);

    const today = new Date();
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const currentDay = dayNames[today.getDay()];

    const filteredSchedule = useMemo(() => {
        if (selectedDay === "all") return schedule;
        return schedule.filter((item) => item.day === selectedDay);
    }, [schedule, selectedDay]);

    const todaySchedule = useMemo(() => {
        return schedule.filter((item) => item.day === currentDay);
    }, [schedule, currentDay]);

    const scheduleByDay = useMemo(() => {
        const grouped: Record<string, ScheduleItem[]> = {};
        DAYS.forEach((day) => {
            grouped[day] = schedule.filter((item) => item.day === day);
        });
        return grouped;
    }, [schedule]);

    const totalLessons = schedule.length;
    const uniqueSubjects = new Set(schedule.map((s) => s.subject)).size;

    return {
        schedule,
        selectedDay,
        setSelectedDay,
        viewMode,
        setViewMode,
        today,
        currentDay,
        filteredSchedule,
        todaySchedule,
        scheduleByDay,
        totalLessons,
        uniqueSubjects,
        getSubjectColor,
        DAYS,
    };
};
