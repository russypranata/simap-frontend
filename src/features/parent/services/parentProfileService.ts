import { PARENT_API_URL, getAuthHeaders, handleApiError } from "./parentApiClient";

export interface ParentProfileData {
    id: string;
    name: string;
    username: string;
    email: string;
    phone: string;
    address: string;
    occupation: string;
    profilePicture?: string;
    joinDate: string;
    children: {
        id: string;
        name: string;
        class: string;
        nis: string;
    }[];
}

export interface UpdateParentProfileRequest {
    name: string;
    username: string;
    email: string;
    phone?: string;
    address?: string;
    occupation?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeProfile = (d: Record<string, any>): ParentProfileData => ({
    id: String(d.id ?? ""),
    name: d.name ?? "",
    username: d.username ?? "",
    email: d.email ?? "",
    phone: d.phone ?? "",
    address: d.address ?? "",
    occupation: d.occupation ?? "",
    profilePicture: (() => {
        const raw = (d.profile_picture ?? d.profilePicture ?? d.avatar ?? "") as string;
        if (!raw || raw.includes("default.jpg") || raw.includes("default.png")) return "";
        return raw;
    })(),
    joinDate: d.join_date ?? d.joinDate ?? "",
    children: (d.children ?? []).map((c: Record<string, unknown>) => ({
        id: String(c.id),
        name: (c.name ?? "") as string,
        class: (c.class ?? "") as string,
        nis: ((c.nis ?? c.admission_number ?? "") as string),
    })),
});

export const getParentProfile = async (): Promise<ParentProfileData> => {
    const response = await fetch(`${PARENT_API_URL}/profile`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return normalizeProfile(result.data);
};

export const updateParentProfile = async (data: UpdateParentProfileRequest): Promise<ParentProfileData> => {
    const response = await fetch(`${PARENT_API_URL}/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return normalizeProfile(result.data);
};

export const uploadParentAvatar = async (file: File): Promise<string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(`${PARENT_API_URL}/profile/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        body: formData,
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data?.profile_picture ?? result.data?.avatar ?? "";
};

export const updateParentPassword = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}): Promise<void> => {
    const response = await fetch(`${PARENT_API_URL}/profile/password`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            current_password: data.currentPassword,
            new_password: data.newPassword,
            new_password_confirmation: data.confirmPassword,
        }),
    });
    if (!response.ok) await handleApiError(response);
};
