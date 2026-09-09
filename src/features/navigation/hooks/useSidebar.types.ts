import { ReactNode } from "react";

/** Items de navegación del sidebar */
export interface SidebarNavItem {
  href: string;
  label: string;
  iconName: string;
  isDestructive?: boolean;
  isAdminOnly?: boolean;
  isSuperAdminOnly?: boolean;
  onClick?: () => void;
}

/** Sección de navegación */
export interface SidebarNavSection {
  label?: string;
  items: SidebarNavItem[];
  divider?: boolean;
}

/** Props del sidebar */
export interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

/** Estado del hook */
export interface UseSidebarReturn {
  /** Usuario autenticado */
  user: { role?: string } | null;
  /** Si el usuario es admin */
  isAdmin: boolean;
  /** Si el usuario es super_admin */
  isSuperAdmin: boolean;
  /** Si el usuario está autenticado */
  isAuthenticated: boolean;
  /** Handler para cerrar sesión */
  handleSignOut: () => Promise<void>;
  /** Maneja búsqueda */
  handleSearch: (query: string) => void;
  /** Secciones de navegación computadas */
  navSections: SidebarNavSection[];
}