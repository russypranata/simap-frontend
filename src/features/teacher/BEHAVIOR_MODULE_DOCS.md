# Student Behavior Module - Refactoring Documentation

## 📁 Struktur File yang Dibuat

```
src/features/teacher/
├── data/
│   └── mockBehaviorData.ts          # Mock data & interfaces
├── services/
│   └── behaviorService.ts           # Service layer (API-ready)
├── hooks/
│   ├── useBehaviorRecords.ts        # Custom hook untuk records
│   └── useStudents.ts               # Custom hook untuk students
├── components/
│   └── BehaviorSkeletons.tsx        # Loading skeleton components
└── utils/
    ├── toastHelpers.ts              # Toast notification helpers
    └── formValidation.ts            # Form validation logic
```

---

## 🎯 Fitur yang Sudah Diimplementasikan

### ✅ 1. Mock Data Layer (`mockBehaviorData.ts`)
- **Interface TypeScript** untuk Student dan BehaviorRecord
- **Mock data** yang terpisah dari component
- **Helper functions** untuk data manipulation
- **Mudah diganti** dengan API real nanti

### ✅ 2. Service Layer (`behaviorService.ts`)
**Student Services:**
- `getStudents()` - Get students dengan filter & pagination
- `getClasses()` - Get daftar kelas

**Behavior Record Services:**
- `getBehaviorRecords()` - Get records dengan filter kompleks
- `getBehaviorRecordById()` - Get single record
- `createBehaviorRecord()` - Create new record
- `updateBehaviorRecord()` - Update existing record
- `deleteBehaviorRecord()` - Delete record
- `getTeachers()` - Get daftar guru

**Auth Services:**
- `getCurrentTeacher()` - Get current logged-in teacher

**Fitur:**
- ✅ Simulasi API delay (realistic UX)
- ✅ Type-safe dengan TypeScript
- ✅ Pagination support
- ✅ Advanced filtering
- ✅ TODO markers untuk API integration
- ✅ Dokumentasi lengkap

### ✅ 3. Custom Hooks

**`useBehaviorRecords(params)`**
```typescript
const {
    records,           // Array of records
    loading,           // Loading state
    error,             // Error message
    pagination,        // Pagination info
    refetch,           // Refresh data
    createRecord,      // Create new record
    setPage,           // Change page
    setLimit,          // Change items per page
} = useBehaviorRecords({
    academicYear: "2025/2026",
    semester: "Ganjil",
    class: "XII A",
    // ... more filters
});
```

**`useStudents(params)`**
```typescript
const {
    students,          // Array of students
    loading,           // Loading state
    error,             // Error message
    pagination,        // Pagination info
    refetch,           // Refresh data
    setPage,           // Change page
    setLimit,          // Change items per page
} = useStudents({
    class: "XII A",
    search: "Ahmad",
});
```

### ✅ 4. Loading Skeletons (`BehaviorSkeletons.tsx`)
- `StudentCardSkeleton` - Single student card skeleton
- `StudentListSkeleton` - Grid of student cards
- `TableRowSkeleton` - Single table row skeleton
- `TableSkeleton` - Complete table skeleton
- `FilterCardSkeleton` - Filter card skeleton

**Features:**
- Pulse animation
- Matches actual component structure
- Configurable count

### ✅ 5. Toast Notifications (`toastHelpers.ts`)
**Generic Helpers:**
- `showSuccessToast(message, description)`
- `showErrorToast(message, description)`
- `showInfoToast(message, description)`

**Behavior-Specific Toasts:**
```typescript
BehaviorToasts.createSuccess()
BehaviorToasts.createError()
BehaviorToasts.updateSuccess()
BehaviorToasts.updateError()
BehaviorToasts.deleteSuccess()
BehaviorToasts.deleteError()
BehaviorToasts.loadError()
BehaviorToasts.validationError(message)
```

### ✅ 6. Form Validation (`formValidation.ts`)
```typescript
const errors = validateBehaviorForm({
    studentId: 1,
    problem: "...",
    followUp: "...",
    location: "sekolah"
});

const isValid = isFormValid(formData);
const errorMsg = getFieldError(errors, "problem");
```

**Validation Rules:**
- Student ID: Required
- Problem: Required, 10-500 characters
- Follow Up: Required, 5-300 characters
- Location: Required

---

## 🔄 Cara Menggunakan di Component

### Example: Menggunakan Custom Hook

```typescript
import { useBehaviorRecords } from "@/features/teacher/hooks/useBehaviorRecords";
import { BehaviorToasts } from "@/features/teacher/utils/toastHelpers";
import { TableSkeleton } from "@/features/teacher/components/BehaviorSkeletons";

function MyComponent() {
    const [filters, setFilters] = useState({
        class: "all",
        search: "",
        dateFrom: "",
        dateTo: "",
    });

    const {
        records,
        loading,
        error,
        pagination,
        createRecord,
        setPage,
    } = useBehaviorRecords(filters);

    const handleSubmit = async (data) => {
        const success = await createRecord(data);
        if (success) {
            BehaviorToasts.createSuccess();
        } else {
            BehaviorToasts.createError();
        }
    };

    if (loading) return <TableSkeleton rows={5} />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {records.map(record => (
                <div key={record.id}>{record.problem}</div>
            ))}
            <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
            />
        </div>
    );
}
```

---

## 🚀 Migrasi ke API Real

Ketika backend sudah siap, hanya perlu mengubah **1 file**: `behaviorService.ts`

### Before (Mock):
```typescript
export const getStudents = async (params) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // ... mock logic
    return { data: mockStudents, pagination };
};
```

### After (Real API):
```typescript
export const getStudents = async (params) => {
    const response = await fetch('/api/students?' + new URLSearchParams(params));
    const data = await response.json();
    return data;
};
```

**Component tidak perlu diubah sama sekali!** ✨

---

## 📊 Type Safety

Semua interface sudah didefinisikan:

```typescript
interface Student {
    id: number;
    name: string;
    class: string;
    nis: string;
}

interface BehaviorRecord {
    id: number;
    studentId: number;
    teacherName: string;
    problem: string;
    followUp: string;
    location: "sekolah" | "asrama";
    date: string;
}

interface BehaviorRecordWithStudent extends BehaviorRecord {
    student?: Student;
}
```

---

## ✅ Checklist Kesiapan

- [x] Mock data terpisah
- [x] Service layer dengan simulasi API
- [x] Custom hooks untuk state management
- [x] Loading states & skeletons
- [x] Error handling
- [x] Toast notifications
- [x] Form validation
- [x] Type safety (TypeScript)
- [x] Pagination support
- [x] Advanced filtering
- [x] Dokumentasi lengkap

---

## 🎯 Next Steps

1. **Refactor Component** - Update `StudentBehaviorPage.tsx` untuk menggunakan hooks
2. **Test Validation** - Test form validation di UI
3. **Test Loading States** - Test skeleton loading
4. **Test Error Handling** - Simulate errors
5. **API Integration** - Ganti mock dengan real API (when ready)

---

## 📝 Notes

- Semua TODO markers sudah ditambahkan untuk API integration points
- Mock data akan tetap berfungsi sampai API ready
- Component akan tetap responsive dengan loading states
- Error handling sudah comprehensive
- Validation messages dalam Bahasa Indonesia
