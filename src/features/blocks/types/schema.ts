/**
 * Tipos base del motor de bloques declarativo.
 *
 * Cada bloque declara su propio esquema de metadatos (BlockSchema): el formulario
 * dinámico se auto-construye a partir de él y el renderer resuelve el componente.
 * Los datos (instancias) se persisten en store_page_blocks; la definición vive
 * en el registry (código) con posibilidad de overrides por tienda.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "multiselect"
  | "color"
  | "image"
  | "group" // agrupa sub-campos (sin valor propio)
  | "list"; // lista dinámica de objetos, cada uno con su propio esquema

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  default?: unknown;
  help?: string;
  options?: SelectOption[]; // select / multiselect
  fields?: FieldSchema[]; // group / list (esquema de cada elemento)
  visibleIf?: { key: string; value: unknown };
}

export interface BlockSchema {
  type: string; // identificador único, e.g. "hero"
  label: string; // nombre visible en el panel
  icon?: string;
  description?: string;
  fields: FieldSchema[];
  /**
   * Valores por defecto ricos usados al inyectar un bloque nuevo desde la
   * Paleta. Se prefieren sobre `fields[].default` para bloques cuyo contenido
   * vive en listas/objetos anidados (ej. servicesGrid.services, gallery.images).
   */
  defaultProps?: Record<string, unknown>;
}

export interface BlockInstance {
  id: string;
	tenantId: string;
  pageKey: string; // "home", etc.
  blockType: string; // referencia al BlockSchema (registry o override)
  label: string | null;
  props: Record<string, unknown>;
  visible: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
  /** Hijos para bloques contenedores (ej: container con columnas). */
  children?: BlockInstance[];
}

/** Definición completa de un bloque: schema (auto-declarado) + componente de render. */
export interface BlockDefinition<Props = Record<string, unknown>> {
  schema: BlockSchema;
  Component: React.ComponentType<{ props: Props; children?: React.ReactNode; tenantId?: string }>;
  /** Valores por defecto aplicados al crear una instancia nueva. */
  defaultProps?: Partial<Props>;
}
