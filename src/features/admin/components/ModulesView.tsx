"use client";

import Link from "next/link";
import { useState } from "react";
import { SpecGenerator } from "@/features/admin/components/SpecGenerator";
import type { ModuleName } from "@/config/modules";

interface ModuleItem {
  name: ModuleName;
  label: string;
  description: string;
  enabled: boolean;
  core: boolean;
  routes: string[];
}

interface ModulesViewProps {
  initialModules: ModuleItem[];
  initialError: string | null;
}

export function ModulesView({ initialModules, initialError }: ModulesViewProps) {
  const [modules] = useState<ModuleItem[]>(initialModules);
  const [error] = useState<string | null>(initialError);

  const coreModules = modules.filter((m) => m.core);
  const optionalModules = modules.filter((m) => !m.core);

  if (error && modules.length === 0) {
    return (
      <div className="min-h-screen bg-background w-full">
        <div className="flex flex-col w-full max-w-4xl mx-auto px-5 py-8">
          <h1 className="text-2xl font-bold text-foreground mb-6">Módulos</h1>
          <div className="p-4 rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800">
            <p className="font-medium text-red-800 dark:text-red-200 text-sm">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="flex flex-col w-full max-w-4xl mx-auto px-5 py-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Módulos</h1>
            <p className="text-sm text-muted-foreground">
              Centro de control de empaquetado del repositorio maestro
            </p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors border border-border px-4 py-2 rounded-lg hover:bg-secondary/50"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Volver al Dashboard
        </Link>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800">
          <p className="font-medium text-red-800 dark:text-red-200 text-sm">
            {error}
          </p>
        </div>
      )}

      {/* Core Modules */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Módulos Core
          </h2>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
            Siempre activos
          </span>
        </div>
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {coreModules.map((mod) => (
            <div
              key={mod.name}
              className="flex items-center justify-between p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm text-foreground">
                    {mod.label}
                  </p>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary">
                    Core
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {mod.description}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Activo
              </span>
            </div>
          ))}
        </div>
      </section>



      {/* Generador de Empaquetado (Specs de cliente) */}
      <SpecGenerator
        optionalModules={optionalModules.map((m) => ({
          name: m.name,
          label: m.label,
          description: m.description,
          enabled: m.enabled,
        }))}
      />
      </div>
    </div>
  );
}
