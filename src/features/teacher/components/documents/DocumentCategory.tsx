import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, History, File, Folder } from "lucide-react";
import { DocumentUploadModal } from "./DocumentUploadModal";
import { RevisionHistory } from "./RevisionHistory";

interface DocumentCategoryProps {
    title: string;
    description: string;
    documentTypes: string[];
}

export const DocumentCategory: React.FC<DocumentCategoryProps> = ({
    title,
    description,
    documentTypes,
}) => {
    const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Mock state for uploaded files (in a real app, this would come from an API)
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, boolean>>({
        "Capaian Pembelajaran (CP)": true,
        "Alur Tujuan Pembelajaran (ATP)": true,
    });

    const handleUploadClick = (docType: string) => {
        setSelectedDocType(docType);
        setIsUploadOpen(true);
    };

    const handleHistoryClick = (docType: string) => {
        setSelectedDocType(docType);
        setIsHistoryOpen(true);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTypes.map((docType, index) => (
                    <Card key={index} className="h-full flex flex-col hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3 flex-1">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                {uploadedFiles[docType] ? (
                                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                        Sudah Upload
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-muted-foreground">
                                        Belum Upload
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className="mt-4 text-lg">{docType}</CardTitle>
                            <CardDescription className="line-clamp-2">
                                Dokumen {docType} untuk tahun ajaran ini.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-2">
                                <Button
                                    className="flex-1"
                                    variant="outline"
                                    onClick={() => handleUploadClick(docType)}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleHistoryClick(docType)}
                                    title="Riwayat Revisi"
                                >
                                    <History className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <DocumentUploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                documentType={selectedDocType || ""}
            />

            <RevisionHistory
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                documentType={selectedDocType || ""}
            />
        </>
    );
};
