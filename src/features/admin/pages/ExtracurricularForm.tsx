'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Award, Save, Loader2, AlertCircle, Info, Users, ArrowLeft,
    UserCog, AlertTriangle, ArrowRightLeft,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { useExtracurricularList, useExtracurricularDetail, useTutorOptions } from '../hooks/useExtracurricular';

// ─── Schema ───────────────────────────────────────────────────────────────────

const formSchema = z.object({
    name:          z.string().min(3, 'Nama minimal 3 karakter'),
    tutor_user_id: z.number({ error: 'Tutor harus dipilih' }).min(1, 'Tutor harus dipilih'),
    nip:           z.string().optional(),
    join_date:     z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-100 shrink-0">
            <span className="h-5 w-5 block [&>svg]:h-5 [&>svg]:w-5 text-blue-700">{icon}</span>
        </div>
        <div>
            <CardTitle className="text-lg font-semibold text-slate-800">{title}</CardTitle>
            <CardDescription className="text-sm text-slate-600 mt-0.5">{description}</CardDescription>
        </div>
    </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const ExtracurricularForm: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const rawId = params?.id as string | undefined;
    const isEdit = !!rawId && rawId !== 'new';
    const ekskulId = isEdit ? Number(rawId) : null;

    const { createExtracurricular, updateExtracurricular, transferTutor, isCreating, isUpdating, isTransferring } = useExtracurricularList();
    const { data: detailData, isLoading: isLoadingDetail, isError: isDetailError } = useExtracurricularDetail(ekskulId);
    const { data: tutors = [], isLoading: isLoadingTutors } = useTutorOptions();

    const isSaving = isCreating || isUpdating;

    // Transfer tutor state
    const [newTutorId, setNewTutorId] = useState<number>(0);
    const [transferReason, setTransferReason] = useState('');
    const [showTransferConfirm, setShowTransferConfirm] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name:          '',
            tutor_user_id: 0,
            nip:           '',
            join_date:     '',
        },
    });

    // Populate form saat edit
    useEffect(() => {
        if (isEdit && detailData?.extracurricular) {
            const e = detailData.extracurricular;
            form.reset({
                name:          e.name,
                tutor_user_id: e.tutor_id,
                nip:           e.nip ?? '',
                join_date:     e.join_date ?? '',
            });
        }
    }, [isEdit, detailData, form]);

    const onSubmit = async (values: FormValues) => {
        const clean = (v: string | undefined) => (v === '' ? undefined : v);

        if (isEdit && ekskulId) {
            await updateExtracurricular({
                id: ekskulId,
                data: {
                    name:      values.name,
                    nip:       clean(values.nip),
                    join_date: clean(values.join_date),
                },
            });
        } else {
            await createExtracurricular({
                name:          values.name,
                tutor_user_id: values.tutor_user_id,
                nip:           clean(values.nip),
                join_date:     clean(values.join_date),
            });
        }
        router.push('/admin/extracurricular');
    };

    const handleTransferConfirm = async () => {
        if (!ekskulId || !newTutorId) return;
        await transferTutor({
            id: ekskulId,
            data: {
                new_tutor_user_id: newTutorId,
                reason: transferReason || undefined,
            },
        });
        setShowTransferConfirm(false);
        router.push('/admin/extracurricular');
    };

    const currentTutor = detailData?.extracurricular;
    const selectedNewTutor = tutors.find((t) => t.id === newTutorId);

    // ── Loading ──
    if (isEdit && isLoadingDetail) {
        return (
            <div className="space-y-6">
                <div className="space-y-2"><Skeleton className="h-9 w-64" /><Skeleton className="h-4 w-48" /></div>
                <Card><CardContent className="pt-6 space-y-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</CardContent></Card>
            </div>
        );
    }

    if (isEdit && isDetailError) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <AlertCircle className="h-12 w-12 text-red-400" />
                <p className="text-slate-600 font-medium">Data ekstrakurikuler tidak ditemukan</p>
                <Button variant="outline" onClick={() => router.push('/admin/extracurricular')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Daftar
                </Button>
            </div>
        );
    }

    // Tutors yang bisa dipilih untuk transfer (exclude tutor saat ini)
    const transferableTutors = tutors.filter((t) => t.id !== currentTutor?.tutor_id);

    return (
        <div className="space-y-6 pb-6">
            {/* ── Header ── */}
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                            {isEdit ? 'Edit ' : 'Tambah '}
                        </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                            Ekstrakurikuler
                        </span>
                    </h1>
                    <div className="p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                        <Award className="h-5 w-5" />
                    </div>
                </div>
                <p className="text-muted-foreground mt-1">
                    {isEdit ? 'Perbarui informasi ekstrakurikuler.' : 'Daftarkan kegiatan ekstrakurikuler baru.'}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* ── Card 1: Info Ekskul ── */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <SectionHeader icon={<Award />} title="Informasi Ekskul" description="Nama dan data dasar ekstrakurikuler" />
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Ekstrakurikuler <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: Pramuka, Basket, Paduan Suara" autoComplete="off" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* ── Card 2: Tutor ── */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <SectionHeader
                                icon={<Users />}
                                title="Data Tutor"
                                description={isEdit ? 'Tutor yang saat ini bertanggung jawab' : 'Tutor yang bertanggung jawab atas ekskul ini'}
                            />
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {/* Saat create: pilih tutor */}
                            {!isEdit && (
                                <FormField control={form.control} name="tutor_user_id" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tutor <span className="text-red-500">*</span></FormLabel>
                                        <Select
                                            onValueChange={(v) => field.onChange(Number(v))}
                                            value={field.value ? String(field.value) : ''}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={isLoadingTutors ? 'Memuat...' : 'Pilih tutor'} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {tutors.map((t) => (
                                                    <SelectItem key={t.id} value={String(t.id)}>
                                                        <div className="flex flex-col">
                                                            <span>{t.name}</span>
                                                            {t.extracurricular && (
                                                                <span className="text-xs text-slate-400">Ekskul: {t.extracurricular}</span>
                                                            )}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            )}

                            {/* Saat edit: tampilkan tutor saat ini (read-only) */}
                            {isEdit && currentTutor && (
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <Avatar className="h-10 w-10 border border-blue-200">
                                        <AvatarFallback className="bg-blue-100 text-blue-800 text-sm font-semibold">
                                            {(currentTutor.tutor_name ?? 'TT').split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900 text-sm">{currentTutor.tutor_name ?? '—'}</p>
                                        {currentTutor.nip && (
                                            <p className="text-xs text-slate-500 font-mono mt-0.5">NIP: {currentTutor.nip}</p>
                                        )}
                                    </div>
                                    <span className="text-xs text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded">Tutor Aktif</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField control={form.control} name="nip" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>NIP Tutor</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nomor Induk Pegawai" autoComplete="off" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="join_date" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tanggal Bergabung</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2.5">
                                <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-700">
                                    Jadwal kegiatan dikelola oleh tutor melalui halaman profil tutor masing-masing.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Card 3: Ganti Tutor (hanya saat edit) ── */}
                    {isEdit && (
                        <Card className="border-amber-200 shadow-sm bg-amber-50/30">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-amber-100 shrink-0">
                                        <span className="h-5 w-5 block [&>svg]:h-5 [&>svg]:w-5 text-amber-700">
                                            <UserCog />
                                        </span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-slate-800">Ganti Tutor</CardTitle>
                                        <CardDescription className="text-sm text-slate-600 mt-0.5">
                                            Alihkan tanggung jawab ekskul ke tutor lain. Semua data (anggota, jadwal, presensi) akan ikut dipindahkan.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Tutor Pengganti <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        value={newTutorId ? String(newTutorId) : ''}
                                        onValueChange={(v) => setNewTutorId(Number(v))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih tutor pengganti..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {transferableTutors.map((t) => (
                                                <SelectItem key={t.id} value={String(t.id)}>
                                                    <div className="flex flex-col">
                                                        <span>{t.name}</span>
                                                        {t.extracurricular && (
                                                            <span className="text-xs text-slate-400">
                                                                Saat ini: {t.extracurricular}
                                                            </span>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Alasan Penggantian <span className="text-slate-400 font-normal">(opsional)</span>
                                    </label>
                                    <Textarea
                                        placeholder="Contoh: Tutor lama mengundurkan diri, rotasi tugas, dll."
                                        className="resize-none h-20 bg-white"
                                        value={transferReason}
                                        onChange={(e) => setTransferReason(e.target.value)}
                                    />
                                </div>

                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5">
                                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-700">
                                        Tutor lama akan kehilangan akses ke ekskul ini. Semua data anggota, jadwal, dan riwayat presensi akan dipindahkan ke tutor baru.
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-amber-300 text-amber-800 hover:bg-amber-100"
                                    disabled={!newTutorId || isTransferring}
                                    onClick={() => setShowTransferConfirm(true)}
                                >
                                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                                    Ganti Tutor Sekarang
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* ── Actions ── */}
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => router.push('/admin/extracurricular')} disabled={isSaving}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Batal
                        </Button>
                        <Button type="submit" className="bg-blue-800 hover:bg-blue-900 text-white min-w-[160px]" disabled={isSaving}>
                            {isSaving ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</>
                            ) : isEdit ? (
                                <><Save className="mr-2 h-4 w-4" />Simpan Perubahan</>
                            ) : (
                                <><Award className="mr-2 h-4 w-4" />Tambah Ekskul</>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>

            {/* ── Transfer Confirmation Dialog ── */}
            <AlertDialog open={showTransferConfirm} onOpenChange={setShowTransferConfirm}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-4 mb-1">
                            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                <ArrowRightLeft className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <AlertDialogTitle className="text-lg">Konfirmasi Ganti Tutor</AlertDialogTitle>
                                <AlertDialogDescription className="mt-1">
                                    Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                            </div>
                        </div>
                        <div className="ml-16 space-y-2">
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <span className="font-medium">Dari:</span>
                                    <span>{currentTutor?.tutor_name ?? '—'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 mt-1">
                                    <span className="font-medium">Ke:</span>
                                    <span className="text-blue-700 font-semibold">{selectedNewTutor?.name ?? '—'}</span>
                                </div>
                            </div>
                            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-3">
                                ⚠️ Semua anggota, jadwal, dan riwayat presensi akan dipindahkan ke tutor baru.
                            </p>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-2">
                        <AlertDialogCancel disabled={isTransferring}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleTransferConfirm}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                            disabled={isTransferring}
                        >
                            {isTransferring ? (
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Memproses...</>
                            ) : (
                                'Ya, Ganti Tutor'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
