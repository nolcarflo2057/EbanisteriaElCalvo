"use client";

import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@/shared/utils/cn";
import type { MenuItem } from "@/features/navigation/types/navigation.types";
import { useNavigationMenu } from "@/features/navigation/hooks/useNavigationMenu";

/**
 * Componente recursivo para renderizar un nivel del árbol de navegación.
 *
 * - Cada nodo con hijos (`item.children.length > 0`) muestra un chevron
 *   y abre un submenú anidado al hacer hover.
 * - No hay límite de profundidad: el componente se llama a sí mismo
 *   para cada nivel.
 * - No contiene lógica de dominio (género, tipo de producto, etc.).
 */
export function NavigationMenuNode({ items }: { items: MenuItem[] }) {
  const { handleMouseEnter, handleMouseLeave, isSubOpen } = useNavigationMenu();

  return (
    <div className="py-1">
      {items.map((item) => {
        const hasChildren = item.children.length > 0;
        return (
          <div
            key={item.id}
            className="relative"
            onMouseEnter={() => handleMouseEnter(item.slug, hasChildren)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={`/category/${item.slug}`}
              className="flex items-center justify-between px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-primary transition-colors"
            >
              <span>{item.name}</span>
              {hasChildren && (
                <ChevronRightIcon className="w-3.5 h-3.5 ml-2 shrink-0" />
              )}
            </Link>
            {hasChildren && isSubOpen(item.slug) && (
              <div className="absolute left-full top-0 z-50 min-w-[200px] bg-card border border-border rounded-md shadow-md ml-0.5">
                <NavigationMenuNode items={item.children} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


