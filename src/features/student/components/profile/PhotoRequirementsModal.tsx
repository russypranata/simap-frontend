"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Camera,
    FileImage,
    Maximize2,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Lightbulb,
    X, // Import X icon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PhotoRequirementsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onProceed: () => void;
}

export const PhotoRequirementsModal: React.FC<PhotoRequirementsModalProps> = ({
    open,
    onOpenChange,
    onProceed,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Camera className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-xl font-semibold">
                                Persyaratan Foto Profil
                            </DialogTitle>
                            <DialogDescription className="text-sm mt-1">
                                Pastikan foto yang Anda unggah memenuhi kriteria berikut
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {/* Requirements Section */}
                    <Card className="border-blue-800/20 bg-blue-50/50">
                        <CardContent className="pt-3 pb-4 px-4">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertCircle className="h-5 w-5 text-blue-700" />
                                <h3 className="text-base font-semibold text-blue-800">
                                    Persyaratan Wajib
                                </h3>
                            </div>
                            <div className="space-y-2">
                                {/* Format File */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        <FileImage className="h-4 w-4 text-blue-700" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-gray-900">
                                            Format File
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            JPG, JPEG, atau PNG
                                        </p>
                                        <div className="flex gap-2 mt-1">
                                            <Badge
                                                variant="outline"
                                                className="bg-green-50 text-green-700 border-green-200"
                                            >
                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                .jpg
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="bg-green-50 text-green-700 border-green-200"
                                            >
                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                .png
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="bg-red-50 text-red-700 border-red-200"
                                            >
                                                <XCircle className="h-3 w-3 mr-1" />
                                                .gif
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
                                        <p className="font-medium text-sm text-gray-900">
                                            Ukuran File
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Maksimal 2 MB (2048 KB)
                                        </p>
                                    </div>
                                </div>

                                {/* Image Dimensions */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        <Maximize2 className="h-4 w-4 text-blue-700" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-gray-900">
                                            Dimensi Minimal
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            300 × 400 pixel (Lebar × Tinggi)
                                        </p>
                                    </div>
                                </div>

                                {/* Aspect Ratio */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        <Maximize2 className="h-4 w-4 text-blue-700" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-gray-900">
                                            Rasio Aspek
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            3:4 (Portrait / Tegak)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recommendations Section */}
                    <Card className="border-amber-800/20 bg-amber-50/50">
                        <CardContent className="pt-3 pb-4 px-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Lightbulb className="h-5 w-5 text-amber-800" />
                                <h3 className="text-base font-semibold text-amber-800">
                                    Rekomendasi
                                </h3>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-amber-700 mt-0.5 flex-shrink-0" />
                                    <span>
                                        Gunakan foto dengan <strong>latar belakang polos</strong>{" "}
                                        (merah)
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-amber-700 mt-0.5 flex-shrink-0" />
                                    <span>
                                        Wajah terlihat <strong>jelas dan menghadap kamera</strong>
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-amber-700 mt-0.5 flex-shrink-0" />
                                    <span>
                                        Pencahayaan <strong>cukup dan merata</strong> (tidak gelap
                                        atau terlalu terang)
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-amber-700 mt-0.5 flex-shrink-0" />
                                    <span>
                                        Berpakaian <strong>rapi dan sopan</strong> (seragam putih biru)
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-amber-700 mt-0.5 flex-shrink-0" />
                                    <span>
                                        Hindari menggunakan <strong>filter, efek, atau sticker</strong>
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-amber-700 mt-0.5 flex-shrink-0" />
                                    <span>
                                        Foto diambil <strong>maksimal 6 bulan terakhir</strong> agar
                                        sesuai dengan kondisi terkini
                                    </span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

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
