'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, Save, Loader2, ArrowLeft, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useParentList } from '@/features/admin/hooks/useParentList';
import { useEffect } from 'react';

const schema = z.object({
    name:       z.string().min(3, 'Nama minimal 3 karakter'),
    email:      z.string().email('Email tidak valid'),
    username:   z.string().min(3).regex(/^[a-z0-9._]+$/),
    password:   z.string().min(8, 'Password minimal 8 karakter'),
    phone:      z.string().optional(),
    address:    z.string().optional(),
    occupation: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const generateUsername = (name: string) =>
    name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).filter(Boolean).join('.');

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-100 shrink-0"><span className="h-5 w-5 block [&>svg]:h-5 [&>svg]:w-5 text-blue-700">{icon}</span></div>
        <div><CardTitle className="text-lg font-semibold text-slate-800">{title}</CardTitle><CardDescription className="text-sm text-slate-600 mt-0.5">{description}</CardDescription></div>
    </div>
);

export default function NewParentPage() {
    const router = useRouter();
    const { createParent, isCreating } = useParentList();
    const [usernameEdited, setUsernameEdited] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { name: '', email: '', username: '', password: '', phone: '', address: '', occupation: '' },
    });

    const watchedName = useWatch({ control: form.control, name: 'name' }) as string;
    useEffect(() => {
        if (!usernameEdited && watchedName) {
            const g = generateUsername(watchedName);
            if (g) form.setValue('username', g, { shouldValidate: false });
        }
    }, [watchedName, usernameEdited, form]);

    const onSubmit = async (values: FormValues) => {
        const clean = (v: string | undefined) => v === '' ? undefined : v;
        await createParent({ ...values, phone: clean(values.phone), address: clean(values.address), occupation: clean(values.occupation) });
        router.push('/admin/users/parents');
    };

    return (
        <div className="space-y-6 pb-6">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Tambah </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Wali Murid</span>
                    </h1>
                    <div className="p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200"><Users className="h-5 w-5" /></div>
                </div>
                <p className="text-muted-foreground mt-1">Tambahkan akun wali murid baru ke sistem.</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3"><SectionHeader icon={<Users />} title="Data Akun" description="Kredensial login wali murid" /></CardHeader>
                        <CardContent className="space-y-5">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Nama Lengkap <span className="text-red-500">*</span></FormLabel>
                                    <FormControl><Input placeholder="Nama lengkap wali murid" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem><FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                                        <FormControl><Input type="email" placeholder="email@sekolah.id" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="username" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username <span className="text-red-500">*</span>
                                            {!usernameEdited && <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-blue-600 font-normal"><Wand2 className="h-3 w-3" />auto</span>}
                                        </FormLabel>
                                        <FormControl><Input placeholder="nama.wali" autoComplete="off" {...field} onChange={(e) => { field.onChange(e); setUsernameEdited(true); }} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem><FormLabel>No. Handphone</FormLabel>
                                        <FormControl><Input placeholder="08xxxxxxxxxx" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem><FormLabel>Password <span className="text-red-500">*</span></FormLabel>
                                        <FormControl><Input type="password" placeholder="Min. 8 karakter" autoComplete="new-password" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="occupation" render={({ field }) => (
                                    <FormItem><FormLabel>Pekerjaan</FormLabel>
                                        <FormControl><Input placeholder="Pekerjaan wali murid" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem><FormLabel>Alamat</FormLabel>
                                    <FormControl><Textarea placeholder="Alamat lengkap..." className="resize-none h-20" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </CardContent>
                    </Card>
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => router.push('/admin/users/parents')} disabled={isCreating}><ArrowLeft className="h-4 w-4 mr-2" />Batal</Button>
                        <Button type="submit" className="bg-blue-800 hover:bg-blue-900 text-white min-w-[160px]" disabled={isCreating}>
                            {isCreating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : <><Save className="mr-2 h-4 w-4" />Tambah Wali Murid</>}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
