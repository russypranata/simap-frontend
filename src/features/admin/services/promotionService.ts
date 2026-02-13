import { Class } from '../types/class';
import { AcademicYear } from '../types/academicYear';
import { ClassMapping, PromotionPayload, StudentPromotion, PromotionStatus } from '../types/promotion';
import { MOCK_CLASSES } from '../data/mockClassData';

// Mock Academic Years
const MOCK_ACADEMIC_YEARS: AcademicYear[] = [
    {
        id: 'ay-2023-2024',
        name: '2023/2024',
        startDate: '2023-07-01',
        endDate: '2024-06-30',
        isActive: false,
        semesters: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'ay-2024-2025',
        name: '2024/2025',
        startDate: '2024-07-01',
        endDate: '2025-06-30',
        isActive: false,
        semesters: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'ay-2025-2026',
        name: '2025/2026',
        startDate: '2025-07-01',
        endDate: '2026-06-30',
        isActive: true, // Current
        semesters: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'ay-2026-2027',
        name: '2026/2027',
        startDate: '2026-07-01',
        endDate: '2027-06-30',
        isActive: false, // Future
        semesters: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// Helper to generate mock students
const generateMockStudents = (classId: string, className: string, count: number): StudentPromotion[] => {
    return Array.from({ length: count }).map((_, i) => ({
        studentId: `s-${classId}-${i + 1}`,
        studentName: `Siswa ${className} ${i + 1}`,
        nisn: `00${Math.floor(Math.random() * 100000000)}`,
        currentClassId: classId,
        currentClassName: className,
        action: 'PROMOTE', // Default
    }));
};

export const promotionService = {
    getAcademicYears: async (): Promise<AcademicYear[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_ACADEMIC_YEARS;
    },

    getClasses: async (academicYearId: string): Promise<Class[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_CLASSES.filter(c => c.academicYearId === academicYearId && c.type === 'REGULER');
    },

    autoMapClasses: async (sourceClasses: Class[], targetClasses: Class[]): Promise<ClassMapping[]> => {
        return sourceClasses.map(source => {
            let targetClassId: string | 'GRADUATE' | 'IGNORE' = 'IGNORE';
            let targetClassName: string | undefined = undefined;

            if (source.grade === 12) {
                targetClassId = 'GRADUATE';
                targetClassName = 'Lulus (Alumni)';
            } else {
                // Logic: X-A -> XI-A, XI-B -> XII-B
                // Replace Roman numerals
                const currentRoman = source.grade === 10 ? 'X' : 'XI';
                const nextRoman = source.grade === 10 ? 'XI' : 'XII';

                // Assuming name format "X-A" or "X A"
                const predictedName = source.name.replace(currentRoman, nextRoman);

                const target = targetClasses.find(t => t.name === predictedName);
                if (target) {
                    targetClassId = target.id;
                    targetClassName = target.name;
                }
            }

            return {
                sourceClassId: source.id,
                sourceClassName: source.name,
                sourceGrade: source.grade,
                targetClassId,
                targetClassName,
            };
        });
    },

    getStudentsByClass: async (classIds: string[]): Promise<StudentPromotion[]> => {
        await new Promise(resolve => setTimeout(resolve, 800));

        // Find class names for generating names
        const relevantClasses = MOCK_CLASSES.filter(c => classIds.includes(c.id));

        const allStudents: StudentPromotion[] = [];
        relevantClasses.forEach(c => {
            // Generate 15-25 students per class
            const count = 15 + Math.floor(Math.random() * 10);
            allStudents.push(...generateMockStudents(c.id, c.name, count));
        });

        return allStudents;
    },

    executePromotion: async (payload: PromotionPayload): Promise<PromotionStatus> => {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const total = payload.promotions.length;
        const promoted = payload.promotions.filter(p => p.action === 'PROMOTE').length;
        const stayed = payload.promotions.filter(p => p.action === 'STAY').length;
        const graduated = payload.promotions.filter(p => p.action === 'GRADUATE').length;

        return {
            totalStudents: total,
            promoted,
            stayed,
            graduated
        };
    }
};
