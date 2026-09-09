"use client";

import { useSession, signOut } from "@/lib/auth/auth-client";
import { usePathname } from "next/navigation";
import { useEffect, useCallback, useMemo } from "react";

import type {
  SidebarNavItem,
  SidebarNavSection,
  UseSidebarReturn,
} from "./useSidebar.types";

/**
 * Hook principal para el Sidebar.
 * Encapsula: autenticación, roles, navegación condicional, acciones.
 */
export function useSidebar(onClose: () => void): UseSidebarReturn {
  const { data: session } = useSession();
  const pathname = usePathname();

  // ============================================
  // AUTH STATE
  // ============================================
  const user = useMemo(
    () => session?.user ? { role: (session.user as { role?: string }).role } : null,
    [session]
  );

  const userRole = user?.role || "";
  const isSuperAdmin = userRole === "super_admin";
  const isAdmin = userRole === "admin" || isSuperAdmin;
  const isAuthenticated = !!session?.user;

  // ============================================
  // ACTIONS
  // ============================================
  const handleSignOut = useCallback(async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
    onClose();
  }, [onClose]);

  const handleSearch = useCallback(
    (query: string) => {
      if (query.trim()) {
        onClose();
        window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
      }
    },
    [onClose]
  );

  // Auto-close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // ============================================
  // NAVIGATION SECTIONS (computed based on auth/role)
  // ============================================
  const navSections = useMemo<SidebarNavSection[]>(() => {
    const sections: SidebarNavSection[] = [];

    // Auth section
    if (isAuthenticated) {
      sections.push({
        items: [
          {
            href: "/profile",
            label: "Perfil",
            iconName: "UserIcon",
            onClick: onClose,
          },

          {
            href: "#",
            label: "Salir",
            iconName: "ArrowRightOnRectangleIcon",
            isDestructive: true,
            onClick: handleSignOut,
          },
        ],
      });
    } else {
      sections.push({
        items: [
          {
            href: "/login",
            label: "Ingresar",
            iconName: "ArrowLeftOnRectangleIcon",
            onClick: onClose,
          },
        ],
      });
    }

    // Admin section
    if (isAdmin) {
      const adminItems: SidebarNavItem[] = [
        {
          href: "/dashboard",
          label: "Panel de Control",
          iconName: "Cog6ToothIcon",
          onClick: onClose,
        },
        {
          href: "/dashboard/leads",
          label: "Leads / Contactos",
          iconName: "UsersIcon",
          onClick: onClose,
        },
        {
          href: "/dashboard/blocks",
          label: "CMS de Bloques",
          iconName: "ClipboardDocumentListIcon",
          onClick: onClose,
        },
        {
          href: "/dashboard/settings",
          label: "Configuración",
          iconName: "Cog6ToothIcon",
          onClick: onClose,
        },
      ];

      sections.push({
        label: "Administración",
        items: adminItems,
        divider: true,
      });
    }

    return sections;
  }, [isAuthenticated, isAdmin, isSuperAdmin, onClose, handleSignOut]);

  return {
    user,
    isAdmin,
    isSuperAdmin,
    isAuthenticated,
    handleSignOut,
    handleSearch,
    navSections,
  };
}