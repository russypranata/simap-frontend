'use client';

import React, { useState } from 'react';
import {
    Shield,
    Search,
    Filter,
    MoreVertical,
    Plus,
    User,
    Lock,
    Ban,
    CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MOCK_USERS } from '../data/mockUserData';
import { UserAccount, UserRole, UserStatus } from '../types/user';
import { UserForm } from '../components/forms/UserForm';
import { UserFormValues } from '../schemas/userSchema';
import { toast } from 'sonner';

const roleColors: Record<UserRole, string> = {
    admin: 'bg-purple-100 text-purple-700 border-purple-200',
    teacher: 'bg-blue-100 text-blue-700 border-blue-200',
    student: 'bg-green-100 text-green-700 border-green-200',
    parent: 'bg-orange-100 text-orange-700 border-orange-200',
    staff: 'bg-slate-100 text-slate-700 border-slate-200',
};

const statusColors: Record<UserStatus, string> = {
    active: 'bg-green-50 text-green-700 border-green-200',
    inactive: 'bg-slate-50 text-slate-700 border-slate-200',
    suspended: 'bg-red-50 text-red-700 border-red-200',
};

export const UserManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<UserAccount[]>(MOCK_USERS);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = (values: UserFormValues) => {
        const newItem: UserAccount = {
            id: `usr-${Date.now()}`,
            ...values,
            lastLogin: '-',
            createdAt: new Date().toISOString(),
        };
        setData([newItem, ...data]);
        toast.success('Pengguna berhasil ditambahkan');
    };

    const handleUpdate = (values: UserFormValues) => {
        if (!editingId) return;
        setData(prev => prev.map(item => item.id === editingId ? { ...item, ...values } : item));
        toast.success('Data pengguna diperbarui');
        setEditingId(null);
    };

    const handleDelete = (id: string) => {
        if (confirm('Nonaktifkan pengguna ini?')) {
            setData(prev => prev.map(item => item.id === id ? { ...item, status: 'inactive' } : item));
            toast.success('Pengguna dinonaktifkan');
        }
    };

    const openEdit = (item: UserAccount) => {
        setEditingId(item.id);
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Manajemen{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Pengguna
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Shield className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola akun pengguna, hak akses, dan status login.
                    </p>
                </div>
                <Button
                    onClick={() => { setEditingId(null); setIsFormOpen(true); }}
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Pengguna
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Daftar Pengguna Sistem
                                </CardTitle>
                                <CardDescription>
                                    Total {data.length} akun terdaftar
                                </CardDescription>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama, username, atau email..."
                                className="pl-9 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="w-[100px]">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto border-t border-slate-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">User Info</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Terakhir Login</th>
                                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                                    <User className="h-8 w-8 text-slate-300" />
                                                </div>
                                                <p className="text-slate-500 font-medium">Data tidak ditemukan</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{item.name}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">@{item.username} • {item.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={`capitalize font-normal ${roleColors[item.role]}`}>
                                                    {item.role}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={`capitalize font-normal ${statusColors[item.status]}`}>
                                                    {item.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {item.lastLogin !== '-' ? new Date(item.lastLogin).toLocaleString('id-ID') : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEdit(item)}>
                                                            Edit Data
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Lock className="h-3.5 w-3.5 mr-2" /> Reset Password
                                                        </DropdownMenuItem>
                                                        {item.status === 'active' ? (
                                                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(item.id)}>
                                                                <Ban className="h-3.5 w-3.5 mr-2" /> Nonaktifkan
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem className="text-green-600">
                                                                <CheckCircle className="h-3.5 w-3.5 mr-2" /> Aktifkan
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <UserForm
                open={isFormOpen}
                onOpenChange={(open) => {
                    setIsFormOpen(open);
                    if (!open) setEditingId(null);
                }}
                initialData={editingId ? data.find(d => d.id === editingId) : null}
                onSubmit={editingId ? handleUpdate : handleCreate}
            />
        </div>
    );
};
