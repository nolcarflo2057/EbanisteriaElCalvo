"use client";

import { useState, useCallback, useMemo } from "react";
import type { MenuItem } from "@/features/navigation/types/navigation.types";

interface UseNavigationMenuReturn {
  openSub: string | null;
  handleMouseEnter: (slug: string, hasChildren: boolean) => void;
  handleMouseLeave: () => void;
  isSubOpen: (slug: string) => boolean;
}

export function useNavigationMenu(): UseNavigationMenuReturn {
  const [openSub, setOpenSub] = useState<string | null>(null);

  const handleMouseEnter = useCallback((slug: string, hasChildren: boolean) => {
    if (hasChildren) {
      setOpenSub(slug);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOpenSub(null);
  }, []);

  const isSubOpen = useCallback((slug: string) => openSub === slug, [openSub]);

  return useMemo(
    () => ({
      openSub,
      handleMouseEnter,
      handleMouseLeave,
      isSubOpen,
    }),
    [openSub, handleMouseEnter, handleMouseLeave, isSubOpen]
  );
}

/**
 * Hook para encontrar una categoría por slug en el árbol (búsqueda recursiva).
 */
export function useFindCategoryBySlug(tree: MenuItem[] = []) {
  return useCallback(
    (slug: string): MenuItem | null => {
      const findIn = (nodes: MenuItem[]): MenuItem | null => {
        for (const item of nodes) {
          if (item.slug === slug) return item;
          const found = item.children ? findIn(item.children) : null;
          if (found) return found;
        }
        return null;
      };
      return findIn(tree);
    },
    [tree]
  );
}

/**
 * Hook para filtrar nodos del árbol por query de búsqueda.
 */
export function useFilteredMenuItems(items: MenuItem[], query: string): MenuItem[] {
  return useMemo(() => {
    if (!query.trim()) return items;

    const lowerQuery = query.toLowerCase().trim();

    const filterNode = (node: MenuItem): MenuItem | null => {
      const matchesName = node.name.toLowerCase().includes(lowerQuery);
      const matchesChildren =
        node.children && node.children.some((child) => filterNode(child) !== null);

      if (matchesName || matchesChildren) {
        return {
          ...node,
          children: node.children
            ? node.children.map(filterNode).filter((n): n is MenuItem => n !== null)
            : [],
        };
      }
      return null;
    };

    return items
      .map(filterNode)
      .filter((n): n is MenuItem => n !== null);
  }, [items, query]);
}