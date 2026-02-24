import { ParentProfileData, mockParentProfile } from "../data/mockParentData";

export const getParentProfile = async (): Promise<ParentProfileData> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockParentProfile;
};

export const updateParentProfile = async (data: Partial<ParentProfileData>): Promise<ParentProfileData> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Updated parent profile:", data);
    return { ...mockParentProfile, ...data };
};

export const uploadParentAvatar = async (file: File): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Uploaded avatar:", file.name);
    return URL.createObjectURL(file); // Mock return URL
};
