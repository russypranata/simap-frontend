import { ParentProfileData, mockParentProfile } from "../data/mockParentData";

export const getParentProfile = async (): Promise<ParentProfileData> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockParentProfile;
};

export const updateParentProfile = async (data: Partial<ParentProfileData>): Promise<ParentProfileData> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { ...mockParentProfile, ...data };
};

export const uploadParentAvatar = async (file: File): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return URL.createObjectURL(file);
};
