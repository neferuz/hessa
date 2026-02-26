"use client";

import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Stethoscope, Clock, Archive, ChevronRight, User, MapPin, X, ExternalLink, Upload, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/lib/config";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AnalysisRequest {
    id: number;
    user_id: number;
    address: string;
    status: string;
    scheduled_date: string | null;
    result_file_url: string | null;
    doctor_notes: string | null;
    created_at: string;
    completed_at: string | null;
}

export default function AnalysisPage() {
    const [requests, setRequests] = useState<AnalysisRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<AnalysisRequest | null>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [usersMap, setUsersMap] = useState<Record<number, any>>({});
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (selectedRequest) {
            fetchUser(selectedRequest.user_id);
        } else {
            setSelectedUser(null);
        }
    }, [selectedRequest]);

    const fetchUser = async (userId: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/users/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedUser(data);
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const [reqRes, usersRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/analysis/all`),
                fetch(`${API_BASE_URL}/api/users/`)
            ]);

            if (usersRes.ok) {
                const usersData = await usersRes.json();
                const map: Record<number, any> = {};
                usersData.forEach((u: any) => { map[u.id] = u; });
                setUsersMap(map);
            }

            if (reqRes.ok) {
                const data = await reqRes.json();
                setRequests(data);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (reqId: number, newStatus: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/analysis/${reqId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                const updated = await res.json();
                setRequests(prev => prev.map(r => r.id === reqId ? updated : r));
                if (selectedRequest?.id === reqId) {
                    setSelectedRequest(updated);
                }
                toast.success("Статус успешно обновлен");
            } else {
                toast.error("Ошибка при обновлении статуса");
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Ошибка соединения");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !selectedRequest) return;
        const file = e.target.files[0];
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
                method: "POST",
                body: formData
            });

            if (uploadRes.ok) {
                const data = await uploadRes.json();

                // Now update the analysis request
                const updateRes = await fetch(`${API_BASE_URL}/api/analysis/${selectedRequest.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ result_file_url: data.url })
                });

                if (updateRes.ok) {
                    const updated = await updateRes.json();
                    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? updated : r));
                    setSelectedRequest(updated);
                    toast.success("Файл успешно загружен");
                } else {
                    toast.error("Файл загружен, но произошла ошибка при привязке");
                }
            } else {
                toast.error("Ошибка при загрузке файла");
            }
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Ошибка соединения");
        } finally {
            setUploading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "bg-green-100 text-green-700 hover:bg-green-100/80";
            case "scheduled": return "bg-blue-100 text-blue-700 hover:bg-blue-100/80";
            case "pending": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80";
            case "canceled": return "bg-red-100 text-red-700 hover:bg-red-100/80";
            default: return "bg-slate-100 text-slate-700 hover:bg-slate-100/80";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "completed": return "Завершено";
            case "scheduled": return "Запланировано";
            case "pending": return "Ожидает";
            case "canceled": return "Отменено";
            default: return status;
        }
    };

    const getFileUrl = (url: string | null) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        if (url.startsWith('/static')) return `${API_BASE_URL}${url}`;
        const clean = url.startsWith('/') ? url.slice(1) : url;
        return `${API_BASE_URL}/static/${clean}`;
    };

    return (
        <SidebarProvider className="bg-sidebar">
            <DashboardSidebar />
            <div className="h-svh overflow-hidden lg:p-2 w-full">
                <div className="lg:border lg:rounded-xl overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background">
                    <DashboardHeader
                        title={
                            <div className="flex items-center gap-3">
                                <Stethoscope className="size-5 text-primary" />
                                <h1 className="text-lg font-semibold tracking-tight">Анализы на дому</h1>
                            </div>
                        }
                    />

                    <div className="flex-1 overflow-y-auto w-full p-6">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                                <div className="p-8 bg-muted/30 rounded-full">
                                    <Archive className="size-12 opacity-20" />
                                </div>
                                <p className="text-lg font-medium">Заявок пока нет</p>
                            </div>
                        ) : (
                            <div className="max-w-6xl mx-auto">
                                <div className="grid grid-cols-6 gap-4 px-6 py-3 text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest border-b mb-4">
                                    <div className="col-span-1">ID Заявки</div>
                                    <div className="col-span-1">Клиент</div>
                                    <div className="col-span-1">Создана</div>
                                    <div className="col-span-1">Адрес</div>
                                    <div className="col-span-1">Статус</div>
                                    <div className="col-span-1 text-right">Действие</div>
                                </div>

                                <div className="space-y-3">
                                    {requests.map((req) => {
                                        const user = usersMap[req.user_id];
                                        return (
                                            <motion.div
                                                key={req.id}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="grid grid-cols-6 gap-4 px-6 py-4 items-center bg-card border rounded-2xl transition-all cursor-pointer group hover:border-primary/30"
                                                onClick={() => setSelectedRequest(req)}
                                            >
                                                <div className="col-span-1 flex flex-col">
                                                    <span className="text-xs text-muted-foreground font-medium">#{req.id}</span>
                                                </div>
                                                <div className="col-span-1 flex flex-col gap-0.5 relative pr-4">
                                                    <span className="text-sm font-semibold truncate text-foreground">
                                                        {user ? (user.full_name || user.username || "Без имени") : "Загрузка..."}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground truncate">
                                                        {user?.phone || "Нет телефона"}
                                                    </span>
                                                </div>
                                                <div className="col-span-1 text-sm text-muted-foreground flex items-center gap-2">
                                                    <Clock className="size-3 shrink-0" />
                                                    {new Date(req.created_at).toLocaleDateString()}
                                                </div>
                                                <div className="col-span-1 flex items-center gap-2 text-sm text-muted-foreground truncate">
                                                    <MapPin className="size-3 shrink-0" />
                                                    <span className="truncate">{req.address || "Не указан"}</span>
                                                </div>
                                                <div className="col-span-1">
                                                    <Badge variant="outline" className={`border-0 rounded-full px-3 py-0.5 text-[10px] font-bold ${getStatusColor(req.status)}`}>
                                                        {getStatusText(req.status)}
                                                    </Badge>
                                                </div>
                                                <div className="col-span-1 text-right">
                                                    <button className="p-2 rounded-full hover:bg-muted text-muted-foreground group-hover:text-primary transition-colors inline-flex">
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Request Detail Side Modal */}
            <AnimatePresence>
                {selectedRequest && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRequest(null)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[50]"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
                            className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-[51] border-l border-border flex flex-col"
                        >
                            <div className="p-6 border-b border-border/50 flex flex-col gap-1 bg-muted/10 relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedRequest(null)}
                                    className="absolute top-4 right-4 rounded-full size-8 hover:bg-muted text-muted-foreground transition-colors"
                                >
                                    <X size={18} />
                                </Button>
                                <div className="flex items-center gap-2 text-primary font-medium">
                                    <Stethoscope className="size-5" />
                                    <h2 className="text-xl font-bold tracking-tight text-foreground">Заявка #{selectedRequest.id}</h2>
                                </div>
                                <span className="text-xs text-muted-foreground/80 mt-1">Оформлена: {new Date(selectedRequest.created_at).toLocaleString("ru-RU")}</span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-background">
                                {/* User Info Card */}
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Клиент</h3>
                                    <div className="flex items-center justify-between p-4 bg-card border border-border/50 rounded-2xl hover:border-primary/20 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                <User className="size-4 text-muted-foreground" />
                                            </div>
                                            <div className="flex flex-col">
                                                {selectedUser ? (
                                                    <>
                                                        <span className="text-sm font-semibold text-foreground">{selectedUser.full_name || selectedUser.username}</span>
                                                        <span className="text-xs text-muted-foreground">{selectedUser.phone || "Телефон не указан"}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-sm font-medium text-muted-foreground animate-pulse">Загрузка...</span>
                                                )}
                                            </div>
                                        </div>
                                        <Link href={`/users/${selectedRequest.user_id}`} className="text-xs font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5">
                                            Профиль
                                        </Link>
                                    </div>
                                </div>

                                {/* Status Update */}
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Статус выезда</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['pending', 'scheduled', 'completed', 'canceled'].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => updateStatus(selectedRequest.id, s)}
                                                className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${selectedRequest.status === s
                                                    ? 'bg-primary border-primary text-white'
                                                    : 'bg-card border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                                    }`}
                                            >
                                                {getStatusText(s)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Адрес забора</h3>
                                    <div className="flex items-center gap-3 p-4 bg-muted/20 border-border/50 border rounded-2xl">
                                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <MapPin className="size-4 text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-foreground">
                                                {selectedRequest.address || "Не указано"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Results Upload */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Результаты</h3>

                                    {selectedRequest.result_file_url ? (
                                        <div className="p-4 border rounded-2xl bg-emerald-500/5 border-emerald-500/20 flex flex-col gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                                                    <FileText size={16} />
                                                </div>
                                                <span className="text-sm font-medium text-emerald-700">Файл с результатами загружен</span>
                                            </div>
                                            <a href={getFileUrl(selectedRequest.result_file_url)} target="_blank" rel="noopener noreferrer" className="text-xs bg-white text-emerald-700 font-bold border border-emerald-500/20 px-4 py-2 rounded-xl text-center hover:bg-emerald-50 transition-colors uppercase tracking-wider">
                                                Посмотреть файл
                                            </a>
                                        </div>
                                    ) : null}

                                    <div className="flex flex-col gap-2 p-5 border rounded-2xl border-dashed bg-muted/10 items-center justify-center text-center">
                                        <Upload className="size-6 text-muted-foreground/50 mb-1" />
                                        <Label htmlFor="results-file" className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors">Загрузить новый результат (PDF, JPEG)</Label>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">до 5 MB</p>
                                        <Input id="results-file" type="file" onChange={handleFileUpload} disabled={uploading} className="hidden" />
                                        {uploading && <span className="text-xs text-primary font-bold mt-2 flex items-center gap-2"><div className="size-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div> Загрузка...</span>}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </SidebarProvider>
    );
}
