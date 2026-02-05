"use client";

import { useState, useEffect } from "react";
import { StatCard } from "./stat-card";
import { ChartCard } from "./chart-card";
import { PeopleTable } from "./people-table";
import { RecentDocuments } from "./recent-documents";
import { useDashboardStore } from "@/store/dashboard-store";

export function DashboardContent() {
  const [stats, setStats] = useState([
    { id: 1, title: "Пользователи", value: "-", icon: "users" },
    { id: 2, title: "Сотрудники", value: "-", icon: "clipboard" },
    { id: 3, title: "Продукты", value: "-", icon: "invoice" },
    { id: 4, title: "Выручка", value: "-", icon: "wallet" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats([
            { id: 1, title: "Пользователи", value: data.users_count.toString(), icon: "users" },
            { id: 2, title: "Сотрудники", value: data.employees_count.toString(), icon: "clipboard" },
            { id: 3, title: "Продукты", value: data.products_count.toString(), icon: "invoice" },
            { id: 4, title: "Выручка", value: (data.revenue || 0).toLocaleString() + " сум", icon: "wallet" },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden p-4 h-full">
      <div className="mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              icon={stat.icon as "users" | "clipboard" | "wallet" | "invoice"}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard />
          <RecentDocuments />
        </div>

        <PeopleTable />
      </div>
    </div>
  );
}
