import { Student } from '../types/student';
import { MOCK_STUDENTS } from '../data/mockStudentData';
import { PromotionPayload } from '../types/promotion';

const USE_MOCK_DATA = true;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const studentService = {
    // GET all students
    getStudents: async (): Promise<Student[]> => {
        if (USE_MOCK_DATA) {
            await delay(500);
            return [...MOCK_STUDENTS];
        }
        return [];
    },

    // GET students by class ID
    getStudentsByClass: async (classId: string): Promise<Student[]> => {
        if (USE_MOCK_DATA) {
            await delay(500);
            return MOCK_STUDENTS.filter(s => s.classId === classId);
        }
        return [];
    },

    // PROMOTIONS
    promoteStudents: async (payload: PromotionPayload): Promise<void> => {
        if (USE_MOCK_DATA) {
            await delay(1500); // Simulate heavy processing
            console.log('[Mock] Promoting students:', payload);
            
            // In a real mock mutation, we would update MOCK_STUDENTS here
            payload.promotions.forEach(p => {
                const student = MOCK_STUDENTS.find(s => s.id === p.studentId);
                if (student) {
                    if (p.action === 'PROMOTE' || p.action === 'STAY') {
                        student.classId = p.targetClassId;
                        student.updatedAt = new Date().toISOString();
                    } else if (p.action === 'GRADUATE') {
                        student.status = 'graduated';
                        student.classId = undefined;
                        student.updatedAt = new Date().toISOString();
                    }
                }
            });
            return;
        }
        throw new Error('API not implemented');
    }
};

export default studentService;
