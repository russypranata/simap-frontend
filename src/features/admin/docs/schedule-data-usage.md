# Schedule Data Structure - Usage Guide

## Overview

Jadwal sekolah sekarang menggunakan struktur yang **normalized** dan **well-organized** dengan entitas terpisah untuk Time Slots dan helper functions untuk query.

## File Structure

```
data/
  mockScheduleData.ts    - 62 schedule entries for Monday
  mockTimeSlots.ts       - 11 time slot definitions
utils/
  scheduleHelpers.ts     - Query & utility functions
```

## Time Slots

```typescript
import { MOCK_TIME_SLOTS, getLessonSlots } from '@/features/admin/data/mockTimeSlots';

// Get all time slots
const allSlots = MOCK_TIME_SLOTS;

// Get lesson slots only (excludes breaks)
const lessons = getLessonSlots(); // 8 slots

// Slot structure
{
  id: 'slot-1',
  label: 'Jam ke-1',
  startTime: '07:50',
  endTime: '08:30',
  order: 1,
  type: 'lesson'
}
```

## Query Examples

### Get Schedules by Day

```typescript
import { getSchedulesByDay } from "@/features/admin/utils/scheduleHelpers";

const mondaySchedules = getSchedulesByDay("Senin");
// Returns all 62 schedules for Monday
```

### Get Schedules by Class

```typescript
import { getSchedulesByClass } from "@/features/admin/utils/scheduleHelpers";

const class10A = getSchedulesByClass("cls-10a");
// Returns all schedules for class X A
```

### Get Schedules by Teacher

```typescript
import { getSchedulesByTeacher } from "@/features/admin/utils/scheduleHelpers";

const paisalSchedules = getSchedulesByTeacher("tch-paisal");
// Returns all Paisal's teaching schedules
```

## Grid View (Time x Class Matrix)

```typescript
import { getScheduleGrid } from "@/features/admin/utils/scheduleHelpers";

const classIds = ["cls-10a", "cls-10b", "cls-11a", "cls-11b"];
const grid = getScheduleGrid("Senin", classIds);

// Returns:
// [
//   {
//     timeSlot: { label: 'Jam ke-1', startTime: '07:50', ... },
//     cells: Map {
//       'cls-10a' => Schedule { subjectName: 'Tajwid', ... },
//       'cls-10b' => Schedule { subjectName: 'SJR P', ... },
//       ...
//     }
//   },
//   ...
// ]
```

## Grouping

### Group by Class

```typescript
import { groupSchedulesByClass } from "@/features/admin/utils/scheduleHelpers";

const byClass = groupSchedulesByClass("Senin");
// [
//   { classId: 'cls-10a', className: 'X A', schedules: [...] },
//   { classId: 'cls-10b', className: 'X B', schedules: [...] },
//   ...
// ]
```

### Group by Teacher

```typescript
import { groupSchedulesByTeacher } from "@/features/admin/utils/scheduleHelpers";

const byTeacher = groupSchedulesByTeacher("Senin");
// [
//   { teacherId: 'tch-paisal', teacherName: 'Paisal', schedules: [...] },
//   ...
// ]
```

## Conflict Detection

```typescript
import {
  hasTeacherConflict,
  hasClassConflict,
  hasRoomConflict,
} from "@/features/admin/utils/scheduleHelpers";

// Check teacher availability
const conflict = hasTeacherConflict("tch-paisal", "Senin", "07:50", "08:30");
// Returns true if Paisal already has a class at this time

// Check class availability
const classConflict = hasClassConflict("cls-10a", "Senin", "07:50", "08:30");

// Check room availability
const roomConflict = hasRoomConflict("R. 101", "Senin", "07:50", "08:30");
```

## Statistics

```typescript
import {
  getTeacherHoursPerDay,
  getTeacherHoursPerWeek,
  getClassHoursPerDay,
} from "@/features/admin/utils/scheduleHelpers";

// Teacher workload
const paisalMonday = getTeacherHoursPerDay("tch-paisal", "Senin");
const paisalWeek = getTeacherHoursPerWeek("tch-paisal");

// Class schedule density
const class10AMonday = getClassHoursPerDay("cls-10a", "Senin");
```

## Component Usage Example

```typescript
import { getScheduleGrid } from '@/features/admin/utils/scheduleHelpers';
import { getLessonSlots } from '@/features/admin/data/mockTimeSlots';

function ScheduleTable() {
  const classes = ['cls-10a', 'cls-10b', 'cls-11a'];
  const grid = getScheduleGrid('Senin', classes);

  return (
    <table>
      <thead>
        <tr>
          <th>Waktu</th>
          {classes.map(cls => <th key={cls}>{cls}</th>)}
        </tr>
      </thead>
      <tbody>
        {grid.map(row => (
          <tr key={row.timeSlot.id}>
            <td>{row.timeSlot.label}</td>
            {classes.map(classId => {
              const schedule = row.cells.get(classId);
              return (
                <td key={classId}>
                  {schedule ? schedule.subjectName : '-'}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Benefits

✅ **Normalized** - Time slots defined once, reused everywhere  
✅ **Type-Safe** - Strong TypeScript typing throughout  
✅ **Flexible Queries** - Helper functions for any use case  
✅ **Conflict Detection** - Built-in validation  
✅ **Statistics** - Easy workload analysis  
✅ **Grid Views** - Simple matrix generation
