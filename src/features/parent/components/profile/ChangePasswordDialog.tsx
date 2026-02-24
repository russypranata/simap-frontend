"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Eye, EyeOff, Loader2, KeyRound, AlertCircle, ChevronDown, ChevronUp, ShieldCheck, Check, X } from "lucide-react";

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

interface ChangePasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

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

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
    open,
    onOpenChange,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showRequirements, setShowRequirements] = useState(false);
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
            onOpenChange(false);
        } catch (error) {
            setApiError("Gagal mengubah kata sandi. Silakan coba lagi.");
            toast.error("Gagal mengubah kata sandi");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            form.reset();
            setApiError(null);
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
            setShowRequirements(false);
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[440px]">
                <DialogHeader className="pb-4 text-left">
                    <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center h-10 w-10 mt-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
                            <KeyRound className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-0.5">
                            <DialogTitle className="text-lg font-semibold text-foreground">
                                Ubah Kata Sandi
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                Pastikan akun Anda aman dengan kata sandi yang kuat.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {apiError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-700">{apiError}</p>
                    </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-md mb-4 overflow-hidden transition-all duration-300">
                    <button
                        type="button"
                        onClick={() => setShowRequirements(!showRequirements)}
                        className="w-full flex items-center justify-between p-3 hover:bg-blue-100/50 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-blue-600" />
                            <span className="text-xs font-semibold text-blue-800">Syarat Kata Sandi</span>
                        </div>
                        {showRequirements ? (
                            <ChevronUp className="h-4 w-4 text-blue-600" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-blue-600" />
                        )}
                    </button>

                    {showRequirements && (
                        <div className="px-4 pb-3 pt-0 space-y-1.5 text-xs border-t border-blue-200/50 mt-1">
                            <div className="mt-2 space-y-1.5">
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
                        </div>
                    )}
                </div>

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

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                                disabled={isLoading}
                            >
                                Batal
                            </Button>
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
                                    "Simpan Perubahan"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
