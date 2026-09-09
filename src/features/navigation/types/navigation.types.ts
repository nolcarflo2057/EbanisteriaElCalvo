/**
 * Definición de un atributo de categoría (heredada del dominio).
 */
import type { AttributeDefinition } from "@/db/schema/core";

export interface NavigationAttribute {
  name: string;
  type: AttributeDefinition["type"];
  allowedValues: string[];
  required?: boolean;
}

export const labels: Record<string, string> = {
  text: "Texto",
  number: "Número",
  boolean: "Booleano",
  select: "Selección",
  multiselect: "Multi-selección",
  color: "Color",
  checkbox: "Checkbox",
  date: "Fecha",
  image: "Imagen",
};

/**
 * Nodo de navegación serializado desde Category.toJSON().
 * Estructura jerárquica que representa un árbol de categorías.
 */
export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  attributes: AttributeDefinition[];
  inheritedAttributes: AttributeDefinition[];
  children: MenuItem[];
}
