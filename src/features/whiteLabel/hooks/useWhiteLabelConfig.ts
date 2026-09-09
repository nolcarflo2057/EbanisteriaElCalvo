"use client";

import { useCallback, useEffect, useState } from "react";

export interface ConfigData {
  id?: number;
  tenantId?: string;
  slug: string;
  businessName: string;
  hours: string;
  phone: string;
  address: string;
  extraInfo?: string | null;
  logo?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  fontFamily?: string | null;
  whatsappNumber?: string | null;
  whatsappMessage?: string | null;
  showWhatsapp?: boolean;
  showChatbot?: boolean;
  // AI chatbot configuration fields
  chatbotMode?: "simple" | "advanced" | null;
  aiProvider?: string | null;
  aiModel?: string | null;
  aiSystemPrompt?: string | null;
  aiTemperature?: string | null;
  chatbotPrompt?: string | null;
  chatbotModel?: string | null;
  chatbotTemperature?: string | null;
  chatbotGreeting?: string | null;
  chatbotTags?: { id: string; tag: string; response: string }[] | null;
}

interface UseWhiteLabelConfigOptions {
  /** Slug explícito; si no se pasa, se deriva del subdominio del hostname. */
  slug?: string;
  refetchOnFocus?: boolean;
}

function deriveSlugFromHostname(): string {
  if (typeof window === "undefined") return "";
  const hostname = window.location.hostname.split(":")[0];
  const parts = hostname.split(".");
  return parts.length > 2 ? parts[0] : "";
}

/**
 * Hook que obtiene la configuración white-label por slug desde la API.
 * Se usa en el landing público para renderizar widgets dinámicos.
 */
export function useWhiteLabelConfig({ slug, refetchOnFocus = true }: UseWhiteLabelConfigOptions = {}) {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const resolvedSlug = slug ?? deriveSlugFromHostname();

  const fetchConfig = useCallback(async () => {
    if (!resolvedSlug) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/white-label/config?slug=${encodeURIComponent(resolvedSlug)}`);
      if (!res.ok) {
        if (res.status === 404) {
          setConfig(null);
          setLoading(false);
          return;
        }
        throw new Error(`Error ${res.status}`);
      }
      const data = await res.json();
      setConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando configuración");
    } finally {
      setLoading(false);
    }
  }, [resolvedSlug]);

  useEffect(() => {
    void fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (!refetchOnFocus) return;
    const handler = () => {
      if (document.visibilityState === "visible") void fetchConfig();
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [fetchConfig, refetchOnFocus]);

  return { config, loading, error, refetch: fetchConfig };
}
