"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, KeyRound, AlertCircle, ShieldCheck, Check, X, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

// In a real app, this would call an API service
const mockUpdatePassword = async (data: any) => {
    return new Promise((resolve) => setTimeout(resolve, 1000));
};

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Kata sandi saat ini harus diisi"),
    newPassword: z.string()
        .min(8, "Kata sandi baru minimal 8 karakter")
        .regex(/[A-Z]/, "Kata sandi harus mengandung minimal 1 huruf besar")
        .regex(/[a-z]/, "Kata sandi harus mengandung minimal 1 huruf kecil")
        .regex(/[0-9]/, "Kata sandi harus mengandung minimal 1 angka"),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi harus diisi"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
}).refine((data) => data.newPassword !== data.currentPassword, {
    message: "Kata sandi baru harus berbeda dari kata sandi lama",
    path: ["newPassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-2 transition-colors ${met ? "text-green-600" : "text-slate-400"}`}>
        {met ? (
            <Check className="h-3.5 w-3.5" />
        ) : (
            <X className="h-3.5 w-3.5" />
        )}
        <span className={met ? "text-green-700" : ""}>{text}</span>
    </div>
);

export const ParentChangePassword: React.FC = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const form = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        mode: "onChange",
    });

    const newPassword = form.watch("newPassword") || "";

    const requirements = {
        minLength: newPassword.length >= 8,
        hasUppercase: /[A-Z]/.test(newPassword),
        hasLowercase: /[a-z]/.test(newPassword),
        hasNumber: /[0-9]/.test(newPassword),
    };

    const onSubmit = async (data: ChangePasswordFormValues) => {
        setIsLoading(true);
        setApiError(null);

        try {
            await mockUpdatePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            });

            toast.success(
                <div className="flex flex-col">
                    <span className="font-semibold">Kata sandi berhasil diubah</span>
                    <span className="text-sm text-muted-foreground">
                        Gunakan kata sandi baru untuk login berikutnya
                    </span>
                </div>
            );

            form.reset();
            // Optional: Redirect or just stay
        } catch (error) {
            setApiError("Gagal mengubah kata sandi. Silakan coba lagi.");
            toast.error("Gagal mengubah kata sandi");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Ubah{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Kata Sandi
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Lock className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Amankan akun Anda dengan menggunakan kata sandi yang kuat
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start gap-3">
                                <div className="flex items-center justify-center h-10 w-10 mt-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
                                    <KeyRound className="h-5 w-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <CardTitle className="text-lg font-semibold text-foreground">
                                        Form Perubahan Sandi
                                    </CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground">
                                        Masukkan kata sandi lama Anda dan buat kata sandi baru yang aman.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {apiError && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-red-700">{apiError}</p>
                                </div>
                            )}

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Kata Sandi Saat Ini</FormLabel>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            type={showCurrentPassword ? "text" : "password"}
                                                            placeholder="Masukkan kata sandi lama"
                                                            autoComplete="current-password"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        tabIndex={-1}
                                                    >
                                                        {showCurrentPassword ? (
                                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Kata Sandi Baru</FormLabel>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            type={showNewPassword ? "text" : "password"}
                                                            placeholder="Masukkan kata sandi baru"
                                                            autoComplete="new-password"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        tabIndex={-1}
                                                    >
                                                        {showNewPassword ? (
                                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Konfirmasi Kata Sandi Baru</FormLabel>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            placeholder="Ulangi kata sandi baru"
                                                            autoComplete="new-password"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        tabIndex={-1}
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end pt-4">
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-blue-800 hover:bg-blue-900 text-white"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="mr-2 h-4 w-4" />
                                                    Simpan Kata Sandi
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    {/* Password Requirements */}
                    <Card className="bg-blue-50/50 border-blue-100">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-blue-600" />
                                <CardTitle className="text-base font-semibold text-blue-900">
                                    Syarat Kata Sandi
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm bg-white p-3 rounded-md border border-blue-100/50">
                                <PasswordRequirement
                                    met={requirements.minLength}
                                    text="Minimal 8 karakter"
                                />
                                <PasswordRequirement
                                    met={requirements.hasUppercase}
                                    text="Minimal 1 huruf besar (A-Z)"
                                />
                                <PasswordRequirement
                                    met={requirements.hasLowercase}
                                    text="Minimal 1 huruf kecil (a-z)"
                                />
                                <PasswordRequirement
                                    met={requirements.hasNumber}
                                    text="Minimal 1 angka (0-9)"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Tips */}
                    <Card className="bg-amber-50/50 border-amber-100">
                        <CardHeader className="pb-3">
                             <div className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-600" />
                                <CardTitle className="text-base font-semibold text-amber-900">
                                    Tips Keamanan
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-amber-800 list-disc list-inside">
                                <li>Jangan gunakan tanggal lahir atau nama sebagai kata sandi.</li>
                                <li>Gunakan kombinasi karakter yang sulit ditebak.</li>
                                <li>Ubah kata sandi secara berkala (minimal 3 bulan sekali).</li>
                                <li>Jangan berikan kata sandi Anda kepada siapapun.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
