import { Schedule } from '../../types/schedule';
import { CompactDaySchedule } from '../../types/compactSchedule';

/**
 * Transform compact schedule format into flat Schedule array
 * This allows compact storage while maintaining compatibility with existing helpers
 */
export function expandSchedule(compactSchedule: CompactDaySchedule): Schedule[] {
    const schedules: Schedule[] = [];
    let counter = 1;
    
    // Get day prefix for IDs (sen, sel, rab, kam, jum, sab)
    const dayPrefix = compactSchedule.day.slice(0, 3).toLowerCase();
    
    compactSchedule.slots.forEach(slot => {
        slot.classes.forEach(cls => {
            schedules.push({
                id: `sch-${dayPrefix}-${String(counter).padStart(3, '0')}`,
                day: compactSchedule.day,
                startTime: slot.startTime,
                endTime: slot.endTime,
                
                // Class info
                classId: cls.classId,
                className: cls.className,
                
                // Subject info
                subjectId: cls.subjectId,
                subjectName: cls.subjectName,
                
                // Teacher info
                teacherId: cls.teacherId,
                teacherName: cls.teacherName,
                
                // Room
                room: cls.room,
                
                // Academic info
                academicYear: compactSchedule.academicYear,
                semester: compactSchedule.semester,

                // Required Schedule fields
                classSubjectId: '',
                type: 'lesson',
                dayOfWeek: 'monday',
                createdAt: '',
                updatedAt: '',
            });
            counter++;
        });
    });
    
    return schedules;
}

/**
 * Transform multiple compact day schedules into flat Schedule array
 */
export function expandSchedules(compactSchedules: CompactDaySchedule[]): Schedule[] {
    return compactSchedules.flatMap(schedule => expandSchedule(schedule));
}
