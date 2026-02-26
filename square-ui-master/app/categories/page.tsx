"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Folder, MoreHorizontal, Layers, Image as ImageIcon, FileText, Loader2, Trash2, Pencil, Upload, Package, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn, getImageUrl } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Dialog State
    const [newCat, setNewCat] = useState({ name: "", description_short: "", description: "", image: "" });
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    // Delete State
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [catToDelete, setCatToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchCategories = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/categories');
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error(err);
            toast.error("Не удалось загрузить категории");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const resetForm = () => {
        setNewCat({ name: "", description_short: "", description: "", image: "" });
        setIsEditing(false);
        setEditId(null);
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setTimeout(resetForm, 200); // Reset after animation
        }
    };

    const handleEdit = (cat: any) => {
        setNewCat({
            name: cat.name,
            description_short: cat.description_short || "",
            description: cat.description || "",
            image: cat.image || ""
        });
        setIsEditing(true);
        setEditId(cat.id);
        setIsOpen(true);
    };

    const handleSubmit = async () => {
        if (!newCat.name) {
            toast.warning("Введите название категории");
            return;
        }

        setIsSubmitting(true);
        try {
            const url = isEditing
                ? `http://localhost:8000/api/categories/${editId}`
                : 'http://localhost:8000/api/categories';

            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCat)
            });

            if (res.ok) {
                setIsOpen(false);
                resetForm();
                fetchCategories();
                toast.success(isEditing ? "Категория обновлена" : "Категория создана");
            } else {
                const err = await res.json();
                toast.error(err.detail || "Ошибка при сохранении");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка сети");
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = (cat: any) => {
        setCatToDelete(cat);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!catToDelete) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`http://localhost:8000/api/categories/${catToDelete.id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast.success("Категория удалена");
                fetchCategories();
                setIsDeleteDialogOpen(false);
            } else {
                const err = await res.json();
                toast.error(err.detail || "Ошибка при удалении");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка сети");
        } finally {
            setIsDeleting(false);
            setCatToDelete(null);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:8000/api/upload", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            setNewCat(prev => ({ ...prev, image: data.url }));
            toast.success("Изображение загружено");
        } catch (err) {
            console.error(err);
            toast.error("Ошибка загрузки изображения");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <SidebarProvider className="bg-sidebar">
            <DashboardSidebar />
            <div className="h-svh overflow-hidden lg:p-2 w-full">
                <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background relative">
                    <DashboardHeader
                        title={
                            <div className="flex items-center gap-2">
                                <Layers className="size-5 text-primary" />
                                <h1 className="text-base font-medium tracking-tight">Категории</h1>
                            </div>
                        }
                        description="Управление коллекциями и категориями товаров"
                        actions={
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchCategories}
                                    disabled={loading}
                                    className="h-9 rounded-2xl gap-2 font-medium"
                                >
                                    <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
                                    Обновить
                                </Button>
                                <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                                    <DialogTrigger asChild>
                                        <Button className="h-9 gap-2">
                                            <Plus className="size-4" />
                                            Новая категория
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px] rounded-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                                        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
                                            <DialogTitle className="text-lg">
                                                {isEditing ? "Редактировать категорию" : "Новая категория"}
                                            </DialogTitle>
                                            <DialogDescription>
                                                {isEditing ? "Измените данные категории" : "Заполните информацию о новой категории товаров"}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="px-6 space-y-4 overflow-y-auto flex-1 min-h-0">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                                    Название <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="name"
                                                    value={newCat.name}
                                                    onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                                                    placeholder="Например: Витамины"
                                                    className="h-9"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Изображение</Label>
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                        <Input
                                                            value={newCat.image}
                                                            onChange={(e) => setNewCat({ ...newCat, image: e.target.value })}
                                                            placeholder="URL изображения..."
                                                            className="h-9 pl-9"
                                                        />
                                                    </div>
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleFileUpload}
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-9 gap-2"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        disabled={isUploading}
                                                    >
                                                        {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                                                        Загрузить
                                                    </Button>
                                                </div>

                                                {newCat.image && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        className="relative aspect-video rounded-lg overflow-hidden border border-border bg-muted"
                                                    >
                                                        <img src={getImageUrl(newCat.image)} alt="Preview" className="w-full h-full object-cover" />
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                                            onClick={() => setNewCat({ ...newCat, image: "" })}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </motion.div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="short_desc" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                                    Короткое описание
                                                </Label>
                                                <Textarea
                                                    id="short_desc"
                                                    value={newCat.description_short}
                                                    onChange={(e) => setNewCat({ ...newCat, description_short: e.target.value })}
                                                    placeholder="1-2 предложения для карточки..."
                                                    rows={3}
                                                    className="resize-none"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="desc" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                                    Полное описание
                                                </Label>
                                                <Textarea
                                                    id="desc"
                                                    value={newCat.description}
                                                    onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                                                    placeholder="Расскажите подробнее о категории..."
                                                    rows={5}
                                                    className="resize-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t flex-shrink-0 bg-background">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleOpenChange(false)}
                                                className="h-9"
                                            >
                                                Отмена
                                            </Button>
                                            <Button
                                                onClick={handleSubmit}
                                                className="h-9 gap-2"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Folder className="size-4" />}
                                                {isEditing ? "Сохранить изменения" : "Создать категорию"}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        }
                    />

                    {/* Content */}
                    <div className="w-full p-6 h-full overflow-y-auto bg-muted/40">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="size-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                    <p className="text-muted-foreground text-sm font-medium">Загрузка категорий...</p>
                                </div>
                            </div>
                        ) : categories.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed rounded-xl p-8 bg-background/50"
                            >
                                <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <Layers className="size-8 text-muted-foreground" />
                                </div>
                                <h3 className="font-semibold text-lg">Нет категорий</h3>
                                <p className="text-muted-foreground mt-1 max-w-sm">
                                    Создайте первую категорию, чтобы начать добавлять товары.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                                <AnimatePresence>
                                    {categories.map((cat, i) => (
                                        <motion.div
                                            key={cat.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group relative h-[340px] overflow-hidden rounded-[2.5rem] border bg-card transition-all duration-500 hover:-translate-y-2 hover:border-primary/50"
                                        >
                                            {/* Full Background Image */}
                                            <div className="absolute inset-0 z-0">
                                                {cat.image ? (
                                                    <img
                                                        src={getImageUrl(cat.image)}
                                                        alt={cat.name}
                                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900" />
                                                )}
                                                {/* Premium Overlays */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500" />
                                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            </div>

                                            {/* Content Overlay */}
                                            <div className="relative z-10 h-full flex flex-col justify-between p-8 text-white">

                                                {/* Top Actions */}
                                                <div className="flex justify-between items-start">
                                                    <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border border-white/20 uppercase">
                                                        #{cat.id}
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-white hover:bg-white/20 border border-white/10 backdrop-blur-sm transition-all active:scale-90">
                                                                <MoreHorizontal className="size-6" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-52 p-1.5 rounded-2xl shadow-2xl border-none bg-popover/95 backdrop-blur-md">
                                                            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Действия</DropdownMenuLabel>
                                                            <DropdownMenuSeparator className="bg-muted-foreground/10" />
                                                            <DropdownMenuItem
                                                                onClick={() => handleEdit(cat)}
                                                                className="rounded-xl px-3 py-2.5 focus:bg-primary focus:text-primary-foreground transition-all cursor-pointer flex items-center gap-3 group"
                                                            >
                                                                <Pencil className="size-4 text-muted-foreground group-focus:text-primary-foreground transition-colors" />
                                                                <span className="font-semibold text-sm">Редактировать</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator className="bg-muted-foreground/10" />
                                                            <DropdownMenuItem
                                                                onClick={() => confirmDelete(cat)}
                                                                className="text-destructive focus:text-white focus:bg-destructive rounded-xl px-3 py-2.5 transition-all cursor-pointer flex items-center gap-3 group"
                                                            >
                                                                <Trash2 className="size-4 text-destructive group-focus:text-white transition-colors" />
                                                                <span className="font-semibold text-sm">Удалить</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                {/* Bottom Info */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-white/70 text-[10px] font-bold uppercase tracking-widest bg-white/5 backdrop-blur-sm self-start px-3 py-1.5 rounded-full border border-white/5 w-fit">
                                                        <Package className="size-3" />
                                                        <span>{cat.products_count || 0} товаров</span>
                                                    </div>

                                                    <div>
                                                        <h3 className="font-bold text-xl tracking-tight leading-[1.2] text-white group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-300">
                                                            {cat.name}
                                                        </h3>
                                                        <p className="text-xs text-white/60 mt-2 line-clamp-2 leading-relaxed h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 font-medium text-white/90">
                                                            {cat.description_short || cat.description || "Нет описания"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reusable Confirm Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                title="Удалить категорию?"
                description={`Вы собираетесь удалить "${catToDelete?.name}". Все товары в этой категории останутся без категории. Это действие необратимо.`}
            />
        </SidebarProvider>
    );
}
