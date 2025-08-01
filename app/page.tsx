"use client";

import DashboardStatisticsNumbers from "@/components/dashboard-statistics-numbers";

export default function Home() {
  return (
    <div>
      <div>
        <h1 className="font-[Inter] text-[28px] font-semibold leading-[33.6px] text-[#012970]">
          Boshqaruv Paneli
        </h1>
        <p className="text-[16px] leading-[24px] text-[#6c757d] mt-[8px]">
          Assalomu alaykum, Dr. Salima Nosirova! Bugungi ish kuningiz haqida
          umumiy ma&apos;lumot.
        </p>
      </div>

      <div>
        <DashboardStatisticsNumbers />
      </div>
    </div>
  );
}
