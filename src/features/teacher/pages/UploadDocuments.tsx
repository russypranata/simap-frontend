"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploadButton } from "@/features/shared/components/FileUploadButton";
import { useTeacherData } from "../hooks/useTeacherData";
import type { Document } from "../types/teacher";
import {
  formatDate,
  formatTime,
  getRelativeTime,
} from "@/features/shared/utils/dateFormatter";
import {
  FileText,
  Upload,
  Download,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  Eye,
  Trash2,
  Plus,
  FileCheck,
  FolderOpen,
  Settings,
  BarChart3,
  TrendingUp,
  Calendar,
  User,
} from "lucide-react";
import { toast } from "sonner";

export const UploadDocuments: React.FC = () => {
  const {
    loading,
    error,
    documents,
    fetchDocuments,
    uploadDocument,
    clearError,
  } = useTeacherData();


  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("upload");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Document types with descriptions
  const documentTypes = [
    {
      id: "CP",
      name: "Capaian Pembelajaran",
      description: "Capaian pembelajaran yang harus dicapai siswa",
      category: "planning",
      required: true,
    },
    {
      id: "ATP",
      name: "Alur Tujuan Pembelajaran",
      description: "Alur tujuan pembelajaran untuk mencapai CP",
      category: "planning",
      required: true,
    },
    {
      id: "Modul Ajar",
      name: "Modul Ajar",
      description: "Modul pembelajaran untuk siswa",
      category: "teaching",
      required: true,
    },
    {
      id: "Prota",
      name: "Program Tahunan",
      description: "Program tahunan pembelajaran",
      category: "planning",
      required: true,
    },
    {
      id: "Prosem",
      name: "Program Semester",
      description: "Program semester pembelajaran",
      category: "planning",
      required: true,
    },
    {
      id: "Analisis Alokasi Waktu",
      name: "Analisis Alokasi Waktu",
      description: "Analisis alokasi waktu efektif",
      category: "planning",
      required: true,
    },
    {
      id: "KKTP",
      name: "Kriteria Ketuntasan Minimal",
      description: "Kriteria ketuntasan minimal pembelajaran",
      category: "planning",
      required: true,
    },
    {
      id: "Kisi-Kisi Soal",
      name: "Kisi-Kisi Soal",
      description: "Kisi-kisi soal penilaian",
      category: "assessment",
      required: true,
    },
    {
      id: "Analisis Asesmen",
      name: "Analisis Asesmen",
      description: "Analisis hasil asesmen pembelajaran",
      category: "assessment",
      required: true,
    },
    {
      id: "Jurnal Refleksi",
      name: "Jurnal Refleksi",
      description: "Jurnal refleksi guru",
      category: "reflection",
      required: true,
    },
    {
      id: "Dokumen PKB",
      name: "Dokumen PKB",
      description: "Dokumen Pengembangan Keprofesian Berkelanjutan",
      category: "development",
      required: true,
    },
    {
      id: "Daya Serap",
      name: "Daya Serap",
      description: "Analisis daya serap siswa",
      category: "assessment",
      required: true,
    },
  ];

  const documentCategories = [
    { id: "all", name: "Semua Kategori" },
    { id: "planning", name: "Perencanaan" },
    { id: "teaching", name: "Pembelajaran" },
    { id: "assessment", name: "Penilaian" },
    { id: "reflection", name: "Refleksi" },
    { id: "development", name: "Pengembangan" },
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchDocuments();
      toast.success("Data dokumen berhasil diperbarui!");
    } catch (error) {
      toast.error("Gagal memperbarui data dokumen");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUploadDocument = async (data: {
    name: string;
    type: string;
    description: string;
    file: File;
  }) => {
    try {
      await uploadDocument(data);
      toast.success("Dokumen berhasil diupload!");
      fetchDocuments();
    } catch (error) {
      toast.error("Gagal mengupload dokumen");
    }
  };

  const handleExportData = (format: "excel" | "pdf" | "csv") => {
    toast.success(
      `Data dokumen berhasil diunduh dalam format ${format.toUpperCase()}!`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || doc.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Get document statistics
  const getDocumentStats = () => {
    const total = documents.length;
    const uploaded = documents.filter(
      (doc) => doc.status === "approved"
    ).length;
    const pending = documents.filter((doc) => doc.status === "pending").length;
    const missing = documentTypes.length - uploaded;

    const categoryStats = documentCategories.slice(1).map((category) => ({
      category: category.name,
      total: documentTypes.filter((doc) => doc.category === category.id).length,
      uploaded: documents.filter(
        (doc) => documentTypes.find(dt => dt.id === doc.type && dt.category === category.id) && doc.status === "approved"
      ).length,
    }));

    return {
      total,
      uploaded,
      pending,
      missing,
      categoryStats,
      completionRate:
        total > 0 ? ((uploaded / documentTypes.length) * 100).toFixed(1) : "0",
    };
  };

  const stats = getDocumentStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Tersedia";
      case "pending":
        return "Menunggu Persetujuan";
      case "rejected":
        return "Ditolak";
      default:
        return "Tidak Diketahui";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upload Form Skeleton */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-5 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Upload Dokumen</h1>
          <p className="text-muted-foreground">
            Kelola dan upload dokumen pembelajaran dan administrasi
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>

          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Cetak</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dokumen</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Dokumen terupload</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tersedia</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.uploaded}
            </div>
            <p className="text-xs text-muted-foreground">Dokumen disetujui</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">
              Menunggu persetujuan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kelengkapan</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.completionRate}%
            </div>
            <p className="text-xs text-muted-foreground">Dokumen lengkap</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Dokumen</TabsTrigger>
          <TabsTrigger value="list">Daftar Dokumen</TabsTrigger>
          <TabsTrigger value="status">Status Dokumen</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* Upload Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Dokumen Baru</span>
              </CardTitle>
              <CardDescription>
                Upload dokumen pembelajaran dan administrasi yang diperlukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="document-type">Jenis Dokumen</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis dokumen" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((doc) => (
                          <SelectItem key={doc.id} value={doc.id}>
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  doc.required ? "bg-red-500" : "bg-gray-400"
                                }`}
                              />
                              <div>
                                <div className="font-medium">{doc.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {doc.category}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document-name">Nama Dokumen</Label>
                    <Input
                      id="document-name"
                      placeholder="Masukkan nama dokumen"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document-description">Deskripsi</Label>
                  <Textarea
                    id="document-description"
                    placeholder="Masukkan deskripsi dokumen"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>File Dokumen</Label>
                  <FileUploadButton
                    onFileSelect={(files: File[]) => {
                      if (files.length > 0) {
                        handleUploadDocument({
                          name: files[0].name,
                          type: "CP", // This would come from the select
                          description: "Dokumen pembelajaran",
                          file: files[0],
                        });
                      }
                    }}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    maxSize={10 * 1024 * 1024} // 10MB
                    multiple={false}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Required Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FolderOpen className="h-5 w-5" />
                <span>Dokumen yang Diperlukan</span>
              </CardTitle>
              <CardDescription>
                Daftar dokumen yang harus diupload guru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentTypes.map((docType) => {
                  const isUploaded = documents.some(
                    (doc) =>
                      doc.type === docType.id && doc.status === "approved"
                  );

                  return (
                    <div
                      key={docType.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            docType.required ? "bg-red-500" : "bg-gray-400"
                          }`}
                        />
                        <div>
                          <div className="font-medium text-sm">
                            {docType.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {docType.description}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {docType.category}
                        </Badge>
                        {isUploaded ? (
                          <Badge className="text-green-600 bg-green-50 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Tersedia
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-red-600 bg-red-50 border-red-200"
                          >
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Belum Upload
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari dokumen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="approved">Tersedia</SelectItem>
                      <SelectItem value="pending">Menunggu</SelectItem>
                      <SelectItem value="rejected">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {filteredDocuments.length} dari {documents.length}{" "}
                  dokumen
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportData("excel")}
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export Excel</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportData("pdf")}
                    className="flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Export PDF</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          {filteredDocuments.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Daftar Dokumen</span>
                </CardTitle>
                <CardDescription>
                  Daftar dokumen yang telah diupload
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium text-sm">
                          Nama Dokumen
                        </th>
                        <th className="text-left p-3 font-medium text-sm">
                          Jenis
                        </th>
                        <th className="text-left p-3 font-medium text-sm">
                          Kategori
                        </th>
                        <th className="text-left p-3 font-medium text-sm">
                          Ukuran
                        </th>
                        <th className="text-left p-3 font-medium text-sm">
                          Tanggal Upload
                        </th>
                        <th className="text-left p-3 font-medium text-sm">
                          Status
                        </th>
                        <th className="text-left p-3 font-medium text-sm">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="border-b hover:bg-muted/30">
                          <td className="p-3">
                            <div>
                              <div className="font-medium text-sm">
                                {doc.name}
                              </div>
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {doc.description}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-xs">
                              {doc.type}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant="secondary" className="text-xs">
                              {documentTypes.find(dt => dt.id === doc.type)?.category || 'N/A'}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm">
                            {formatFileSize(doc.fileSize)}
                          </td>
                          <td className="p-3 text-sm">
                            {formatDate(doc.uploadDate, "dd MMM yyyy")}
                          </td>
                          <td className="p-3">
                            <Badge className={getStatusColor(doc.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(doc.status)}
                                <span className="text-xs">
                                  {getStatusLabel(doc.status)}
                                </span>
                              </div>
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Belum Ada Dokumen
                </h3>
                <p className="text-muted-foreground text-center max-w-md mb-4">
                  {searchTerm ||
                  selectedCategory !== "all" ||
                  selectedStatus !== "all"
                    ? "Tidak ada dokumen yang cocok dengan filter yang dipilih."
                    : "Belum ada dokumen yang diupload. Mulai dengan mengupload dokumen pada tab Upload Dokumen."}
                </p>
                <Button onClick={() => setActiveTab("upload")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Dokumen
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          {/* Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Status per Kategori</span>
                </CardTitle>
                <CardDescription>
                  Status dokumen berdasarkan kategori
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.categoryStats.map((category) => (
                    <div
                      key={category.category}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {category.category}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {category.uploaded} dari {category.total} dokumen
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{
                              width: `${
                                (category.uploaded / category.total) * 100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {((category.uploaded / category.total) * 100).toFixed(
                            0
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Completion Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Status Kelengkapan</span>
                </CardTitle>
                <CardDescription>
                  Persentase kelengkapan dokumen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {stats.completionRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Dokumen Lengkap
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {stats.uploaded}
                      </div>
                      <div className="text-xs text-green-600">Tersedia</div>
                    </div>

                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {stats.pending}
                      </div>
                      <div className="text-xs text-yellow-600">Menunggu</div>
                    </div>

                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {stats.missing}
                      </div>
                      <div className="text-xs text-red-600">Belum Upload</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Status Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileCheck className="h-5 w-5" />
                <span>Detail Status Dokumen</span>
              </CardTitle>
              <CardDescription>
                Status lengkap untuk semua jenis dokumen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium text-sm">
                        Jenis Dokumen
                      </th>
                      <th className="text-left p-3 font-medium text-sm">
                        Kategori
                      </th>
                      <th className="text-left p-3 font-medium text-sm">
                        Status
                      </th>
                      <th className="text-left p-3 font-medium text-sm">
                        Tanggal Upload
                      </th>
                      <th className="text-left p-3 font-medium text-sm">
                        Ukuran
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentTypes.map((docType) => {
                      const doc = documents.find((d) => d.type === docType.id);
                      const status = doc?.status || "missing";

                      return (
                        <tr
                          key={docType.id}
                          className="border-b hover:bg-muted/30"
                        >
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  docType.required
                                    ? "bg-red-500"
                                    : "bg-gray-400"
                                }`}
                              />
                              <div>
                                <div className="font-medium text-sm">
                                  {docType.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {docType.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-xs">
                              {docType.category}
                            </Badge>
                          </td>
                          <td className="p-3">
                            {status === "missing" ? (
                              <Badge
                                variant="outline"
                                className="text-red-600 bg-red-50 border-red-200"
                              >
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Belum Upload
                              </Badge>
                            ) : (
                              <Badge className={getStatusColor(status)}>
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(status)}
                                  <span className="text-xs">
                                    {getStatusLabel(status)}
                                  </span>
                                </div>
                              </Badge>
                            )}
                          </td>
                          <td className="p-3 text-sm">
                            {doc
                              ? formatDate(doc.uploadDate, "dd MMM yyyy")
                              : "-"}
                          </td>
                          <td className="p-3 text-sm">
                            {doc ? formatFileSize(doc.fileSize) : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
