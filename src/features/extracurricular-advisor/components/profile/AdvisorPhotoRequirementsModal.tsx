"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Camera,
    FileImage,
    CheckCircle2,
    AlertCircle,
    X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdvisorPhotoRequirementsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onProceed: () => void;
}

export const AdvisorPhotoRequirementsModal: React.FC<AdvisorPhotoRequirementsModalProps> = ({
    open,
    onOpenChange,
    onProceed,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <DialogHeader className="text-left">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
                            <Camera className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-lg font-semibold">
                                Persyaratan Foto Profil
                            </DialogTitle>
                            <DialogDescription className="text-sm mt-0.5 ml-0.5">
                                Pastikan foto yang Anda unggah memenuhi kriteria berikut
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {/* Requirements Section */}
                    <div className="rounded-md border border-blue-800/20 bg-blue-50/50 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <AlertCircle className="h-5 w-5 text-blue-700" />
                            <h3 className="text-base font-semibold text-blue-800">
                                Persyaratan Wajib
                            </h3>
                        </div>
                        <div className="space-y-4 pl-8">
                            {/* Format File */}
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    <FileImage className="h-4 w-4 text-blue-700" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-gray-900 leading-none mb-1">
                                        Format File
                                    </p>
                                    <p className="text-sm text-gray-600 leading-tight">
                                        JPG, JPEG, atau PNG
                                    </p>
                                    <div className="flex gap-2 mt-1.5">
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 h-5 px-1.5 text-[10px]">
                                            <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                                            .jpg
                                        </Badge>
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 h-5 px-1.5 text-[10px]">
                                            <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                                            .png
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* File Size */}
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    <FileImage className="h-4 w-4 text-blue-700" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-gray-900 leading-none mb-1">
                                        Ukuran File
                                    </p>
                                    <p className="text-sm text-gray-600 leading-tight">
                                        Maksimal 2 MB
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer with Action Button */}
                    <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Batal
                        </Button>
                        <Button
                            className="bg-blue-800 hover:bg-blue-900 text-white"
                            onClick={onProceed}
                        >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Mengerti, Lanjutkan
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
