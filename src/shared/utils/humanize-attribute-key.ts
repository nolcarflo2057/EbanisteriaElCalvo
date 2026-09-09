/**
 * Formatea cualquier clave de atributo de forma genérica y legible.
 * "talla" -> "Talla", "voltaje_max" -> "Voltaje Max", "tipo-conexion" -> "Tipo Conexion".
 * Sin supuestos de vertical: no hay palabras reservadas de ningún dominio.
 */
export function humanizeAttributeKey(key: string): string {
  if (!key) return "";
  return key
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ")
    .trim();
}
