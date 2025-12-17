export interface ValidationError {
    field: string;
    message: string;
}

export interface BehaviorFormData {
    studentId: number;
    problem: string;
    followUp: string;
    location: "sekolah" | "asrama";
}

export const validateBehaviorForm = (
    data: Partial<BehaviorFormData>
): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!data.studentId) {
        errors.push({
            field: "studentId",
            message: "Siswa harus dipilih",
        });
    }

    if (!data.problem || data.problem.trim().length === 0) {
        errors.push({
            field: "problem",
            message: "Masalah/pelanggaran harus diisi",
        });
    } else if (data.problem.trim().length < 10) {
        errors.push({
            field: "problem",
            message: "Deskripsi masalah minimal 10 karakter",
        });
    } else if (data.problem.trim().length > 500) {
        errors.push({
            field: "problem",
            message: "Deskripsi masalah maksimal 500 karakter",
        });
    }

    if (!data.followUp || data.followUp.trim().length === 0) {
        errors.push({
            field: "followUp",
            message: "Tindak lanjut harus diisi",
        });
    } else if (data.followUp.trim().length < 5) {
        errors.push({
            field: "followUp",
            message: "Deskripsi tindak lanjut minimal 5 karakter",
        });
    } else if (data.followUp.trim().length > 300) {
        errors.push({
            field: "followUp",
            message: "Deskripsi tindak lanjut maksimal 300 karakter",
        });
    }

    if (!data.location) {
        errors.push({
            field: "location",
            message: "Lokasi kejadian harus dipilih",
        });
    }

    return errors;
};

export const isFormValid = (data: Partial<BehaviorFormData>): boolean => {
    return validateBehaviorForm(data).length === 0;
};

export const getFieldError = (
    errors: ValidationError[],
    field: string
): string | undefined => {
    return errors.find((e) => e.field === field)?.message;
};
