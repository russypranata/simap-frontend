import { redirect } from "next/navigation";

// Tutor/advisor does not have permission to register new members.
// Registration of members is handled by the admin/coordinator role.
export default function RegisterMemberPage() {
    redirect("/extracurricular-advisor/members");
}
