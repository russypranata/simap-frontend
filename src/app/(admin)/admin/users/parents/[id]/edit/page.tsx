'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, Save, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useParentList, useParentDetail } from '@/features/admin/hooks/useParentList';

const schema = z.object({
    name:       z.string().min(3, 'Nama minimal 3 karakter'),
    email:      z.string().email('Email tidak valid'),
    username:   z.string().min(3),
    password:   z.string().min(8).optional().or(z.literal('')),
    phone:      z.string().optional(),
    address:    z.string().optional(),
    occupation: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-100 shrink-0"><span className="h-5 w-5 block [&>svg]:h-5 [&>svg]:w-5 text-blue-700">{icon}</span></div>
        <div><CardTitle className="text-lg font-semibold text-slate-800">{title}</CardTitle><CardDescription className="text-sm text-slate-600 mt-0.5">{description}</CardDescription></div>
    </div>
);

export default function EditParentPage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const { updateParent, isUpdating } = useParentList();
    const { data: parent, isLoading, isError } = useParentDetail(id);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { name: '', email: '', username: '', password: '', phone: '', address: '', occupation: '' },
    });

    useEffect(() => {
        if (parent) {
            form.reset({
                name:       parent.name,
                email:      parent.email,
                username:   parent.username,
                password:   '',
                phone:      parent.phone ?? '',
                address:    parent.address ?? '',
                occupation: parent.occupation ?? '',
            });
        }
    }, [parent, form]);

    const onSubmit = async (values: FormValues) => {
        const clean = (v: string | undefined) => v === '' ? undefined : v;
        await updateParent({ id, data: { ...values, password: clean(values.password), phone: clean(values.phone), address: clean(values.address), occupation: clean(values.occupation) } });
        router.push('/admin/users/parents');
    };

    if (isLoading) return (
        <div className="space-y-6">
            <div className="space-y-2"><Skeleton className="h-9 w-64" /><Skeleton className="h-4 w-48" /></div>
            <Card><CardContent className="pt-6 space-y-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</CardContent></Card>
        </div>
    );

    if (isError || !parent) return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <AlertCircle className="h-12 w-12 text-red-400" />
            <p className="text-slate-600 font-medium">Data wali murid tidak ditemukan</p>
            <Button variant="outline" onClick={() => router.push('/admin/users/parents')}><ArrowLeft className="h-4 w-4 mr-2" />Kembali</Button>
        </div>
    );

    return (
        <div className="space-y-6 pb-6">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Edit </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Wali Murid</span>
                    </h1>
                    <div className="p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200"><Users className="h-5 w-5" /></div>
                </div>
                <p className="text-muted-foreground mt-1">Perbarui informasi wali murid.</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3"><SectionHeader icon={<Users />} title="Data Akun" description="Informasi akun wali murid" /></CardHeader>
                        <CardContent className="space-y-5">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Nama Lengkap <span className="text-red-500">*</span></FormLabel>
                                    <FormControl><Input placeholder="Nama lengkap" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem><FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                                        <FormControl><Input type="email" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="username" render={({ field }) => (
                                    <FormItem><FormLabel>Username <span className="text-red-500">*</span></FormLabel>
                                        <FormControl><Input autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem><FormLabel>No. Handphone</FormLabel>
                                        <FormControl><Input placeholder="08xxxxxxxxxx" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem><FormLabel>Password <span className="text-slate-400 font-normal text-xs ml-1">(kosongkan jika tidak diubah)</span></FormLabel>
                                        <FormControl><Input type="password" placeholder="••••••••" autoComplete="new-password" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="occupation" render={({ field }) => (
                                    <FormItem><FormLabel>Pekerjaan</FormLabel>
                                        <FormControl><Input placeholder="Pekerjaan" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem><FormLabel>Alamat</FormLabel>
                                    <FormControl><Textarea placeholder="Alamat lengkap..." className="resize-none h-20" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </CardContent>
                    </Card>
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => router.push('/admin/users/parents')} disabled={isUpdating}><ArrowLeft className="h-4 w-4 mr-2" />Batal</Button>
                        <Button type="submit" className="bg-blue-800 hover:bg-blue-900 text-white min-w-[160px]" disabled={isUpdating}>
                            {isUpdating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : <><Save className="mr-2 h-4 w-4" />Simpan Perubahan</>}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
