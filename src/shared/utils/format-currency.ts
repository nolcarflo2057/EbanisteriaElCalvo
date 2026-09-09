import type { StoreConfig } from "@/features/stores/services/store-config.service";

/** Config por defecto para formateo de moneda cuando la tienda aún no carga. */
const FALLBACK_CONFIG = {
  locale: "es-CO",
  currency: "COP",
};

/** Formatea un monto con la moneda/locale de la tienda (con fallback genérico). */
export function formatCurrency(
  value: number,
  config?: Pick<StoreConfig, "locale" | "currency"> | null,
): string {
  const { locale, currency } = config ?? FALLBACK_CONFIG;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
