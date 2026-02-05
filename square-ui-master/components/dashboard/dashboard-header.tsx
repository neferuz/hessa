"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  title?: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
}

export function DashboardHeader({ title, description, actions }: DashboardHeaderProps) {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const adminData = localStorage.getItem("hessaAdmin");
    if (adminData) {
      try {
        setAdmin(JSON.parse(adminData));
      } catch (e) {
        console.error("Failed to parse admin data", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("hessaAdmin");
    setAdmin(null);
    // Используем window.location для полной перезагрузки страницы
    window.location.href = "/login";
  };

  return (
    <div className="w-full sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 h-14">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <SidebarTrigger className="shrink-0" />

        {title ? (
          <div className="flex items-center gap-4 px-2 sm:px-4 min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {title}
              </div>
              {description && (
                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                  {description}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4">
            <h1 className="text-base sm:text-xl font-medium text-muted-foreground">
              Welcome back, <span className="text-foreground font-semibold">{admin?.username || "Admin"}</span> 👋
            </h1>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {actions && (
          <>
            {actions}
            <div className="h-6 w-px bg-border mx-1" />
          </>
        )}
        <Button variant="ghost" size="icon-sm" className="relative shrink-0 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="size-4" />
          <span className="absolute top-2 right-2 size-1.5 bg-red-500 rounded-full ring-2 ring-background" />
        </Button>
        <ThemeToggle />

        <div className="h-6 w-px bg-border mx-1" />

        {admin ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 pl-2 pr-1 h-auto py-1 hover:bg-muted/50 rounded-full">
                <div className="size-8 bg-muted rounded-full overflow-hidden border border-border flex items-center justify-center">
                  <span className="font-semibold text-xs">{admin.username.charAt(0).toUpperCase()}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <User className="size-4" />
                <span>Профиль</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="gap-2 text-red-600 focus:text-red-600 cursor-pointer" 
                onSelect={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                <LogOut className="size-4" />
                <span>Выйти</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="ghost" size="sm" className="gap-2 pl-2 pr-1 h-auto py-1 hover:bg-muted/50 rounded-full">
            <div className="size-8 bg-muted rounded-full overflow-hidden border border-border flex items-center justify-center">
              <span className="font-semibold text-xs">A</span>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
}
