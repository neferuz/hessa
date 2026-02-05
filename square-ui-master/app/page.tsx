"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const admin = localStorage.getItem("hessaAdmin");
      if (!admin) {
        router.push("/login");
      }
    };
    
    checkAuth();
    
    // Слушаем изменения в localStorage (для выхода)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "hessaAdmin" && !e.newValue) {
        router.push("/login");
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [router]);

  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full">
        <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background">
          <DashboardHeader />
          <DashboardContent />
        </div>
      </div> 
    </SidebarProvider>
  );
}
