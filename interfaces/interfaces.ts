export interface SidebarItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  text: string;
  open: boolean;
  className?: string;
  active?: boolean;
  link?: string;
  onClick: () => void;
}
