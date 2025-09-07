// Fayl manzili: app/patients-panel/layout.tsx

import type { Metadata } from "next";
import DashboardClientLayout from "./clientlayout"; // Client komponentimizni import qilamiz

export const metadata: Metadata = {
  title: "Shaxsiy kabinet",
  description:
    "MedMapp bemorlar uchun shaxsiy boshqaruv paneli, arizalar, konsultatsiyalar va izohlarni boshqarish.",
};

export default function DashboardServerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
