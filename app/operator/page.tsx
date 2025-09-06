"use client";
import dynamic from "next/dynamic";

const OperatorPageClient = dynamic(
  () => import("./components/OperatorPageClient"),
  { ssr: false } // serverda render qilinmaydi
);

export default function OperatorPage() {
  return <OperatorPageClient />;
}
