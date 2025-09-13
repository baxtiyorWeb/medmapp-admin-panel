import { ReactNode } from "react";

export default function Notification({
  type,
  message,
}: {
  type: string;
  message: ReactNode;
}) {
  let bgClass, textClass, borderClass, icon;
  switch (type) {
    case "warning":
      bgClass = "bg-yellow-100 dark:bg-yellow-900";
      textClass = "text-yellow-700 dark:text-yellow-200";
      borderClass = "border-yellow-300 dark:border-yellow-700";
      icon = "bi-exclamation-triangle-fill";
      break;
    case "error":
      bgClass = "bg-red-100 dark:bg-red-900";
      textClass = "text-red-700 dark:text-red-200";
      borderClass = "border-red-300 dark:border-red-700";
      icon = "bi-exclamation-circle-fill";
      break;
    case "success":
      bgClass = "bg-green-100 dark:bg-green-900";
      textClass = "text-green-700 dark:text-green-200";
      borderClass = "border-green-300 dark:border-green-700";
      icon = "bi-check-circle-fill";
      break;
    default:
      return null;
  }
  return (
    <div
      className={`notification ${type} flex items-center gap-2 p-4 mb-4 ${bgClass} ${textClass} border ${borderClass} rounded-lg`}
    >
      <i className={`bi ${icon} text-2xl`}></i>
      <span>{message}</span>
    </div>
  );
}
