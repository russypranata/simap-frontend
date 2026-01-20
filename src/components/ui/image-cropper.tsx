"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import getCroppedImg from "@/features/shared/utils/canvasUtils";
import { Loader2 } from "lucide-react";

interface ImageCropperProps {
    open: boolean;
    imageSrc: string | null;
    onOpenChange: (open: boolean) => void;
    onCropComplete: (croppedImageBlob: Blob) => void;
    aspect?: number;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
    open,
    imageSrc,
    onOpenChange,
    onCropComplete,
    aspect = 1, // Default to square for avatars
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteCallback = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        try {
            setIsLoading(true);
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (croppedImage) {
                onCropComplete(croppedImage);
                onOpenChange(false);
            }
        } catch (e) {
            console.error("Failed to crop image", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Foto Profil</DialogTitle>
                </DialogHeader>
                
                <div className="relative h-80 w-full bg-slate-900 rounded-md overflow-hidden">
                    {imageSrc && (
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            onCropChange={onCropChange}
                            onZoomChange={onZoomChange}
                            onCropComplete={onCropCompleteCallback}
                            cropShape="round" // Round mask for avatars
                            showGrid={false}
                        />
                    )}
                </div>

                <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium w-fit whitespace-nowrap">Zoom</span>
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(vals) => setZoom(vals[0])}
                            className="flex-1"
                        />
                    </div>
                </div>

                <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
                     <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Batal
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading} className="bg-blue-800 hover:bg-blue-900 text-white">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Simpan Foto
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
