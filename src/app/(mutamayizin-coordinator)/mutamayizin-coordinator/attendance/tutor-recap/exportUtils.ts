// Export utilities for Tutor Attendance Recap
// Supports Excel, CSV, and PDF formats

interface TutorAttendance {
    id: number;
    date: string;
    tutorName: string;
    ekstrakurikuler: string;
    startTime: string;
    endTime: string;
    duration: number;
    honor?: number;
}

// Format currency
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);
};

// Format date
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);
};

// Format time
export const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
};

// Export to CSV
export const exportToCSV = (
    data: TutorAttendance[],
    filename: string = "rekap-presensi-tutor.csv"
): void => {
    const headers = ["No", "Tanggal", "Nama Tutor", "Ekstrakurikuler", "Waktu Mulai", "Waktu Selesai", "Durasi (Menit)", "Honor"];

    const csvContent = [
        headers.join(","),
        ...data.map((record, index) => [
            index + 1,
            formatDate(record.date),
            `"${record.tutorName}"`,
            `"${record.ekstrakurikuler}"`,
            formatTime(record.startTime),
            formatTime(record.endTime),
            record.duration,
            record.honor || 0
        ].join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
};

// Export to Excel (XLSX)
// Export to Excel (XLSX)
export const exportToExcel = async (
    data: TutorAttendance[],
    filename: string = "rekap-presensi-tutor.xlsx"
): Promise<void> => {
    // Dynamically import xlsx library
    const XLSX = await import("xlsx");

    try {
        // Attempt to load the template from the public folder
        const templatePath = "/Salinan Presensi Kehadiran Tutor Ekstrakurikuler SMA (Jawaban).xlsx";
        const response = await fetch(templatePath);

        if (!response.ok) {
            throw new Error(`Template not found at ${templatePath}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        // Assume the first sheet is the template
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Map data to match template columns
        // We assume standard columns: No, Tanggal, Nama, Ekskul, Mulai, Selesai, Durasi, Honor
        const exportData = data.map((record, index) => [
            index + 1,
            formatDate(record.date),
            record.tutorName,
            record.ekstrakurikuler,
            formatTime(record.startTime),
            formatTime(record.endTime),
            record.duration,
            record.honor || 0
        ]);

        // Write data starting from row 6 (A6) to skip headers
        // We use sheet_add_aoa (Array of Arrays) for precise control without object keys
        XLSX.utils.sheet_add_aoa(worksheet, exportData, { origin: "A6" });

        XLSX.writeFile(workbook, filename);

    } catch (error) {
        console.warn("Falling back to basic export due to error:", error);

        // Fallback: Create a new workbook from scratch
        const worksheet = XLSX.utils.json_to_sheet(
            data.map((record, index) => ({
                "No": index + 1,
                "Tanggal": formatDate(record.date),
                "Nama Tutor": record.tutorName,
                "Ekstrakurikuler": record.ekstrakurikuler,
                "Waktu Mulai": formatTime(record.startTime),
                "Waktu Selesai": formatTime(record.endTime),
                "Durasi (Menit)": record.duration,
                "Honor": record.honor || 0,
            }))
        );

        // Set column widths for fallback
        worksheet["!cols"] = [
            { wch: 5 },  // No
            { wch: 18 }, // Tanggal
            { wch: 25 }, // Nama Tutor
            { wch: 20 }, // Ekstrakurikuler
            { wch: 12 }, // Waktu Mulai
            { wch: 12 }, // Waktu Selesai
            { wch: 15 }, // Durasi
            { wch: 15 }, // Honor
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Presensi");
        XLSX.writeFile(workbook, filename);
    }
};

// Export to PDF
export const exportToPDF = async (
    data: TutorAttendance[],
    academicYear: string,
    semester: string,
    filename: string = "rekap-presensi-tutor.pdf"
): Promise<void> => {
    // Dynamically import jsPDF and autoTable
    const { jsPDF } = await import("jspdf");
    await import("jspdf-autotable");

    const doc = new jsPDF("l", "mm", "a4"); // Landscape A4

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Rekap Presensi Tutor Ekstrakurikuler", 148, 15, { align: "center" });

    // Subtitle
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Tahun Ajaran: ${academicYear} | Semester: ${semester}`, 148, 22, { align: "center" });

    // Table
    const tableData = data.map((record, index) => [
        index + 1,
        formatDate(record.date),
        record.tutorName,
        record.ekstrakurikuler,
        formatTime(record.startTime),
        formatTime(record.endTime),
        `${record.duration} menit`,
        record.honor ? formatCurrency(record.honor) : "-",
    ]);

    (doc as any).autoTable({
        head: [["No", "Tanggal", "Nama Tutor", "Ekstrakurikuler", "Mulai", "Selesai", "Durasi", "Honor"]],
        body: tableData,
        startY: 28,
        styles: {
            fontSize: 8,
            cellPadding: 2,
        },
        headStyles: {
            fillColor: [30, 64, 175], // Blue
            textColor: 255,
            fontStyle: "bold",
        },
        columnStyles: {
            0: { halign: "center", cellWidth: 10 },
            1: { cellWidth: 28 },
            2: { cellWidth: 40 },
            3: { cellWidth: 35 },
            4: { halign: "center", cellWidth: 20 },
            5: { halign: "center", cellWidth: 20 },
            6: { halign: "center", cellWidth: 20 },
            7: { halign: "right", cellWidth: 30 },
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250],
        },
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(
            `Halaman ${i} dari ${pageCount}`,
            148,
            doc.internal.pageSize.height - 10,
            { align: "center" }
        );
        doc.text(
            `Dicetak pada: ${new Date().toLocaleString("id-ID")}`,
            doc.internal.pageSize.width - 10,
            doc.internal.pageSize.height - 10,
            { align: "right" }
        );
    }

    doc.save(filename);
};
