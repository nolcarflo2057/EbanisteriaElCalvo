"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Switch } from "@/shared/components/ui/Switch";
import {
  saveClientSpecAction,
  getClientSpecsAction,
  deleteClientSpecAction,
} from "@/features/admin/actions/modules.actions";
import tiersConfig from "@/config/tiers.json";

interface SpecModule {
  name: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface ClientSpec {
  slug: string;
  tier: string | null;
  modules: string[];
  updatedAt?: string;
}

interface SpecGeneratorProps {
  optionalModules: SpecModule[];
}

type TierKey = keyof typeof tiersConfig.tiers;

export function SpecGenerator({ optionalModules }: SpecGeneratorProps) {
  const availableTiers = useMemo(
    () =>
      Object.entries(tiersConfig.tiers).filter(
        ([, meta]) => meta.available,
      ) as [TierKey, (typeof tiersConfig.tiers)[TierKey]][],
    [],
  );
  const unavailableTiers = useMemo(
    () =>
      Object.entries(tiersConfig.tiers).filter(
        ([, meta]) => !meta.available,
      ) as [TierKey, (typeof tiersConfig.tiers)[TierKey]][],
    [],
  );

  const notImplemented = new Set<string>(tiersConfig.notImplemented);

  const [slug, setSlug] = useState("preview");
  const [selectedTier, setSelectedTier] = useState<TierKey | "custom" | null>(
    "custom"
  );
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const m of optionalModules) {
      init[m.name] = m.enabled;
    }
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [specs, setSpecs] = useState<ClientSpec[]>([]);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [loadingSpecs, setLoadingSpecs] = useState(true);

  const refreshSpecs = useCallback(async () => {
    const result = await getClientSpecsAction();
    if (result.success) setSpecs(result.data);
    setLoadingSpecs(false);
  }, []);

  useEffect(() => {
    refreshSpecs();
  }, [refreshSpecs]);

