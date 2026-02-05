"use client";

import { useState, useEffect } from "react";
import { Sparkles, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Star, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Plan {
    id?: number;
    title: string;
    duration: string;
    price: number;
    old_price: number;
    items: string;
    is_recommended: boolean;
    is_active: boolean;
}

export default function PlansPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<number | null>(null);

    const [formData, setFormData] = useState<Plan>({
        title: "",
        duration: "",
        price: 0,
        old_price: 0,
        items: "",
        is_recommended: false,
        is_active: true
    });

    const formatPrice = (value: number | string) => {
        if (value === 0 || value === "0") return "0";
        if (!value) return "";
        const num = String(value).replace(/\D/g, "");
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const parsePrice = (value: string) => {
        return parseInt(value.replace(/\D/g, "") || "0", 10);
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/plans');
            if (res.ok) {
                const data = await res.json();
                setPlans(data);
            }
        } catch (err) {
            console.error("Failed to fetch plans", err);
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.duration) {
            toast.error("Заполните обязательные поля");
            return;
        }

        try {
            const url = isEditing && editingPlan?.id
                ? `http://localhost:8000/api/plans/${editingPlan.id}`
                : 'http://localhost:8000/api/plans';

            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(isEditing ? "План обновлен" : "План создан");
                fetchPlans();
                resetForm();
            } else {
                toast.error("Ошибка сохранения плана");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка сохранения плана");
        }
    };

    const handleDelete = (id: number) => {
        setPlanToDelete(id);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (planToDelete === null) return;

        try {
            const res = await fetch(`http://localhost:8000/api/plans/${planToDelete}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success("План удален");
                fetchPlans();
                setShowDeleteDialog(false);
                setPlanToDelete(null);
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка удаления плана");
        }
    };

    const handleToggleActive = async (plan: Plan) => {
        try {
            const res = await fetch(`http://localhost:8000/api/plans/${plan.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...plan, is_active: !plan.is_active })
            });

            if (res.ok) {
                toast.success(plan.is_active ? "План деактивирован" : "План активирован");
                fetchPlans();
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка обновления плана");
        }
    };

    const startEdit = (plan: Plan) => {
        setIsEditing(true);
        setEditingPlan(plan);
        setFormData(plan);
        setShowDialog(true);
    };

    const openCreateDialog = () => {
        resetForm();
        setShowDialog(true);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            duration: "",
            price: 0,
            old_price: 0,
            items: "",
            is_recommended: false,
            is_active: true
        });
        setIsEditing(false);
        setEditingPlan(null);
        setShowDialog(false);
    };

    return (
        <SidebarProvider className="bg-sidebar">
            <DashboardSidebar />
            <div className="h-svh overflow-hidden lg:p-2 w-full">
                <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background">
                    <DashboardHeader
                        title={
                            <div className="flex items-center gap-3">
                                <Sparkles className="size-5 text-muted-foreground" />
                                <h1 className="text-base font-medium tracking-tight">Планы подписки</h1>
                            </div>
                        }
                        actions={
                            <Button
                                onClick={openCreateDialog}
                                size="sm"
                                className="h-9 px-5 rounded-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all active:scale-95"
                            >
                                <Plus className="size-4 mr-2 stroke-[2.5]" />
                                Добавить план
                            </Button>
                        }
                    />

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="max-w-6xl mx-auto">
                            {plans.length === 0 ? (
                                <div className="text-center py-24">
                                    <div className="inline-flex p-6 rounded-2xl bg-primary/5 mb-6">
                                        <Sparkles className="size-16 text-primary/40" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Планы не созданы</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Создайте первый тарифный план для ваших клиентов
                                    </p>
                                    <Button onClick={openCreateDialog} className="gap-2">
                                        <Plus className="size-4" />
                                        Создать первый план
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            className={cn(
                                                "relative group rounded-[1.5rem] border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                                                plan.is_recommended
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border bg-card",
                                                !plan.is_active && "opacity-50 grayscale-[0.5]"
                                            )}
                                        >
                                            <div className="relative p-6 space-y-4">
                                                {/* Recommended Badge - Simple Style */}
                                                {plan.is_recommended && (
                                                    <div className="absolute -top-3 left-6">
                                                        <div className="bg-primary px-3 py-1 rounded-full shadow-md">
                                                            <div className="flex items-center gap-1.5">
                                                                <Star className="size-2.5 text-white fill-white" />
                                                                <span className="text-[9px] font-black text-white uppercase tracking-wider">Рекомендуем</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <h3 className="text-lg font-bold truncate text-foreground/90">{plan.title}</h3>
                                                        <div className="mt-1 flex items-center gap-2">
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded-full">{plan.duration}</span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 rounded-lg bg-muted/50 hover:bg-muted transition-colors shrink-0"
                                                        onClick={() => handleToggleActive(plan)}
                                                    >
                                                        {plan.is_active ? (
                                                            <ToggleRight className="size-5 text-green-500" />
                                                        ) : (
                                                            <ToggleLeft className="size-5 text-muted-foreground/40" />
                                                        )}
                                                    </Button>
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex items-baseline gap-1.5">
                                                        <span className="text-3xl font-black tracking-tight text-foreground">
                                                            {plan.price.toLocaleString()}
                                                        </span>
                                                        <span className="text-[10px] font-extrabold text-muted-foreground uppercase">сум</span>
                                                    </div>
                                                    {plan.old_price > 0 && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-muted-foreground/50 line-through">
                                                                {plan.old_price.toLocaleString()}
                                                            </span>
                                                            <span className="text-[9px] font-black text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-md">
                                                                -{Math.round((1 - plan.price / plan.old_price) * 100)}%
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="pt-4 border-t border-border/50">
                                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[2rem]">
                                                        {plan.items}
                                                    </p>
                                                </div>

                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 h-9 rounded-xl border transition-all gap-2 font-bold text-xs"
                                                        onClick={() => startEdit(plan)}
                                                    >
                                                        <Edit2 className="size-3.5" />
                                                        Изменить
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="size-9 rounded-xl text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-all shrink-0"
                                                        onClick={() => plan.id && handleDelete(plan.id)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-background/80 backdrop-blur-2xl">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                    <DialogHeader className="p-8 pb-0">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-primary/10">
                                <Sparkles className="size-5 text-primary" />
                            </div>
                            <DialogTitle className="text-2xl font-bold">
                                {isEditing ? "Редактировать план" : "Новый план"}
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-muted-foreground">
                            {isEditing
                                ? "Обновите информацию о тарифном плане"
                                : "Создайте новый тарифный план для ваших клиентов"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 p-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    Название *
                                </Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Например: 1 месяц"
                                    className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    Длительность *
                                </Label>
                                <Input
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    placeholder="30 дней"
                                    className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    Цена *
                                </Label>
                                <Input
                                    value={formatPrice(formData.price)}
                                    onChange={(e) => setFormData({ ...formData, price: parsePrice(e.target.value) })}
                                    placeholder="150 000"
                                    className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    Старая цена
                                </Label>
                                <Input
                                    value={formatPrice(formData.old_price)}
                                    onChange={(e) => setFormData({ ...formData, old_price: parsePrice(e.target.value) })}
                                    placeholder="200 000"
                                    className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Что входит в план
                            </Label>
                            <Textarea
                                value={formData.items}
                                onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                                rows={3}
                                placeholder="Например: 3 баночки витаминов, бесплатная доставка, персональная консультация"
                                className="resize-none rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20 p-4"
                            />
                        </div>

                        <div className="flex items-center gap-6 p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_recommended}
                                        onChange={(e) => setFormData({ ...formData, is_recommended: e.target.checked })}
                                        className="peer sr-only"
                                    />
                                    <div className="w-6 h-6 border-2 border-primary/20 rounded-lg peer-checked:border-primary peer-checked:bg-primary transition-all duration-300"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-foreground/70 group-hover:text-primary transition-colors">
                                    Рекомендуем
                                </span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="peer sr-only"
                                    />
                                    <div className="w-6 h-6 border-2 border-green-500/20 rounded-lg peer-checked:border-green-500 peer-checked:bg-green-500 transition-all duration-300"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-foreground/70 group-hover:text-green-600 transition-colors">
                                    Активен
                                </span>
                            </label>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                onClick={handleSubmit}
                                className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90 font-medium shadow-none transition-all active:scale-[0.98]"
                            >
                                {isEditing ? "Сохранить" : "Создать план"}
                            </Button>
                            <Button
                                onClick={resetForm}
                                variant="ghost"
                                className="h-11 px-8 rounded-xl font-medium text-muted-foreground hover:bg-muted/50"
                            >
                                Отмена
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Custom Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden bg-background/80 backdrop-blur-2xl">
                    <div className="absolute top-0 inset-x-0 h-1 bg-destructive/50" />
                    <div className="p-8 text-center">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
                            <AlertTriangle className="size-8 text-destructive" />
                        </div>
                        <h3 className="text-xl font-black mb-2">Удалить план?</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Это действие нельзя будет отменить. Вы уверены, что хотите навсегда удалить этот тарифный план?
                        </p>
                    </div>
                    <div className="flex gap-3 p-6 pt-0">
                        <Button
                            onClick={confirmDelete}
                            variant="destructive"
                            className="flex-1 h-12 rounded-xl font-bold uppercase tracking-wider text-[11px] shadow-lg shadow-destructive/20 active:scale-95 transition-all"
                        >
                            Удалить навсегда
                        </Button>
                        <Button
                            onClick={() => setShowDeleteDialog(false)}
                            variant="ghost"
                            className="flex-1 h-12 rounded-xl font-bold text-muted-foreground hover:bg-muted/50"
                        >
                            Отмена
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </SidebarProvider >
    );
}
