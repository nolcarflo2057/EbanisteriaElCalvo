"use client";

import { useState, useEffect } from "react";
import type { TenantThemeConfig } from "./tenant-theme.types";
import { DEFAULT_THEME_CONFIG } from "./tenant-theme.types";
import { useTenantThemeContext } from "./tenant-theme-context";

/**
 * Hook que obtiene la configuración de tema del tenant desde la API.
 * Si hay un TenantThemeProvider en el árbol (modo estático/mock), usa esa config
 * sin hacer llamadas a la API. Si no, busca la config por slug via fetch.
 */
export function useTenantTheme(tenantSlug?: string) {
  const ctxConfig = useTenantThemeContext();
  const [config, setConfig] = useState<TenantThemeConfig>(ctxConfig ?? DEFAULT_THEME_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si el provider de contexto ya tiene config, usarla directamente (modo estático)
    if (ctxConfig) {
      setConfig(ctxConfig);
      setLoading(false);
      return;
    }

    if (!tenantSlug) {
      setLoading(false);
      return;
    }

    async function fetchTheme() {
      try {
        const res = await fetch(`/api/tenant/theme?slug=${encodeURIComponent(tenantSlug!)}`);
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
        }
      } catch {
        // Fallback a defaults
      } finally {
        setLoading(false);
      }
    }

    void fetchTheme();
  }, [tenantSlug, ctxConfig]);

  return { config, loading };
}