  const slugTrimmed = slug.trim();
  const existingSpec = specs.find((s) => s.slug === slugTrimmed);
  function startEdit(spec: ClientSpec) {
    setEditingSlug(spec.slug);
    setSlug(spec.slug);
    if (spec.tier && spec.tier in tiersConfig.tiers) {
      selectTier(spec.tier as TierKey);
    } else {
      setSelectedTier("custom");
      const next: Record<string, boolean> = {};
      for (const mod of optionalModules) {
        next[mod.name] = spec.modules.includes(mod.name);
      }
      setEnabled(next);
    }
    setFeedback({
      ok: true,
      message: `Editando spec de "${spec.slug}". Guarda para aplicar los cambios.`,
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleDelete(target: string) {
    if (confirmDelete !== target) {
      setConfirmDelete(target);
      return;
    }
    const result = await deleteClientSpecAction(target);
    if (result.success) {
      if (editingSlug === target) resetForm();
      setFeedback({ ok: true, message: `Spec "${target}" eliminada` });
    } else {
      setFeedback({ ok: false, message: result.error });
    }
    setConfirmDelete(null);
    refreshSpecs();
  }

  function resetForm() {
    setEditingSlug(null);
    setSlug("preview");
    setSelectedTier("custom");
    const next: Record<string, boolean> = {};
    for (const m of optionalModules) {
      next[m.name] = m.enabled;
    }
    setEnabled(next);
  }

  const tierLocked = selectedTier !== null && selectedTier !== "custom";

  function selectTier(key: TierKey) {
    setSelectedTier(key);
    setFeedback(null);
    const next: Record<string, boolean> = {};
    for (const mod of optionalModules) {
      next[mod.name] =
        tiersConfig.tiers[key].modules !== "*" &&
        (tiersConfig.tiers[key].modules as string[]).includes(mod.name);
    }
    setEnabled(next);
  }

  function selectCustom() {
    setSelectedTier("custom");
    setFeedback(null);
    const next: Record<string, boolean> = {};
    for (const mod of optionalModules) {
      next[mod.name] =
        !notImplemented.has(mod.name) && (enabled[mod.name] ?? mod.enabled);
    }
    setEnabled(next);
  }

  function toggleModule(moduleName: string, value: boolean) {
    if (tierLocked || notImplemented.has(moduleName)) return;
    setEnabled((prev) => ({ ...prev, [moduleName]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setFeedback(null);

    const modules = optionalModules
      .map((m) => m.name)
      .filter((n) => enabled[n]);

    const result = await saveClientSpecAction({
      slug: slug.trim(),
      tier: selectedTier && selectedTier !== "custom" ? selectedTier : null,
      modules,
    });

    if (result.success) {
      setEditingSlug(null);
      setFeedback({
        ok: true,
        message: `Spec guardada en ${result.data.specPath}. Empaqueta con: pnpm release:client ${slug.trim()}`,
      });
      refreshSpecs();
    } else {
      setFeedback({ ok: false, message: result.error });
    }
    setSaving(false);
  }

  const slugValid = /^[a-z0-9-]+$/.test(slug.trim());
  const canSave = slugValid && selectedTier !== null && !saving;

  return (
    <section ref={formRef} className="mt-12 pt-8 border-t border-border">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-lg font-semibold text-foreground">
          Generador de Empaquetado
        </h2>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
          Specs de cliente
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Registra el plan comercial del cliente. Genera{" "}
        <code className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
          clients/&lt;slug&gt;.json
      </code>{" "}
        y luego ejecuta{" "}
        <code className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
          pnpm release:client &lt;slug&gt;
        </code>{" "}
        en la terminal.
      </p>

      {/* Specs registradas */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Specs registradas
          </h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
            {specs.length}
          </span>
        </div>
        {loadingSpecs ? (
          <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : specs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-6">
            <p className="text-xs text-muted-foreground text-center">
              Aún no hay specs guardadas. Crea la primera con el formulario.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {specs.map((spec) => {
              const isEditing = editingSlug === spec.slug;
              return (
                <div
                  key={spec.slug}
                  className={`flex items-center justify-between p-4 ${
                    isEditing ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm text-foreground">
                        {spec.slug}
                      </p>
                      {spec.tier ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary">
                          {spec.tier}
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-secondary text-secondary-foreground">
                          custom
                        </span>
                      )}
                      {isEditing && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Editando
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                      {spec.slug} · {spec.modules.length} módulos
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(spec)}
                      className="h-8 px-3 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(spec.slug)}
                      className={`h-8 px-3 rounded-lg text-xs font-medium border transition-colors ${
                        confirmDelete === spec.slug
                          ? "border-red-300 bg-red-50 text-red-700 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300"
                          : "border-border text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                      }`}
                    >
                      {confirmDelete === spec.slug ? "¿Confirmar?" : "Eliminar"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tier selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {availableTiers.map(([key, meta]) => {
          const active = selectedTier === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => selectTier(key)}
              className={`text-left p-4 rounded-xl border transition-colors ${
                active
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm text-foreground">
                  {meta.label}
                </p>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {key}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {meta.description}
              </p>
            </button>
          );
        })}
        <button
          type="button"
          onClick={selectCustom}
          className={`text-left p-4 rounded-xl border transition-colors ${
            selectedTier === "custom"
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:border-primary/40"
          }`}
        >
          <p className="font-medium text-sm text-foreground">Personalizado</p>
          <p className="text-xs text-muted-foreground mt-1">
            Elige módulos uno por uno
          </p>
        </button>
        {unavailableTiers.map(([key, meta]) => (
          <div
            key={key}
            className="text-left p-4 rounded-xl border border-dashed border-border bg-card opacity-60 cursor-not-allowed relative"
            title={"note" in meta ? meta.note : undefined}
          >
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm text-foreground">{meta.label}</p>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Próximamente
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {meta.description}
            </p>
          </div>
        ))}
      </div>

      {/* Tier summary (modo tier) o switches (solo modo custom) */}
      {selectedTier && selectedTier !== "custom" ? (
        <div className="rounded-xl border border-border bg-card p-4 mb-8">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Este plan incluye
          </p>
          <div className="flex flex-wrap gap-2">
            {(tiersConfig.tiers[selectedTier].modules === "*"
              ? optionalModules.map((m) => m.name)
              : (tiersConfig.tiers[selectedTier].modules as string[])
            ).map((modName) => {
              const mod = optionalModules.find((m) => m.name === modName);
              return (
                <span
                  key={modName}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                >
                  {mod ? mod.label.replace("└─ ", "") : modName}
                </span>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            Los módulos core (auth, configuración, uploads...) van siempre
            incluidos.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card divide-y divide-border mb-8">
          {optionalModules
            .filter((mod) => !mod.name.includes('_'))
            .map((mod) => {
            const phantom = notImplemented.has(mod.name);
            const children = optionalModules.filter((child) => child.name.startsWith(mod.name + '_'));
            const isParentEnabled = enabled[mod.name] ?? false;

            return (
              <div key={mod.name} className="flex flex-col">
                <div className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1 pr-4">
                    <div className="flex items-center gap-2">
                      <p
                        className={`font-medium text-sm flex items-center gap-1.5 ${
                          phantom
                            ? "text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {mod.label.replace("└─ ", "")}
                        {children.length > 0 && (
                          <svg
                            className={`w-4 h-4 text-muted-foreground/60 transition-transform ${
                              isParentEnabled ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </p>
                      {phantom && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Próximamente
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {mod.description}
                    </p>
                  </div>
                  <Switch
                    checked={isParentEnabled}
                    onChange={(checked) => {
                      toggleModule(mod.name, checked);
                      if (!checked) {
                        // Turn off children if parent is turned off
                        children.forEach((child) => setEnabled((prev) => ({ ...prev, [child.name]: false })));
                      }
                    }}
                    disabled={phantom}
                  />
                </div>
                
                {/* Children rendering */}
                {children.length > 0 && isParentEnabled && (
                  <div className="bg-card pb-3 pl-10 pr-4 relative">
                    {/* Línea vertical conectora para el árbol jerárquico */}
                    <div className="absolute left-6 top-0 bottom-6 w-px bg-border/80"></div>
                    
                    <div className="flex flex-col gap-1">
                      {children.map((child) => {
                        const childPhantom = notImplemented.has(child.name);
                        return (
                          <div key={child.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors relative">
                            {/* Línea horizontal conectora */}
                            <div className="absolute -left-4 top-1/2 w-3 h-px bg-border/80"></div>
                            
                            <div className="min-w-0 flex-1 pr-4">
                              <div className="flex items-center gap-2">
                                <p className={`font-medium text-sm ${childPhantom ? "text-muted-foreground" : "text-foreground"}`}>
                                  {child.label.replace("└─ ", "")}
                                </p>
                                {childPhantom && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                    Próximamente
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {child.description}
                              </p>
                            </div>
                            <Switch
                              checked={enabled[child.name] ?? false}
                              onChange={(checked) => toggleModule(child.name, checked)}
                              disabled={childPhantom}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Client data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-foreground">
            Slug (identificador) *
          </span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase())}
            placeholder="ebanisteria-el-calvo"
            className="h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {slug.length > 0 && !slugValid && (
            <span className="text-[11px] text-red-600 dark:text-red-400">
              Solo minúsculas, números y guiones
            </span>
          )}
          {slugValid && existingSpec && editingSlug !== existingSpec.slug && (
            <span className="text-[11px] text-amber-600 dark:text-amber-400">
              Ya existe una spec para &quot;{existingSpec.slug}&quot;
            </span>
          )}
        </label>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving
            ? "Guardando..."
            : editingSlug
              ? "Guardar Cambios"
              : "Guardar Especificación"}
        </button>
        {editingSlug && (
          <button
            type="button"
            onClick={resetForm}
            className="h-10 px-4 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
          >
            Cancelar edición
          </button>
        )}
        {!selectedTier && (
          <p className="text-xs text-muted-foreground">
            Selecciona un tier o modo personalizado para empezar
          </p>
        )}
      </div>

      {feedback && (
        <div
          className={`mt-4 p-4 rounded-xl border text-sm ${
            feedback.ok
              ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
              : "border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800 text-red-800 dark:text-red-200"
          }`}
        >
          {feedback.ok ? "✅ " : "❌ "}
          {feedback.message}
        </div>
      )}
    </section>
  );
}


