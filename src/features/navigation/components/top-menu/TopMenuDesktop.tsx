"use client";

import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import type { MenuItem } from "@/features/navigation/types/navigation.types";
import { NavigationMenuNode } from "./NavigationMenuNode";
import { useTopMenuDesktop } from "@/features/navigation/hooks/useTopMenuDesktop";

interface Props {
  categories: MenuItem[];
  activeCategoryName: string;
}

export function TopMenuDesktop({ categories, activeCategoryName }: Props) {
  const { handleMouseEnter, handleMouseLeave, isDropdownOpen, getCategoryProps } = useTopMenuDesktop({
    categories,
    activeCategoryName,
  });

  return (
    <div className="hidden sm:flex items-center gap-1">
      <Link
        href="/products"
        className={cn(
          "relative px-3 py-2 text-sm font-medium transition-all",
          activeCategoryName === "Todos"
            ? "text-primary scale-105 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-primary after:rounded-full"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Todos
      </Link>

      {categories.map((category) => {
        const { isActive, hasChildren } = getCategoryProps(category);

        return (
          <div
            key={category.id}
            className="relative"
            onMouseEnter={() => handleMouseEnter(category.slug, hasChildren)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={`/category/${category.slug}`}
              className={cn(
                "relative px-3 py-2 text-sm font-medium transition-all flex items-center gap-1",
                isActive
                  ? "text-primary scale-105 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-primary after:rounded-full"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {category.name}
              {hasChildren && (
                <span
                  className={cn(
                    "inline-block transition-transform duration-200 text-[10px]",
                    isDropdownOpen(category.slug) && "rotate-180"
                  )}
                >
                  ▼
                </span>
              )}
            </Link>

            {hasChildren && isDropdownOpen(category.slug) && (
              <div className="absolute left-0 top-full z-50 min-w-[200px] bg-card border border-border rounded-md shadow-md animate-fade-in">
                <NavigationMenuNode items={category.children} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


