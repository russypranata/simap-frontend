import { Subject, CreateSubjectRequest, UpdateSubjectRequest, TeacherRef } from '../types/subject';
import { mockSubjects, mockTeachersForSubject } from '../data/mockSubjectData';

const USE_MOCK_DATA = true;

// In-memory store for mock operations
let subjects = [...mockSubjects];

export const subjectService = {
    // Get all subjects
    async getSubjects(): Promise<Subject[]> {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return subjects;
        }
        const response = await fetch('/api/admin/subjects');
        return response.json();
    },

    // Get subject by ID
    async getSubjectById(id: string): Promise<Subject | null> {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));
            const subject = subjects.find(s => s.id === id);
            if (subject) {
                return {
                    ...subject,
                    teachers: subject.teacherIds.map(tid => 
                        mockTeachersForSubject.find(t => t.id === tid)
                    ).filter(Boolean) as TeacherRef[]
                };
            }
            return null;
        }
        const response = await fetch(`/api/admin/subjects/${id}`);
        return response.json();
    },

    // Create new subject
    async createSubject(data: CreateSubjectRequest): Promise<Subject> {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const newSubject: Subject = {
                id: `subj-${Date.now()}`,
                code: data.code,
                name: data.name,
                category: data.category,
                type: data.type,
                forGender: data.forGender,
                hoursPerWeek: data.hoursPerWeek,
                gradeLevel: data.gradeLevel || [],
                description: data.description,
                teacherIds: data.teacherIds || [],
                teacherNames: data.teacherIds?.map(id => 
                    mockTeachersForSubject.find(t => t.id === id)?.name || 'Unknown'
                ) || [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            subjects.push(newSubject);
            return newSubject;
        }
        const response = await fetch('/api/admin/subjects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    // Update subject
    async updateSubject(id: string, data: UpdateSubjectRequest): Promise<Subject> {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const index = subjects.findIndex(s => s.id === id);
            if (index !== -1) {
                subjects[index] = {
                    ...subjects[index],
                    ...data,
                    teacherNames: data.teacherIds?.map(tid => 
                        mockTeachersForSubject.find(t => t.id === tid)?.name || 'Unknown'
                    ) || subjects[index].teacherNames,
                    gradeLevel: data.gradeLevel || subjects[index].gradeLevel,
                    updatedAt: new Date().toISOString(),
                };
                return subjects[index];
            }
            throw new Error('Subject not found');
        }
        const response = await fetch(`/api/admin/subjects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    // Delete subject
    async deleteSubject(id: string): Promise<void> {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));
            subjects = subjects.filter(s => s.id !== id);
            return;
        }
        await fetch(`/api/admin/subjects/${id}`, { method: 'DELETE' });
    },

    // Get teachers for assignment
    async getTeachers(): Promise<TeacherRef[]> {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));
            return mockTeachersForSubject;
        }
        const response = await fetch('/api/admin/teachers');
        return response.json();
    },
};
