"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Users,
    Mail,
    Phone,
    Calendar as CalendarIcon,
    CheckCircle2,
    CircleDashed,
    UserPlus,
    ChevronRight,
    Shield
} from "lucide-react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

interface User {
    id: number;
    fullName: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    status: "Active" | "Pending" | "Suspended";
    joinedDate: string;
}

const STATUS_CONFIG = {
    Active: {
        label: "Активен",
        color: "text-emerald-600",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    },
    Pending: {
        label: "Ожидает",
        color: "text-amber-600",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20"
    },
    Suspended: {
        label: "Заблокирован",
        color: "text-red-600",
        bg: "bg-red-500/10",
        border: "border-red-500/20"
    },
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Pending" | "Suspended">("All");

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        full_name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        role: "Пользователь",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/users/");
            if (res.ok) {
                const data = await res.json();
                const formattedUsers = Array.isArray(data) ? data.map((user: any) => ({
                    id: user.id,
                    fullName: user.full_name || user.username || 'Пользователь',
                    username: user.username || 'user',
                    email: user.email || '',
                    phone: user.phone || 'Не указано',
                    role: user.role || "Пользователь",
                    status: (user.is_active ? "Active" : "Suspended") as any,
                    joinedDate: user.created_at || new Date().toISOString()
                })) : [];
                setUsers(formattedUsers);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
            toast.error("Ошибка загрузки пользователей");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        toast.info("Функционал создания пользователя в разработке");
        setIsCreateOpen(false);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "All" || user.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const activeCount = users.filter(u => u.status === "Active").length;
    const pendingCount = users.filter(u => u.status === "Pending").length;
    const suspendedCount = users.filter(u => u.status === "Suspended").length;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "tween" as const, ease: "easeOut" as const, duration: 0.3 },
        },
    };

    return (
        <SidebarProvider className="bg-sidebar">
            <DashboardSidebar />
            <div className="h-svh overflow-hidden lg:p-2 w-full">
                <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background">
                    <DashboardHeader
                        title={
                            <div className="flex items-center gap-3">
                                <Users className="size-5 text-muted-foreground" />
                                <h1 className="text-base font-medium tracking-tight">Пользователи</h1>
                            </div>
                        }
                        actions={
                            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        className="h-9 px-5 rounded-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all active:scale-95"
                                    >
                                        <Plus className="size-4 mr-2 stroke-[2.5]" />
                                        Добавить
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="rounded-3xl sm:max-w-xl p-0 border border-border bg-card shadow-none gap-0 overflow-hidden">
                                    <DialogHeader className="p-6 border-b border-border/50 bg-muted/20">
                                        <DialogTitle className="text-xl font-semibold">Новый пользователь</DialogTitle>
                                        <DialogDescription className="text-sm">
                                            Создание новой учетной записи клиента или администратора.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="p-6 space-y-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                        <div className="space-y-2 col-span-2">
                                            <Label className="text-xs uppercase font-bold text-muted-foreground tracking-widest pl-1">ФИО</Label>
                                            <Input
                                                placeholder="Иванов Иван"
                                                value={newUser.full_name}
                                                onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                                                className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background shadow-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase font-bold text-muted-foreground tracking-widest pl-1">Логин</Label>
                                            <Input
                                                placeholder="user_login"
                                                value={newUser.username}
                                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                                className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background shadow-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase font-bold text-muted-foreground tracking-widest pl-1">Email</Label>
                                            <Input
                                                type="email"
                                                placeholder="user@example.com"
                                                value={newUser.email}
                                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                                className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background shadow-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase font-bold text-muted-foreground tracking-widest pl-1">Телефон</Label>
                                            <Input
                                                placeholder="+998 90 123 45 67"
                                                value={newUser.phone}
                                                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                                className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background shadow-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase font-bold text-muted-foreground tracking-widest pl-1">Пароль</Label>
                                            <Input
                                                type="password"
                                                value={newUser.password}
                                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                                className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background shadow-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase font-bold text-muted-foreground tracking-widest pl-1">Роль</Label>
                                            <Select
                                                value={newUser.role}
                                                onValueChange={(val) => setNewUser({ ...newUser, role: val })}
                                            >
                                                <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background shadow-none">
                                                    <SelectValue placeholder="Выберите роль" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-border/60 shadow-none">
                                                    <SelectItem value="Пользователь">Пользователь</SelectItem>
                                                    <SelectItem value="Менеджер">Менеджер</SelectItem>
                                                    <SelectItem value="Администратор">Администратор</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <DialogFooter className="p-6 pt-2 border-t border-border/50 bg-muted/10">
                                        <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="rounded-xl h-11 border-border/60 shadow-none hover:bg-background">
                                            Отмена
                                        </Button>
                                        <Button onClick={handleCreate} className="rounded-xl h-11 font-medium shadow-none px-8">
                                            Создать
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        }
                    />
                    <div className="flex-1 w-full overflow-y-auto">
                        <motion.div
                            className="bg-background/50 p-6 space-y-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Stats Overview */}
                            <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-5" variants={itemVariants}>
                                {[
                                    { label: "Всего пользователей", value: users.length, icon: Users, color: "text-primary", bg: "bg-primary/5" },
                                    { label: "Активные", value: activeCount, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/5" },
                                    { label: "Ожидают", value: pendingCount, icon: CircleDashed, color: "text-amber-600", bg: "bg-amber-500/5" },
                                    { label: "Заблокированы", value: suspendedCount, icon: Shield, color: "text-red-600", bg: "bg-red-500/5" },
                                ].map((stat, idx) => (
                                    <Card key={idx} className="rounded-2xl border-border/60 bg-card/50 p-5 shadow-none flex items-center justify-between hover:border-border transition-colors">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">{stat.label}</p>
                                            <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
                                        </div>
                                        <div className={cn("size-12 rounded-xl flex items-center justify-center", stat.bg)}>
                                            <stat.icon className={cn("size-6", stat.color)} />
                                        </div>
                                    </Card>
                                ))}
                            </motion.div>

                            {/* Main Content Card */}
                            <motion.div variants={itemVariants} className="space-y-4">
                                {/* Search and Filter */}
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="relative flex-1 w-full max-w-md">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Поиск по имени, email или телефону..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 h-11 rounded-xl bg-card border-border/60 shadow-none focus-visible:ring-1"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                                        {(["All", "Active", "Pending", "Suspended"] as const).map((status) => (
                                            <Button
                                                key={status}
                                                variant={statusFilter === status ? "secondary" : "ghost"}
                                                size="sm"
                                                onClick={() => setStatusFilter(status)}
                                                className={cn(
                                                    "rounded-lg h-9 text-xs font-medium border border-transparent shadow-none",
                                                    statusFilter === status && "bg-background border-border shadow-sm"
                                                )}
                                            >
                                                {status === "All" ? "Все" :
                                                    status === "Active" ? "Активные" :
                                                        status === "Pending" ? "Ожидают" : "Бан"}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <Card className="rounded-2xl border-border/60 bg-card overflow-hidden shadow-none">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-border/50 bg-muted/20">
                                                    <th className="py-4 px-6 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Пользователь</th>
                                                    <th className="py-4 px-6 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Контакты</th>
                                                    <th className="py-4 px-6 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Роль</th>
                                                    <th className="py-4 px-6 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Дата регистрации</th>
                                                    <th className="py-4 px-6 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Статус</th>
                                                    <th className="py-4 px-6 text-right text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Профиль</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/40">
                                                {loading ? (
                                                    [...Array(5)].map((_, i) => (
                                                        <tr key={i}>
                                                            <td className="p-6"><div className="h-10 w-48 bg-muted/50 rounded-lg animate-pulse" /></td>
                                                            <td className="p-6"><div className="h-8 w-32 bg-muted/50 rounded animate-pulse" /></td>
                                                            <td className="p-6"><div className="h-6 w-20 bg-muted/50 rounded animate-pulse" /></td>
                                                            <td className="p-6"><div className="h-6 w-24 bg-muted/50 rounded animate-pulse" /></td>
                                                            <td className="p-6"><div className="h-8 w-20 bg-muted/50 rounded-full animate-pulse" /></td>
                                                            <td className="p-6"><div className="h-8 w-8 bg-muted/50 rounded ml-auto animate-pulse" /></td>
                                                        </tr>
                                                    ))
                                                ) : filteredUsers.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="py-24 text-center">
                                                            <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground max-w-xs mx-auto">
                                                                <div className="size-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-2">
                                                                    <Users className="size-8 opacity-20" />
                                                                </div>
                                                                <h3 className="font-semibold text-lg text-foreground">Пользователи не найдены</h3>
                                                                <p className="text-sm text-center">
                                                                    Измените параметры поиска или фильтры.
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    <AnimatePresence mode="popLayout">
                                                        {filteredUsers.map((user, index) => {
                                                            const status = STATUS_CONFIG[user.status] || STATUS_CONFIG.Active;
                                                            return (
                                                                <motion.tr
                                                                    key={user.id}
                                                                    className="group hover:bg-muted/20 transition-colors cursor-pointer"
                                                                    initial={{ opacity: 0, y: 5 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ delay: index * 0.03 }}
                                                                    onClick={() => window.location.href = `/users/${user.id}`}
                                                                >
                                                                    <td className="py-4 px-6">
                                                                        <div className="flex items-center gap-4">
                                                                            <Avatar className="size-11 rounded-xl shadow-sm border border-border/20">
                                                                                <AvatarFallback className="bg-primary/5 text-primary text-sm font-bold rounded-xl">
                                                                                    {user.fullName.charAt(0)}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                            <div>
                                                                                <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                                                                                    {user.fullName}
                                                                                </p>
                                                                                <p className="text-xs text-muted-foreground font-medium mt-0.5 opacity-70">
                                                                                    @{user.username}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <div className="space-y-1">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                                                                                <Mail className="size-3 text-muted-foreground" />
                                                                                {user.email || "—"}
                                                                            </div>
                                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                                <Phone className="size-3" />
                                                                                {user.phone}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <span className="text-sm font-medium text-foreground/90">{user.role}</span>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                                                            <CalendarIcon className="size-3.5 opacity-70" />
                                                                            {format(new Date(user.joinedDate), "dd MMM yyyy")}
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-4 px-6">
                                                                        <div className={cn(
                                                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                                                                            status.bg, status.border, status.color
                                                                        )}>
                                                                            <div className="size-1.5 rounded-full bg-current" />
                                                                            {status.label}
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-4 px-6 text-right">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="size-9 rounded-lg transition-all hover:bg-background hover:shadow-sm"
                                                                        >
                                                                            <ChevronRight className="size-4 text-muted-foreground" />
                                                                        </Button>
                                                                    </td>
                                                                </motion.tr>
                                                            )
                                                        })}
                                                    </AnimatePresence>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
