import { redirect } from 'next/navigation';

// HomeroomList functionality is now integrated into ClassList (/admin/class)
// Redirect to avoid duplicate pages
export default function Page() {
    redirect('/admin/class');
}
