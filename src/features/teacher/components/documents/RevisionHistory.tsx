import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RevisionHistoryProps {
    isOpen: boolean;
    onClose: () => void;
    documentType: string;
}

export const RevisionHistory: React.FC<RevisionHistoryProps> = ({
    isOpen,
    onClose,
    documentType,
}) => {
    // Mock data
    const history = [
        {
            version: "v1.2",
            date: "2024-01-15 10:30",
            uploadedBy: "Anda",
            status: "Disetujui",
            file: "CP_Matematika_v1.2.pdf",
        },
        {
            version: "v1.1",
            date: "2024-01-10 14:20",
            uploadedBy: "Anda",
            status: "Revisi",
            file: "CP_Matematika_v1.1.pdf",
        },
        {
            version: "v1.0",
            date: "2024-01-05 09:00",
            uploadedBy: "Anda",
            status: "Draft",
            file: "CP_Matematika_v1.0.pdf",
        },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Riwayat Revisi</DialogTitle>
                    <DialogDescription>
                        Riwayat perubahan dokumen <strong>{documentType}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="rounded-md border mt-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Versi</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.version}</TableCell>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                item.status === "Disetujui" ? "default" :
                                                    item.status === "Revisi" ? "destructive" : "secondary"
                                            }
                                            className={item.status === "Disetujui" ? "bg-green-600" : ""}
                                        >
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="ghost" size="icon" title="Lihat">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" title="Download">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
};
