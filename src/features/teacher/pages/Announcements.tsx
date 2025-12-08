'use client';

import React, { useState, useMemo } from 'react';
import {
  Megaphone,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  Calendar,
  FileText,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// --- Types ---
type AnnouncementType = 'umum' | 'akademik' | 'kelulusan' | 'administrasi-guru';
type TargetRole = 'guru' | 'wali_kelas' | 'semua';

interface Announcement {
  id: string;
  title: string;
  content: string; // Rich text / HTML string
  summary: string; // Short version for card
  type: AnnouncementType;
  tanggal_rilis: string; // ISO Date
  lampiran: { name: string; url: string; size: string }[];
  target_role: TargetRole;
  status_dibaca: boolean;
  tahun_ajaran: string;
  author: string;
}

// --- Mock Data ---
const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Rapat Persiapan Ujian Akhir Semester Ganjil',
    content: `<p>Diberitahukan kepada seluruh Bapak/Ibu Guru, bahwa rapat persiapan UAS Ganjil akan dilaksanakan pada:</p>
              <ul>
                <li>Hari/Tanggal: Senin, 12 Desember 2025</li>
                <li>Waktu: 09.00 WIB - Selesai</li>
                <li>Tempat: Ruang Guru</li>
              </ul>
              <p>Mohon kehadirannya tepat waktu. Terima kasih.</p>`,
    summary: 'Undangan rapat persiapan UAS Ganjil untuk seluruh guru.',
    type: 'akademik',
    tanggal_rilis: '2025-12-05T08:00:00',
    lampiran: [
      { name: 'Undangan_Rapat.pdf', url: '#', size: '1.2 MB' },
      { name: 'Agenda_Rapat.docx', url: '#', size: '500 KB' }
    ],
    target_role: 'guru',
    status_dibaca: false,
    tahun_ajaran: '2025/2026',
    author: 'Kepala Sekolah'
  },
  {
    id: '2',
    title: 'Jadwal Libur Semester Ganjil',
    content: `<p>Berdasarkan Kalender Pendidikan Tahun Ajaran 2025/2026, libur semester ganjil akan dimulai pada tanggal 20 Desember 2025 sampai dengan 5 Januari 2026.</p>
              <p>Kegiatan belajar mengajar akan aktif kembali pada tanggal 6 Januari 2026.</p>`,
    summary: 'Informasi tanggal libur semester ganjil tahun ajaran 2025/2026.',
    type: 'umum',
    tanggal_rilis: '2025-12-01T10:00:00',
    lampiran: [],
    target_role: 'semua',
    status_dibaca: true,
    tahun_ajaran: '2025/2026',
    author: 'Tata Usaha'
  },
  {
    id: '3',
    title: 'Pengumpulan Nilai Rapor Siswa',
    content: `<p>Mengingatkan kembali kepada Bapak/Ibu Guru Wali Kelas untuk segera menyelesaikan input nilai rapor siswa paling lambat tanggal 15 Desember 2025.</p>
              <p>Mohon diperhatikan agar tidak terjadi keterlambatan pencetakan rapor.</p>`,
    summary: 'Batas akhir pengumpulan input nilai rapor siswa.',
    type: 'administrasi-guru',
    tanggal_rilis: '2025-11-28T09:30:00',
    lampiran: [
      { name: 'Panduan_Input_Nilai.pdf', url: '#', size: '2.5 MB' }
    ],
    target_role: 'guru',
    status_dibaca: false,
    tahun_ajaran: '2025/2026',
    author: 'Kurikulum'
  },
  {
    id: '4',
    title: 'Sosialisasi Kurikulum Merdeka',
    content: `<p>Akan diadakan sosialisasi mengenai update implementasi Kurikulum Merdeka untuk tingkat lanjut.</p>`,
    summary: 'Jadwal sosialisasi update Kurikulum Merdeka.',
    type: 'akademik',
    tanggal_rilis: '2025-11-20T13:00:00',
    lampiran: [],
    target_role: 'guru',
    status_dibaca: true,
    tahun_ajaran: '2025/2026',
    author: 'Kurikulum'
  },
  {
    id: '5',
    title: 'Update Data Guru di Dapodik',
    content: `<p>Mohon Bapak/Ibu guru segera melakukan pengecekan dan pembaruan data pribadi di aplikasi Dapodik sebelum akhir bulan ini.</p>`,
    summary: 'Pemberitahuan pembaruan data Dapodik.',
    type: 'administrasi-guru',
    tanggal_rilis: '2025-11-15T08:00:00',
    lampiran: [],
    target_role: 'guru',
    status_dibaca: true,
    tahun_ajaran: '2025/2026',
    author: 'Operator Sekolah'
  },
  {
    id: '6',
    title: 'Pengumuman Kelulusan Kelas XII',
    content: `<p>Berita acara rapat pleno kelulusan kelas XII.</p>`,
    summary: 'Hasil rapat pleno kelulusan siswa kelas XII.',
    type: 'kelulusan',
    tanggal_rilis: '2025-05-05T10:00:00',
    lampiran: [
      { name: 'SK_Kelulusan.pdf', url: '#', size: '3.1 MB' }
    ],
    target_role: 'guru',
    status_dibaca: true,
    tahun_ajaran: '2024/2025',
    author: 'Kepala Sekolah'
  }
];

