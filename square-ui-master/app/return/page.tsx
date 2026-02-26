"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StaticPageForm } from "@/components/dashboard/static-page-form";
import { Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Language = "RU" | "UZ" | "EN";

export default function ReturnPage() {
    const [lang, setLang] = useState<Language>("RU");

    return (
        <SidebarProvider className="bg-sidebar">
            <DashboardSidebar />
            <div className="h-svh overflow-hidden lg:p-2 w-full">
                <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background relative border-border/40">
                    <DashboardHeader
                        title={
                            <div className="flex items-center gap-2">
                                <Undo2 className="size-5 text-primary" />
                                <h1 className="text-base font-bold tracking-tight">Возврат товара</h1>
                            </div>
                        }
                        description="Настройка информационной страницы условий возврата и обмена"
                        actions={
                            <div className="bg-muted/30 p-1 rounded-xl flex items-center border border-border shadow-none">
                                {(['RU', 'UZ', 'EN'] as Language[]).map((l) => (
                                    <motion.button
                                        key={l}
                                        onClick={() => setLang(l)}
                                        className={cn(
                                            "px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all min-w-[50px] relative",
                                            lang === l
                                                ? "text-primary-foreground"
                                                : "text-muted-foreground hover:bg-background/20 hover:text-foreground"
                                        )}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {lang === l && (
                                            <motion.div
                                                layoutId="activeLang"
                                                className="absolute inset-0 bg-primary rounded-lg shadow-none"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                        <span className="relative z-10">{l}</span>
                                    </motion.button>
                                ))}
                            </div>
                        }
                    />
                    <div className="w-full overflow-y-auto overflow-x-hidden p-0 h-full bg-muted/30">
                        <StaticPageForm lang={lang} pageKey="return_page" title="Условия возврата" />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
