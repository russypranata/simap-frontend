import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, FolderUp, X } from "lucide-react";

interface DocumentUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    documentType: string;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
    isOpen,
    onClose,
    documentType,
}) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        // Mock upload logic
        console.log(`Uploading ${file?.name} for ${documentType}`);
        onClose();
        setFile(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Upload Dokumen</DialogTitle>
                    <DialogDescription>
                        Upload dokumen untuk <strong>{documentType}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="file" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="file">Upload File</TabsTrigger>
                        <TabsTrigger value="folder">Upload Folder</TabsTrigger>
                    </TabsList>

                    <TabsContent value="file" className="space-y-4 py-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="file">File Dokumen</Label>
                            <Input id="file" type="file" onChange={handleFileChange} />
                            <p className="text-xs text-muted-foreground">
                                Format yang didukung: PDF, DOCX, XLSX (Max 10MB)
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="folder" className="space-y-4 py-4">
                        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 bg-muted/20">
                            <FolderUp className="h-10 w-10 text-muted-foreground mb-4" />
                            <p className="text-sm font-medium text-center">
                                Drag & drop folder disini atau klik untuk memilih
                            </p>
                            <Button variant="secondary" className="mt-4">
                                Pilih Folder
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button onClick={handleUpload} disabled={!file}>
                        Upload
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
