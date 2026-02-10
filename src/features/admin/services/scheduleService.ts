import { Schedule } from '../types/schedule';
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
    }
};
