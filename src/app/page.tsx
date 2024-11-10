"use client";

import Programs from "@/components/Programs";
import { Legend } from "@/components/Legend";
import Header from "@/components/Header";
import { StatisticsDashboard } from "@/components/StatisticsDashboard";

export default function Home() {
  return (
    <main className="min-h-screen p-2">
      <div className="m-4 items-center">
        <main className="flex flex-col gap-8 row-start-2 items-baseline sm:items-start w-full">
          <div className="w-full flex gap-4">
            <Header />
          </div>
          <StatisticsDashboard />
          <Programs />
          <Legend />
        </main>
      </div>
    </main>
  );
}
