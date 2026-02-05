"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { Lock, User as UserIcon, AlertCircle } from "lucide-react";

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
            const response = await fetch("http://localhost:8000/api/auth/admin/login", {
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

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
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
                className="w-full max-w-md"
            >
                <Card className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                    <motion.div variants={itemVariants} className="text-center mb-8">
                        <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Lock className="size-8 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight mb-2">HESSA Admin</h1>
                        <p className="text-sm text-muted-foreground">Войдите в систему для доступа к панели управления</p>
                    </motion.div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                            >
                                <AlertCircle className="size-4 shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="username" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                                Логин
                            </Label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="Введите логин"
                                    className="pl-9 h-11 rounded-xl border-border bg-background"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                                Пароль
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Введите пароль"
                                    className="pl-9 h-11 rounded-xl border-border bg-background"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Button
                                type="submit"
                                className="w-full h-11 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                        Вход...
                                    </span>
                                ) : (
                                    "Войти"
                                )}
                            </Button>
                        </motion.div>
                    </form>

                    <motion.div variants={itemVariants} className="mt-6 text-center">
                        <p className="text-xs text-muted-foreground">
                            По умолчанию: <span className="font-medium text-foreground">admin</span> / <span className="font-medium text-foreground">123456</span>
                        </p>
                    </motion.div>
                </Card>
            </motion.div>
        </div>
    );
}
