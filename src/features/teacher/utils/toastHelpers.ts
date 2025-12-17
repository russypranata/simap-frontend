import { toast } from "@/hooks/use-toast";

export const showSuccessToast = (message: string, description?: string) => {
    toast({
        title: message,
        description,
        variant: "default",
        duration: 3000,
    });
};

export const showErrorToast = (message: string, description?: string) => {
    toast({
        title: message,
        description,
        variant: "destructive",
        duration: 5000,
    });
};

export const showInfoToast = (message: string, description?: string) => {
    toast({
        title: message,
        description,
        duration: 3000,
    });
};

// Specific toast messages for behavior records
export const BehaviorToasts = {
    createSuccess: () =>
        showSuccessToast(
            "Catatan Berhasil Disimpan",
            "Catatan pelanggaran siswa telah berhasil dicatat."
        ),
    createError: () =>
        showErrorToast(
            "Gagal Menyimpan Catatan",
            "Terjadi kesalahan saat menyimpan catatan. Silakan coba lagi."
        ),
    updateSuccess: () =>
        showSuccessToast(
            "Catatan Berhasil Diperbarui",
            "Perubahan catatan telah berhasil disimpan."
        ),
    updateError: () =>
        showErrorToast(
            "Gagal Memperbarui Catatan",
            "Terjadi kesalahan saat memperbarui catatan. Silakan coba lagi."
        ),
    deleteSuccess: () =>
        showSuccessToast(
            "Catatan Berhasil Dihapus",
            "Catatan pelanggaran telah dihapus dari sistem."
        ),
    deleteError: () =>
        showErrorToast(
            "Gagal Menghapus Catatan",
            "Terjadi kesalahan saat menghapus catatan. Silakan coba lagi."
        ),
    loadError: () =>
        showErrorToast(
            "Gagal Memuat Data",
            "Terjadi kesalahan saat memuat data. Silakan refresh halaman."
        ),
    validationError: (message: string) =>
        showErrorToast("Data Tidak Valid", message),
};
