import StudentBehaviorPage from "@/features/teacher/pages/StudentBehaviorPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Catatan Perilaku Siswa | SIMAP",
    description: "Halaman untuk mencatat perilaku siswa.",
};

export default function Page() {
    return <StudentBehaviorPage />;
}
