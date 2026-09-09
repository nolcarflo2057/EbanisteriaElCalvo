import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import type { MenuItem } from "@/features/navigation/types/navigation.types";

/**
 * Busca recursivamente una categoría por slug en el árbol.
 */
function findCategoryBySlug(tree: MenuItem[], slug: string): MenuItem | null {
  for (const item of tree) {
    if (item.slug === slug) return item;
    const found = findCategoryBySlug(item.children, slug);
    if (found) return found;
  }
  return null;
}

/**
 * Extrae el slug de una ruta /[domain]/category/{slug}.
 * Soporta slugs con guiones (ej: "hombre-sweatshirt").
 */
function extractSlugFromPath(pathname: string): string | null {
  // El pathname puede venir como /pijamas-luna/category/hombre-accesorios
  // o /category/hombre-accesorios (sin middleware)
  const match = pathname.match(/\/category\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Verifica si la ruta es una ruta de tienda (pública).
 * Maneja el segmento de dominio opcional: /[domain]/products, /[domain]/category/...
 */
function isStoreRoute(pathname: string): boolean {
  // Quitar el segmento de dominio si existe (primer segmento)
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return true; // raíz
  
  // Si el primer segmento parece un dominio (contiene guión o es conocido), saltarlo
  const pathWithoutDomain = segments.length >= 2 && (segments[0].includes("-") || segments[0].includes(".")) 
    ? "/" + segments.slice(1).join("/") 
    : pathname;
  
  return (
    pathWithoutDomain === "/products" ||
    pathWithoutDomain.startsWith("/category/") ||
    pathWithoutDomain.startsWith("/search")
  );
}

/**
 * Hook que gestiona la lógica del Top Menu.
 * Calcula estado activo de la ruta dinámica basándose en slugs del árbol.
 */
export function useTopMenu(categories: MenuItem[] = []) {
  const totalItemsInCart = 0;
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname() || "";

  // Buscar la categoría activa en todo el árbol (profundidad arbitraria)
  const activeSlug = extractSlugFromPath(pathname);
  const currentCategory = activeSlug
    ? findCategoryBySlug(categories, activeSlug)
    : null;

  const activeCategoryName = currentCategory?.name ?? (
    isStoreRoute(pathname) && pathname.includes("/products") ? "Todos" : ""
  );

  const isStoreRouteResult = isStoreRoute(pathname);

  useEffect(() => {
    Promise.resolve().then(() => setLoaded(true));
  }, []);

  return {
    loaded,
    totalItemsInCart,
    activeCategoryName,
    currentCategory,
    isStoreRoute: isStoreRouteResult,
  };
}
