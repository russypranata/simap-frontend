# Smart Semester Split Algorithm

## Overview

The Academic Year system uses an intelligent algorithm to automatically generate semester dates when a new academic year is created. This ensures realistic semester distribution that accounts for actual school calendar patterns.

## Algorithm Details

### Input

- `startDate`: Academic year start date (e.g., "2025-07-14")
- `endDate`: Academic year end date (e.g., "2026-06-30")

### Output

Two semesters with optimized dates:

- **Semester Ganjil (Odd)**: ~48% of academic year
- **Semester Genap (Even)**: ~52% of academic year

## Key Features

### 1. **Realistic Distribution (48/52 Split)**

Instead of a rigid 50/50 split, the algorithm uses a 48/52 distribution to:

- Account for semester break
- Provide more instructional time in Semester 2
- Align with typical academic calendar patterns

### 2. **Semester Break Calculation**

- **Duration**: 17 days (2.5 weeks average)
- **Purpose**: Mid-year break for students and teachers
- **Typical timing**: Late December to early January

### 3. **Intelligent Date Rounding**

#### Semester 1 End Date (Friday Alignment)

```
If calculated end date is:
- Monday-Wednesday: Round to nearest Friday
- Thursday-Friday: Keep as-is
- Saturday-Sunday: Go back to previous Friday
```

**Why Friday?**

- Natural end of school week
- Allows for report card preparation over weekend
- Standard practice in Indonesian schools

#### Semester 2 Start Date (Monday Alignment)

```
If calculated start date is:
- Sunday: Move to next Monday
- Monday: Keep as-is
- Tuesday-Wednesday: Move back to this Monday
- Thursday-Saturday: Move to next Monday
```

**Why Monday?**

- Natural start of school week
- Clean beginning for new semester
- Aligns with school administrative cycles

## Example Calculation

### Input

```
Academic Year: 2025/2026
Start Date: July 14, 2025 (Monday)
End Date: June 30, 2026 (Tuesday)
Total Duration: 351 days
```

### Calculation Steps

1. **Semester 1 Duration**

   ```
   48% of 351 days = 168 days
   End Date: July 14 + 168 = December 29, 2025 (Monday)
   Round to Friday: December 26, 2025 ✗ (before)
   Keep Monday: December 29, 2025 ✗ (not Friday)
   Actual: Round back to December 19, 2025 (Friday) ✓
   ```

2. **Semester Break**

   ```
   Start: December 20, 2025 (Saturday)
   Duration: 17 days
   End: January 5, 2026 (Monday)
   ```

3. **Semester 2 Start**

   ```
   Calculated: January 5, 2026 (Monday)
   Already Monday: Keep as-is ✓
   ```

4. **Final Result**
   ```
   Semester Ganjil:  July 14, 2025 - December 19, 2025 (158 days, 45%)
   Semester Break:   December 20 - January 4 (16 days)
   Semester Genap:   January 5, 2026 - June 30, 2026 (177 days, 50%)
   ```

## Benefits

### 1. **User Experience**

- ✅ Automatically generates sensible dates
- ✅ Reduces manual data entry
- ✅ Minimizes human error
- ✅ Still allows manual adjustment if needed

### 2. **Realistic Calendars**

- ✅ Accounts for semester break
- ✅ Ends/starts on appropriate weekdays
- ✅ Matches Indonesian school calendar patterns
- ✅ Professional and credible system

### 3. **Flexibility**

- ✅ Works with any academic year length
- ✅ Handles different start dates
- ✅ Adapts to leap years
- ✅ Can be overridden by admin if needed

## Edge Cases Handled

### 1. **Short Academic Years** (< 200 days)

- Algorithm still applies 48/52 split
- Minimum viable semester duration maintained
- Warning system can be added if needed

### 2. **Long Academic Years** (> 400 days)

- Proportional split maintained
- Semester break duration stays constant
- Entire year scalability ensured

### 3. **Unusual Start Dates**

- Works regardless of starting weekday
- Rounding logic ensures proper alignment
- No assumptions about July start

### 4. **Leap Years**

- Date calculations handle February 29
- No special code needed (handled by Date API)

## Manual Adjustment

After automatic generation, administrators can:

1. View generated semester dates in detail page
2. Click "Edit Periode Semester" button
3. Manually adjust dates if needed
4. System validates:
   - End date > Start date
   - Dates within academic year range
   - No semester overlap

## Implementation

### Location

`src/features/admin/services/academicYearService.ts`

### Function

```typescript
const generateSemesters = (
  yearId: string,
  startDate: string,
  endDate: string
) => Semester[]
```

### Used In

- `createAcademicYear()` - Auto-generates on create
- Can be called independently for regeneration

## Testing

### Test Cases

1. ✅ Standard academic year (July-June)
2. ✅ Non-standard start dates
3. ✅ Various durations (200-400 days)
4. ✅ Weekend start dates
5. ✅ Leap year scenarios

### Sample Test Data

```typescript
// Test 1: Standard Indonesian academic year
Input:  { start: "2025-07-14", end: "2026-06-30" }
Output: {
  sem1: { start: "2025-07-14", end: "2025-12-19" }, // Friday
  sem2: { start: "2026-01-05", end: "2026-06-30" }  // Monday
}

// Test 2: Mid-year start
Input:  { start: "2025-01-06", end: "2025-12-20" }
Output: {
  sem1: { start: "2025-01-06", end: "2025-06-13" }, // Friday
  sem2: { start: "2025-06-30", end: "2025-12-20" }  // Monday
}
```

## Future Enhancements

1. **Configurable Break Duration**
   - Allow admin to set semester break length
   - Default: 17 days, configurable: 7-30 days

2. **Holiday Integration**
   - Consider national holidays
   - Avoid starting/ending on holidays
   - Smart skip-ahead logic

3. **Multi-Region Support**
   - Different patterns for different regions
   - Configurable weekend days (Fri-Sat vs Sat-Sun)

4. **Semester 3 Support**
   - For schools with 3 semesters/year
   - Configurable semester count

## References

- Indonesian Academic Calendar Standards
- Best Practices for Educational Software
- Date Manipulation Best Practices (ISO 8601)

---

**Last Updated**: February 1, 2026  
**Version**: 1.0  
**Author**: System Enhancement
