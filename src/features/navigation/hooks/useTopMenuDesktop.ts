"use client";

import { useState, useCallback, useMemo } from "react";
import type { MenuItem } from "@/features/navigation/types/navigation.types";

interface UseTopMenuDesktopProps {
  categories: MenuItem[];
  activeCategoryName: string;
}

interface UseTopMenuDesktopReturn {
  openDropdown: string | null;
  handleMouseEnter: (slug: string, hasChildren: boolean) => void;
  handleMouseLeave: () => void;
  isDropdownOpen: (slug: string) => boolean;
  getCategoryProps: (category: MenuItem) => {
    isActive: boolean;
    hasChildren: boolean;
  };
}

export function useTopMenuDesktop({
  categories,
  activeCategoryName,
}: UseTopMenuDesktopProps): UseTopMenuDesktopReturn {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleMouseEnter = useCallback((slug: string, hasChildren: boolean) => {
    if (hasChildren) {
      setOpenDropdown(slug);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  const isDropdownOpen = useCallback((slug: string) => openDropdown === slug, [openDropdown]);

  const getCategoryProps = useCallback(
    (category: MenuItem) => ({
      isActive: activeCategoryName === category.name,
      hasChildren: category.children.length > 0,
    }),
    [activeCategoryName]
  );

  return useMemo(
    () => ({
      openDropdown,
      handleMouseEnter,
      handleMouseLeave,
      isDropdownOpen,
      getCategoryProps,
    }),
    [openDropdown, handleMouseEnter, handleMouseLeave, isDropdownOpen, getCategoryProps]
  );
}