// --- Components ---

const AnnouncementCard = ({
  item,
  onClick
}: {
  item: Announcement;
  onClick: (item: Announcement) => void;
}) => {

  const getTypeConfig = (type: AnnouncementType) => {
    switch (type) {
      case 'umum': return { color: 'bg-emerald-100 text-emerald-600', icon: Megaphone, label: 'Umum', border: 'border-emerald-200' };
      case 'akademik': return { color: 'bg-blue-100 text-blue-600', icon: Calendar, label: 'Akademik', border: 'border-blue-200' };
      case 'kelulusan': return { color: 'bg-purple-100 text-purple-600', icon: CheckCircle, label: 'Kelulusan', border: 'border-purple-200' };
      case 'administrasi-guru': return { color: 'bg-amber-100 text-amber-600', icon: FileText, label: 'Admin Guru', border: 'border-amber-200' };
      default: return { color: 'bg-gray-100 text-gray-600', icon: Megaphone, label: 'Umum', border: 'border-gray-200' };
    }
  };

  const config = getTypeConfig(item.type);
  const Icon = config.icon;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => onClick(item)}>
      <CardContent className="p-5">
        <div className="flex gap-5">
          {/* Icon Box */}
          <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center ${config.color} ${config.border} border bg-opacity-50`}>
            <Icon className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex justify-between items-start gap-2 mb-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={`text-[10px] px-2 py-0.5 h-5 font-medium ${config.color} bg-opacity-10 border-none`}>
                    {config.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    • <Calendar className="w-3.5 h-3.5" /> {new Date(item.tanggal_rilis).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {item.title}
                </h3>
              </div>

              {/* Status Badge */}
              {!item.status_dibaca && (
                <div className="flex flex-col items-end gap-1">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
              {item.summary}
            </p>

            {/* Footer Info */}
            <div className="flex items-center justify-between border-t pt-3 border-dashed">
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary/70" />
                  {item.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-500/70" />
                  {new Date(item.tanggal_rilis).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                </span>
              </div>

              <div className="flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                Baca Selengkapnya <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Main Page Component ---
export const Announcements: React.FC = () => {
  const [data, setData] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [selectedYear, setSelectedYear] = useState('2025/2026');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Announcement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 5;

  // -- Handlers --
  const handleOpenDetail = (item: Announcement) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleMarkAsRead = (id: string, isReading: boolean = true) => {
    setData(prev => prev.map(item =>
      item.id === id ? { ...item, status_dibaca: true } : item
    ));
    if (isReading) {
      toast.success("Pengumuman ditandai sudah dibaca");
      if (selectedItem?.id === id) {
        setSelectedItem(prev => prev ? { ...prev, status_dibaca: true } : null);
      }
    }
  };

  const handleCloseModal = () => {
    // Auto mark as read when closing? Or explicit button? 
    // User requirement says: Button: "Tandai Sudah Dibaca" inside modal.
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // -- Filtering Logic --
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Filter by Year
      if (selectedYear && item.tahun_ajaran !== selectedYear) return false;

      // Filter by Type
      if (selectedType !== 'all' && item.type !== selectedType) return false;

      // Filter by Status
      if (selectedStatus === 'unread' && item.status_dibaca) return false;
      if (selectedStatus === 'read' && !item.status_dibaca) return false;

      // Filter by Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [data, selectedYear, selectedType, selectedStatus, searchQuery]);

  // -- Pagination Logic --
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background space-y-6">

      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Manajemen <span className="text-primary">Pengumuman</span>
          </h1>
          <p className="text-muted-foreground">
            Kelola dan lihat pengumuman terkini dari sekolah
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-semibold">Tahun Ajaran 2025/2026</span>
            </div>
            <div className="h-4 w-[1px] bg-border" />
            <span className="text-muted-foreground text-sm font-medium text-primary">Semester Ganjil</span>
          </div>
        </div>
      </div>

      {/* 2. Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Filter className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Filter Pengumuman</CardTitle>
                <CardDescription>
                  Filter pengumuman berdasarkan kriteria tertentu
                </CardDescription>
              </div>
            </div>
            {/* Active Filter Badges */}
            {(selectedYear !== '2025/2026' || selectedType !== 'all' || selectedStatus !== 'all' || searchQuery) && (
              <div className="hidden md:flex flex-wrap gap-2">
                {selectedYear !== '2025/2026' && (
                  <Badge variant="outline" className="text-xs">
                    📅 {selectedYear}
                  </Badge>
                )}
                {selectedType !== 'all' && (
                  <Badge variant="outline" className="text-xs capitalize">
                    🏷️ {selectedType.replace('-', ' ')}
                  </Badge>
                )}
                {selectedStatus !== 'all' && (
                  <Badge variant="outline" className="text-xs">
                    {selectedStatus === 'unread' ? '🔴 Belum Dibaca' : '🟢 Sudah Dibaca'}
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="outline" className="text-xs">
                    🔍 "{searchQuery}"
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setSelectedYear('2025/2026');
                    setSelectedType('all');
                    setSelectedStatus('all');
                    setSearchQuery('');
                  }}
                >
                  Reset
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Tahun Ajaran */}
            <div className="space-y-2">
              <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Tahun Ajaran</span>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Tahun Ajaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025/2026">2025/2026</SelectItem>
                  <SelectItem value="2024/2025">2024/2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipe Pengumuman */}
            <div className="space-y-2">
              <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Tipe Pengumuman</span>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipe Pengumuman" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="umum">Umum</SelectItem>
                  <SelectItem value="akademik">Akademik</SelectItem>
                  <SelectItem value="kelulusan">Kelulusan</SelectItem>
                  <SelectItem value="administrasi-guru">Administrasi Guru</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Status</span>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="unread">Belum Dibaca</SelectItem>
                  <SelectItem value="read">Sudah Dibaca</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Pencarian</span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari judul..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Announcement List */}
      <div className="space-y-4">
        {paginatedData.length > 0 ? (
          paginatedData.map(item => (
            <AnnouncementCard
              key={item.id}
              item={item}
              onClick={handleOpenDetail}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
            <Megaphone className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-medium text-foreground">Tidak ada pengumuman</h3>
            <p className="text-muted-foreground text-sm">Coba sesuaikan filter pencarian Anda.</p>
          </div>
        )}
      </div>

      {/* 4. Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Modal Detail */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0 gap-0">
          {selectedItem && (
            <>
              <DialogHeader className="p-6 pb-4 border-b">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("capitalize font-normal w-fit",
                      selectedItem.type === 'umum' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                        selectedItem.type === 'akademik' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          selectedItem.type === 'kelulusan' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            'bg-orange-50 text-orange-700 border-orange-200'
                    )}>
                      {selectedItem.type.replace('-', ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(selectedItem.tanggal_rilis).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(selectedItem.tanggal_rilis).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                  </div>
                  <DialogTitle className="text-2xl font-bold leading-tight">
                    {selectedItem.title}
                  </DialogTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Dari: <b>{selectedItem.author}</b></span>
                    <span>•</span>
                    <span>Untuk: <b className="capitalize">{selectedItem.target_role.replace('_', ' ')}</b></span>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className="flex-1 p-6">
                <div className="prose prose-sm prose-blue max-w-none text-foreground/90 leading-relaxed space-y-4">
                  {/* Simulating HTML render */}
                  <div dangerouslySetInnerHTML={{ __html: selectedItem.content }} />
                </div>

                {/* Attachments Section */}
                {selectedItem.lampiran.length > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Lampiran
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedItem.lampiran.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors group">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 rounded-lg bg-red-100/50 flex items-center justify-center flex-shrink-0 text-red-600">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">{file.name}</span>
                              <span className="text-xs text-muted-foreground">{file.size}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ScrollArea>

              <DialogFooter className="p-4 border-t bg-muted/10 gap-2 sm:gap-0">
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status:</span>
                  {selectedItem.status_dibaca ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex gap-1">
                      <CheckCircle className="w-3 h-3" /> Sudah Dibaca
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      Belum Dibaca
                    </Badge>
                  )}
                </div>

                {!selectedItem.status_dibaca && (
                  <Button onClick={() => handleMarkAsRead(selectedItem.id)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Tandai Sudah Dibaca
                  </Button>
                )}
                <Button variant="outline" onClick={handleCloseModal}>
                  Tutup
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};