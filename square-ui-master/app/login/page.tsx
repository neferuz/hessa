"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { Lock, User as UserIcon, AlertCircle, QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import { API_BASE_URL } from "@/lib/config";
import clsx from "clsx";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const admin = localStorage.getItem("hessaAdmin");
        if (admin) {
            router.push("/");
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.detail || "Неверный логин или пароль");
                return;
            }

            localStorage.setItem("hessaAdmin", JSON.stringify(data));
            router.push("/");
        } catch (e) {
            console.error(e);
            setError("Ошибка сети при авторизации");
        } finally {
            setLoading(false);
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-sm"
            >
                <Card className="rounded-[40px] border border-border bg-card p-10 shadow-2xl shadow-primary/5">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black tracking-tight mb-2">HESSA</h1>
                        <p className="text-sm text-muted-foreground font-medium">
                            Войдите в панель управления
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                                <AlertCircle className="size-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Логин</Label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="admin"
                                    className="pl-11 h-14 rounded-2xl border-border bg-background focus-visible:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Пароль</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••"
                                    className="pl-11 h-14 rounded-2xl border-border bg-background focus-visible:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                            disabled={loading}
                        >
                            {loading ? "Загрузка..." : "Войти"}
                        </Button>
                    </form>
                </Card>

                <div className="mt-8 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40">
                        Secure Access System • HESSA © 2026
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

