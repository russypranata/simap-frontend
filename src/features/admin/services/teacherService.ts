import { Teacher } from '../types/teacher';
import { MOCK_TEACHERS } from '../data/mockTeacherData';

const SIMULATED_DELAY = 500;

export const teacherService = {
    getTeachers: async (): Promise<Teacher[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_TEACHERS);
            }, SIMULATED_DELAY);
        });
    },

    getTeacherById: async (id: string): Promise<Teacher | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_TEACHERS.find(t => t.id === id));
            }, SIMULATED_DELAY);
        });
    }
};
