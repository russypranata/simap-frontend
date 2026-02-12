import { Extracurricular, ExtracurricularMember } from '../types/extracurricular';
import { MOCK_EXTRACURRICULARS } from '../data/mockExtracurriculars';
import { ExtracurricularFormValues } from '../schemas/extracurricularSchema';
import { MOCK_EXTRACURRICULAR_MEMBERS } from '../data/mockExtracurricularMembers';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class ExtracurricularService {
    private extracurriculars: Extracurricular[] = [...MOCK_EXTRACURRICULARS];

    async getAll(): Promise<Extracurricular[]> {
        await delay(800);
        return [...this.extracurriculars];
    }

    async getById(id: string): Promise<Extracurricular | undefined> {
        await delay(500);
        return this.extracurriculars.find(e => e.id === id);
    }

    async createExtracurricular(data: ExtracurricularFormValues): Promise<Extracurricular> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newEkskul: Extracurricular = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            currentCapacity: 0,
            academicYearId: '2025-2026', // Mock academic year
        };
        this.extracurriculars.push(newEkskul); // Changed from mockExtracurriculars to this.extracurriculars
        return newEkskul;
    } // Removed comma as it's a method, not an object property

    async updateExtracurricular(id: string, data: ExtracurricularFormValues): Promise<Extracurricular> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = this.extracurriculars.findIndex(e => e.id === id); // Changed from mockExtracurriculars to this.extracurriculars
        if (index === -1) throw new Error('Not found');

        const updated = {
            ...this.extracurriculars[index], // Changed from mockExtracurriculars to this.extracurriculars
            ...data
        };
        this.extracurriculars[index] = updated; // Changed from mockExtracurriculars to this.extracurriculars
        return updated;
    }

    async delete(id: string): Promise<void> {
        await delay(1000);
        this.extracurriculars = this.extracurriculars.filter(e => e.id !== id);
    }

    // --- Membership Methods ---
    private members: Record<string, ExtracurricularMember[]> = { ...MOCK_EXTRACURRICULAR_MEMBERS };

    async getMembers(extracurricularId: string): Promise<ExtracurricularMember[]> {
        await delay(600);
        return this.members[extracurricularId] || [];
    }

    async addMember(extracurricularId: string, memberData: Omit<ExtracurricularMember, 'id' | 'joinDate'>): Promise<ExtracurricularMember> {
        await delay(500);
        if (!this.members[extracurricularId]) {
            this.members[extracurricularId] = [];
        }

        const newMember: ExtracurricularMember = {
            id: Math.random().toString(36).substr(2, 9),
            ...memberData,
            joinDate: new Date().toISOString().split('T')[0]
        };

        this.members[extracurricularId].push(newMember);
        
        // Update current capacity in master data
        const ekskul = this.extracurriculars.find(e => e.id === extracurricularId);
        if (ekskul) {
            ekskul.currentCapacity = this.members[extracurricularId].length;
        }

        return newMember;
    }

    async removeMember(extracurricularId: string, memberId: string): Promise<void> {
        await delay(500);
        if (this.members[extracurricularId]) {
            this.members[extracurricularId] = this.members[extracurricularId].filter(m => m.id !== memberId);
            
            // Update current capacity
            const ekskul = this.extracurriculars.find(e => e.id === extracurricularId);
            if (ekskul) {
                ekskul.currentCapacity = this.members[extracurricularId].length;
            }
        }
    }
}

export const extracurricularService = new ExtracurricularService();
