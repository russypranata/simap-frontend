'use client';

import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import getCroppedImg from '../../utils/cropImage';
import { Loader2, ZoomIn, ZoomOut, Check, X, RotateCw } from 'lucide-react';

interface ImageCropperProps {
    imageSrc: string | null;
    open: boolean;
    onClose: () => void;
    onCropComplete: (croppedImage: File) => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
    imageSrc,
    open,
    onClose,
    onCropComplete,
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null,
    );
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onRotationChange = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const onCropCompleteHandler = useCallback(
        (_croppedArea: Area, croppedAreaPixels: Area) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        [],
    );

    const handleSave = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        setIsProcessing(true);
        try {
            const croppedBlob = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation,
            );

            if (croppedBlob) {
                const file = new File([croppedBlob], 'avatar-cropped.jpg', {
                    type: 'image/jpeg',
                });
                onCropComplete(file);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Sesuaikan Foto Profil</DialogTitle>
                </DialogHeader>
                <div className="relative w-full h-80 bg-black/5 rounded-lg overflow-hidden border">
                    {imageSrc && (
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            rotation={rotation}
                            aspect={3 / 4} // Portrait aspect ratio (0.75)
                            onCropChange={onCropChange}
                            onCropComplete={onCropCompleteHandler}
                            onZoomChange={onZoomChange}
                        />
                    )}
                </div>

                <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-4">
                        <ZoomOut className="h-4 w-4 text-muted-foreground" />
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(val) => onZoomChange(val[0])}
                            className="flex-1"
                        />
                        <ZoomIn className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onRotationChange}
                            className="text-muted-foreground"
                        >
                            <RotateCw className="h-4 w-4 mr-2" />
                            Putar 90°
                        </Button>
                    </div>
                </div>

                <DialogFooter className="flex gap-2 sm:justify-end">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isProcessing}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Batal
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isProcessing}
                        className="bg-blue-800 hover:bg-blue-900"
                    >
                        {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Check className="h-4 w-4 mr-2" />
                        )}
                        Terapkan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
