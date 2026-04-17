'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ShieldCheck,
    Eye,
    EyeOff,
    Loader2,
    Lock,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import { updateAdminPassword } from '../../services/adminProfileService';
import { toast } from 'sonner';

interface ChangePasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
    open,
    onOpenChange,
}) => {
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const togglePasswordVisibility = (key: keyof typeof showPasswords) => {
        setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        // Clear error when typing
        if (errors[id]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await updateAdminPassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            });

            toast.success('Kata sandi berhasil diperbarui');
            onOpenChange(false);
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error: unknown) {
            console.error('Password update error:', error);
            const err = error as { errors?: Record<string, string[]>; message?: string };
            if (err.errors) {
                setErrors(err.errors);
            }
            toast.error(err.message || 'Gagal memperbarui kata sandi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                <div className="bg-slate-900 p-6 text-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Lock className="w-24 h-24" />
                    </div>
                    <DialogHeader className="relative z-10 text-left">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                <ShieldCheck className="h-5 w-5 text-white" />
                            </div>
                            <DialogTitle className="text-xl font-bold text-white">
                                Perbarui Kata Sandi
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-slate-400 text-sm leading-relaxed">
                            Pastikan kata sandi baru Anda kuat dan aman untuk melindungi akses administratif.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="currentPassword"
                                className="text-slate-700 font-medium"
                            >
                                Kata Sandi Saat Ini
                            </Label>
                            <div className="relative group">
                                <Input
                                    id="currentPassword"
                                    type={
                                        showPasswords.current
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Masukkan kata sandi lama"
                                    className="pr-10 h-11 border-slate-200 focus:ring-slate-900 rounded-xl"
                                    value={formData.currentPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        togglePasswordVisibility('current')
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPasswords.current ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.currentPassword[0]}
                                </p>
                            )}
                        </div>

                        <div className="h-px bg-slate-100 my-2" />

                        <div className="space-y-2">
                            <Label
                                htmlFor="newPassword"
                                className="text-slate-700 font-medium"
                            >
                                Kata Sandi Baru
                            </Label>
                            <div className="relative group">
                                <Input
                                    id="newPassword"
                                    type={
                                        showPasswords.new ? 'text' : 'password'
                                    }
                                    placeholder="Masukkan kata sandi baru"
                                    className="pr-10 h-11 border-slate-200 focus:ring-slate-900 rounded-xl"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        togglePasswordVisibility('new')
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPasswords.new ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.newPassword[0]}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="confirmPassword"
                                className="text-slate-700 font-medium"
                            >
                                Konfirmasi Kata Sandi Baru
                            </Label>
                            <div className="relative group">
                                <Input
                                    id="confirmPassword"
                                    type={
                                        showPasswords.confirm
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Ulangi kata sandi baru"
                                    className="pr-10 h-11 border-slate-200 focus:ring-slate-900 rounded-xl"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        togglePasswordVisibility('confirm')
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPasswords.confirm ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.confirmPassword[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl space-y-2 mb-2">
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Kriteria Keamanan
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                <CheckCircle2 className="h-3 w-3 text-slate-300" />
                                Minimal 8 karakter
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                <CheckCircle2 className="h-3 w-3 text-slate-300" />
                                Kombinasi huruf besar, kecil, dan angka
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="h-11 rounded-xl w-full sm:w-auto"
                            disabled={loading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-8 flex-1"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                'Simpan Perubahan'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
