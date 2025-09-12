"use client";
import LoadingOverlay from "@/components/LoadingOverlay";
import dynamic from "next/dynamic";

const LoginClientComponent = dynamic(
  () => import("@/components/LoginClientComponent"),
  { ssr: false, loading: () => <LoadingOverlay /> }
);

export default function LoginPage() {
  return <LoginClientComponent />;
}
