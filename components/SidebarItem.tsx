import { SidebarItemProps } from "@/interfaces/interfaces";
import Link from "next/link";

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  text,
  open,
  className = "",
  active = false,
  link = "",
  onClick,
}) => (
  <Link
    href={link}
    onClick={onClick}
    className={`flex items-center py-4 px-4 text-base font-semibold rounded-lg transition-colors duration-200 no-underline ${
      active
        ? "bg-[var(--color-primary)] text-white"
        : "text-[var(--text-light)] hover:bg-[var(--input-bg)] dark:hover:bg-[var(--color-slate-700)] hover:text-[var(--text-color)]"
    } ${className}`}
  >
    <div className="flex items-center justify-center">
      <Icon
        size={20}
        className={`mr-3 text-xl transition-colors duration-200 ${
          active
            ? "text-white"
            : "text-[var(--text-light)] hover:text-[var(--color-primary)] dark:hover:text-white"
        }`}
      />
    </div>
    {open && (
      <span
        className={`mr-3 transition-colors duration-200 ${
          active
            ? "text-white"
            : "text-[var(--text-light)] hover:text-[var(--color-primary)] dark:hover:text-white"
        }`}
      >
        {text}
      </span>
    )}
  </Link>
);
