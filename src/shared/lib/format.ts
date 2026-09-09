import { appConfig } from "@/config/app.config";
import type { StoreConfig } from "@/features/stores/services/store-config.service";

export function formatPrice(price: number, config?: Pick<StoreConfig, "locale" | "currency">): string {
  const locale = config?.locale ?? appConfig.store.locale;
  const currency = config?.currency ?? appConfig.store.currency;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPriceWithDefault(price: number): string {
  return formatPrice(price);
}
