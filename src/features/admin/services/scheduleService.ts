import { Schedule, DayOfWeek } from '../types/schedule';
import { MOCK_SCHEDULES } from '../data/mockScheduleData';

const SIMULATED_DELAY = 500;

// In-memory store for simulation
let schedules = [...MOCK_SCHEDULES];

export const scheduleService = {
    getSchedules: async (): Promise<Schedule[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...schedules]);
            }, SIMULATED_DELAY);
        });
    },

    createSchedule: async (schedule: Omit<Schedule, 'id'>): Promise<Schedule> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newSchedule = {
                    ...schedule,
                    id: `sch-${Date.now()}`,
                };
                schedules = [newSchedule, ...schedules];
                resolve(newSchedule);
            }, SIMULATED_DELAY);
        });
    },

    updateSchedule: async (id: string, updates: Partial<Schedule>): Promise<Schedule> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = schedules.findIndex(s => s.id === id);
                if (index === -1) {
                    reject(new Error('Schedule not found'));
                    return;
                }
                const updatedSchedule = { ...schedules[index], ...updates };
                schedules[index] = updatedSchedule;
                resolve(updatedSchedule);
            }, SIMULATED_DELAY);
        });
    },

    deleteSchedule: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                schedules = schedules.filter(s => s.id !== id);
                resolve();
            }, SIMULATED_DELAY);
        });
    },

    copyDaySchedule: async (sourceDay: string, targetDay: DayOfWeek): Promise<Schedule[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Get source schedules
                const sourceSchedules = schedules.filter(s => s.day === sourceDay);
                
                // Create copies with new IDs and target day
                const newSchedules = sourceSchedules.map(s => ({
                    ...s,
                    id: `sch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    day: targetDay
                }));

                // Append to store
                schedules = [...newSchedules, ...schedules];
                resolve(newSchedules);
            }, SIMULATED_DELAY);
        });
    },

    copyClassSchedule: async (sourceClassId: string, targetClassId: string, targetClassName: string): Promise<Schedule[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Get source schedules
                const sourceSchedules = schedules.filter(s => s.classId === sourceClassId);
                
                // Create copies with new IDs and target class
                const newSchedules = sourceSchedules.map(s => ({
                    ...s,
                    id: `sch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    classId: targetClassId,
                    className: targetClassName
                }));

                // Append to store
                schedules = [...newSchedules, ...schedules];
                resolve(newSchedules);
            }, SIMULATED_DELAY);
        });
    }
};
