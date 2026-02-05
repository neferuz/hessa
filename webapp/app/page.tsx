"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import FilterTabs from "@/components/FilterTabs";
import AIChat from "@/components/AIChat";
import ProductCard from "@/components/ProductCard";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Все товары");

  return (
    <main className="min-h-screen pb-32 bg-[#FAFAFB] relative max-w-md mx-auto overflow-x-hidden font-inter">
      {/* Decorative Mesh Gradient */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-blue-400/10 blur-[100px] rounded-full z-0" />
      <div className="absolute top-[5%] left-[-10%] w-[250px] h-[250px] bg-emerald-400/5 blur-[80px] rounded-full z-0" />

      <div className="relative z-10">
        <Header />
        <Hero />
        <SearchBar />
        <FilterTabs active={activeCategory} setActive={setActiveCategory} />
        <ProductCard activeCategory={activeCategory} />
      </div>
      <BottomNav />
    </main>
  );
}
