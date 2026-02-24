import { Schedule } from '../types/schedule';
import { expandSchedule } from './schedules/transformer';
import { MONDAY_SCHEDULE } from './schedules/monday';
import { TUESDAY_SCHEDULE } from './schedules/tuesday';

// Export flat schedules (backward compatible)
export const MOCK_SCHEDULES: Schedule[] = [
    ...expandSchedule(MONDAY_SCHEDULE),
    ...expandSchedule(TUESDAY_SCHEDULE),
    // Add other days here when ready:
    // ...expandSchedule(WEDNESDAY_SCHEDULE),
    // etc.
];

// Also export compact schedules for direct access
export { MONDAY_SCHEDULE } from './schedules/monday';
export { TUESDAY_SCHEDULE } from './schedules/tuesday';

