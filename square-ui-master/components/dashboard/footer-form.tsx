"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
    Save,
    RefreshCw,
    Type,
    Phone,
    Mail,
    Instagram,
    Send,
    MapPin,
    Check,
    Globe
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

type Language = "RU" | "UZ" | "EN";

interface FooterFormProps {
    lang: Language;
}

export function FooterForm({ lang }: FooterFormProps) {
    const [footer, setFooter] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchFooterData();
    }, []);

    const fetchFooterData = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/content');
            if (res.ok) {
                const data = await res.json();
                if (data.footer) {
                    setFooter(data.footer);
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка загрузки данных футера");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // First get full content to preserve other fields
            const resGet = await fetch('http://localhost:8000/api/content');
            const currentContent = await resGet.json();

            const res = await fetch('http://localhost:8000/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...currentContent, footer }),
            });

            if (res.ok) {
                toast.success("Данные футера сохранены");
            } else {
                throw new Error("Failed to save");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ошибка при сохранении");
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFooter((prev: any) => ({ ...prev, [field]: value }));
    };

    const getFieldForLang = (baseName: string, currentLang: Language) => {
        if (currentLang === 'RU') return baseName;
        return `${baseName}_${currentLang.toLowerCase()}`;
    };

    if (loading) {
        return (
            <div className="w-full h-[400px] flex flex-col items-center justify-center space-y-4">
                <div className="size-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    return (
        <motion.div
            className="w-full p-6 space-y-8 max-w-none mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Card className="rounded-3xl border-border/60 bg-card/50 shadow-none overflow-hidden">
                <CardContent className="p-0">
                    <div className="p-8 space-y-8">
                        {/* Section: Branding */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                                    <Type className="size-4" />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Брендинг</h3>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Слоган ({lang})</Label>
                                <Textarea
                                    placeholder="Введите слоган компании..."
                                    value={footer?.[getFieldForLang('slogan', lang)] || ''}
                                    onChange={(e) => updateField(getFieldForLang('slogan', lang), e.target.value)}
                                    className="min-h-[80px] bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl transition-all resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Копирайт</Label>
                                    <Input
                                        value={footer?.copyright_text || ''}
                                        onChange={(e) => updateField('copyright_text', e.target.value)}
                                        className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl transition-all"
                                        placeholder="© 2024 HESSA Inc."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Contacts */}
                        <div className="space-y-6 pt-6 border-t border-border/40">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="size-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">
                                    <Phone className="size-4" />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Контакты</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-1 flex items-center gap-2">
                                        <Phone className="size-3" /> Телефон
                                    </Label>
                                    <Input
                                        value={footer?.phone || ''}
                                        onChange={(e) => updateField('phone', e.target.value)}
                                        className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl transition-all"
                                        placeholder="+998 (90) 000-0000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-1 flex items-center gap-2">
                                        <Mail className="size-3" /> Email
                                    </Label>
                                    <Input
                                        value={footer?.email || ''}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl transition-all"
                                        placeholder="hello@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-1 flex items-center gap-2">
                                    <MapPin className="size-3" /> Адрес / Локация ({lang})
                                </Label>
                                <Input
                                    value={footer?.[getFieldForLang('location', lang)] || ''}
                                    onChange={(e) => updateField(getFieldForLang('location', lang), e.target.value)}
                                    className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl transition-all"
                                    placeholder="Город, Страна"
                                />
                            </div>
                        </div>

                        {/* Section: Socials */}
                        <div className="space-y-6 pt-6 border-t border-border/40">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="size-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
                                    <Globe className="size-4" />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Соцсети</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-1 flex items-center gap-2">
                                        <Instagram className="size-3" /> Instagram URL
                                    </Label>
                                    <Input
                                        value={footer?.instagram || ''}
                                        onChange={(e) => updateField('instagram', e.target.value)}
                                        className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl transition-all"
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-1 flex items-center gap-2">
                                        <Send className="size-3" /> Telegram URL
                                    </Label>
                                    <Input
                                        value={footer?.telegram || ''}
                                        onChange={(e) => updateField('telegram', e.target.value)}
                                        className="h-11 bg-muted/20 border-border/40 focus:bg-background focus:border-primary/20 rounded-xl transition-all"
                                        placeholder="https://t.me/..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 px-8 border-t border-border/50 bg-muted/10 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground/50 text-[10px] uppercase font-bold tracking-widest">
                            <Check className="size-3" />
                            Проверьте данные перед сохранением
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="h-10 px-8 rounded-full font-semibold shadow-none active:scale-95 transition-all text-xs uppercase tracking-widest"
                        >
                            {saving ? <RefreshCw className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
                            Сохранить футер
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
