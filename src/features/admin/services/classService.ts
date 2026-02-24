import { Class, CreateClassRequest, UpdateClassRequest, Teacher } from '../types/class';
import { MOCK_CLASSES, MOCK_TEACHERS } from '../data/mockClassData';

const USE_MOCK_DATA = true;

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const classService = {
    // GET all classes
    getClasses: async (): Promise<Class[]> => {
        if (USE_MOCK_DATA) {
            await delay(500);
            return [...MOCK_CLASSES];
        }
        return [];
    },

    // GET class by ID
    getClassById: async (id: string): Promise<Class | undefined> => {
        if (USE_MOCK_DATA) {
            await delay(300);
            return MOCK_CLASSES.find((c) => c.id === id);
        }
        return undefined;
    },

    // GET all teachers (for dropdown)
    getTeachers: async (): Promise<Teacher[]> => {
        if (USE_MOCK_DATA) {
            await delay(300);
            return [...MOCK_TEACHERS];
        }
        return [];
    },

    // CREATE class
    createClass: async (data: CreateClassRequest): Promise<Class> => {
        if (USE_MOCK_DATA) {
            await delay(800);
            const teacher = MOCK_TEACHERS.find(t => t.id === data.homeroomTeacherId);
            
            const newClass: Class = {
                id: `c-${Date.now()}`,
                ...data,
                homeroomTeacherName: teacher?.name,
                totalStudents: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            MOCK_CLASSES.push(newClass);
            return newClass;
        }
        throw new Error('API not implemented');
    },

    // UPDATE class
    updateClass: async (id: string, data: UpdateClassRequest): Promise<Class> => {
        if (USE_MOCK_DATA) {
            await delay(800);
            const index = MOCK_CLASSES.findIndex((c) => c.id === id);
            if (index === -1) throw new Error('Class not found');

            const teacher = data.homeroomTeacherId 
                ? MOCK_TEACHERS.find(t => t.id === data.homeroomTeacherId)
                : undefined;

            const updatedClass = {
                ...MOCK_CLASSES[index],
                ...data,
                homeroomTeacherName: teacher ? teacher.name : MOCK_CLASSES[index].homeroomTeacherName,
                updatedAt: new Date().toISOString(),
            };

            MOCK_CLASSES[index] = updatedClass;
            return updatedClass;
        }
        throw new Error('API not implemented');
    },

    // DELETE class
    deleteClass: async (id: string): Promise<void> => {
        if (USE_MOCK_DATA) {
            await delay(800);
            const index = MOCK_CLASSES.findIndex((c) => c.id === id);
            if (index !== -1) {
                MOCK_CLASSES.splice(index, 1);
            }
        }
    },
};
