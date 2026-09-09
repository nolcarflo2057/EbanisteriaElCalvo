"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/shared/utils/cn";
import type { MenuItem } from "@/features/navigation/types/navigation.types";

interface NavLevel {
  title: string;
  slug: string;
  items: MenuItem[];
}

interface Props {
  categories: MenuItem[];
  activeCategoryName: string;
}

export function TopMenuMobile({ categories, activeCategoryName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [navStack, setNavStack] = useState<NavLevel[]>([
    { title: "Categorías", slug: "", items: categories },
  ]);

  const accordionRef = useRef<HTMLDivElement>(null);

  const currentLevel = navStack[navStack.length - 1];
  const isRootLevel = navStack.length === 1;

  function handleNavigate(item: MenuItem) {
    if (item.children.length > 0) {
      setNavStack([...navStack, { title: item.name, slug: item.slug, items: item.children }]);
    }
  }

  function handleBack() {
    setNavStack(navStack.slice(0, -1));
  }

  function handleClose() {
    setIsOpen(false);
    setNavStack([{ title: "Categorías", slug: "", items: categories }]);
  }

  useEffect(() => {
    if (!isOpen) {
      Promise.resolve().then(() => {
        setNavStack([{ title: "Categorías", slug: "", items: categories }]);
      });
    }
  }, [isOpen, categories]);

  useEffect(() => {
    const handleClose = (event: Event) => {
      if (!isOpen) return;

      if (event.type === "scroll") {
        setIsOpen(false);
      }

      if (
        event.type === "mousedown" &&
        accordionRef.current &&
        !accordionRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClose);
    window.addEventListener("scroll", handleClose, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleClose);
      window.removeEventListener("scroll", handleClose);
    };
  }, [isOpen]);

  return (
    <div ref={accordionRef} className="sm:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full border-t border-border/50 bg-background flex items-center justify-between px-5 py-2.5 relative z-10 transition-shadow duration-300 cursor-pointer",
          isOpen && "shadow-md"
        )}
      >
        <div className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
          <span>Explorar</span>
          <span
            className={cn(
              "transform transition-transform duration-300 text-[10px]",
              isOpen && "rotate-180"
            )}
          >
            ▼
          </span>
        </div>

        <div className="text-sm font-bold text-primary">
          {isRootLevel ? activeCategoryName : currentLevel.title}
        </div>
      </button>

      <div
        className={cn(
          "absolute left-0 w-full overflow-hidden transition-all duration-300 ease-in-out bg-background shadow-lg",
          isOpen ? "max-h-125 border-b border-border/50" : "max-h-0"
        )}
      >
        <div className="flex flex-col px-5 pt-1 pb-4">
          {/* Back button (only when drilling down) */}
          {!isRootLevel && (
            <div className="flex items-center justify-between border-b border-border/50 py-2.5 mb-1">
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-sm font-semibold text-primary"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                Volver
              </button>
              <span className="text-xs font-bold text-muted-foreground uppercase">
                {currentLevel.title}
              </span>
            </div>
          )}

          {/* "Ver todo" link for sub-levels */}
          {!isRootLevel && (
            <Link
              onClick={handleClose}
              className="py-2.5 text-sm font-semibold text-primary border-b border-border/50"
              href={`/category/${currentLevel.slug}`}
            >
              Ver todo en {currentLevel.title}
            </Link>
          )}

          {/* "Todos" link only at root level */}
          {isRootLevel && (
            <Link
              onClick={handleClose}
              className="py-3 font-medium text-foreground border-b border-border/50 hover:text-primary transition-colors"
              href="/products"
            >
              Todos
            </Link>
          )}

          {/* Current level items */}
          {currentLevel.items.map((item) => {
            const hasChildren = item.children.length > 0;

            return (
              <div
                key={item.id}
                className="py-2.5 border-b border-border/50 flex items-center justify-between"
              >
                <Link
                  onClick={handleClose}
                  className="font-medium text-foreground hover:text-primary transition-colors flex-1"
                  href={`/category/${item.slug}`}
                >
                  {item.name}
                </Link>

                {hasChildren && (
                  <button
                    onClick={() => handleNavigate(item)}
                    className="p-1 text-primary hover:opacity-80 transition-opacity cursor-pointer rounded-md hover:bg-secondary ml-2"
                  >
                    <ChevronRightIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={handleClose}
            className="mt-2 pt-3 pb-1 w-full flex justify-center text-primary"
          >
            <ChevronUpIcon className="w-6 h-6 animate-bounce" />
          </button>
        </div>
      </div>
    </div>
  );
}
