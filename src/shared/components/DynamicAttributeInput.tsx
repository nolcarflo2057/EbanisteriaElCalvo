"use client";

import type { AttributeDefinition } from "@/db/schema/core";
import { Switch } from "@/shared/components/ui/Switch";
import { cn } from "@/shared/utils/cn";
import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  definition: AttributeDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

export function DynamicAttributeInput({ definition, value, onChange, error }: Props) {

  const { key, name, type, allowedValues = [], required, defaultValue } = definition;

  const coercedValue = (() => {
    if (value !== null && value !== undefined) {
      if (type === "multiselect") {
        return Array.isArray(value) ? value : [];
      }
      if (type === "number") {
        return value === "" ? "" : Number(value);
      }
      if (type === "boolean") {
        return Boolean(value);
      }
      return String(value);
    }
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    if (type === "boolean") {
      return false;
    }
    if (type === "multiselect") {
      return [];
    }
    if (type === "number") {
      return "";
    }
    if (type === "text") {
      return "";
    }
    return "";
  })();

  const resolvedValue = coercedValue;

  switch (type) {
    case "text":
      return (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            {name}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
          <input
            type="text"
            value={resolvedValue as string}
            onChange={(e) => onChange(e.target.value)}
            className="p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
          />
          {error && <span className="text-xs text-destructive">{error}</span>}
        </div>
      );

    case "number":
      return (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            {name}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
          <input
            type="number"
            value={resolvedValue as string | number}
            onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
            className="p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
          />
          {error && <span className="text-xs text-destructive">{error}</span>}
        </div>
      );

    case "boolean":
      return (
        <div className="flex items-center justify-between gap-3 py-1">
          <label className="text-sm font-medium">
            {name}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">No</span>
            <Switch checked={Boolean(resolvedValue)} onChange={(v) => onChange(v)} />
            <span className="text-xs text-muted-foreground">Sí</span>
          </div>
          {error && <span className="text-xs text-destructive">{error}</span>}
        </div>
      );

      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">
              {name}
              {required && <span className="text-destructive ml-1">*</span>}
            </label>
            <input
              type="checkbox"
              checked={Boolean(resolvedValue)}
              onChange={(e) => onChange(e.target.checked)}
              className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            {error && <span className="text-xs text-destructive">{error}</span>}
          </div>
        );

      case "color":
        return (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              {name}
              {required && <span className="text-destructive ml-1">*</span>}
            </label>
            <input
              type="color"
              value={resolvedValue as string}
              onChange={(e) => onChange(e.target.value)}
              className="w-10 h-10 p-0 border rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
            />
            {error && <span className="text-xs text-destructive">{error}</span>}
          </div>
        );

    case "select":
      return (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            {name}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
          <select
            value={resolvedValue as string}
            onChange={(e) => onChange(e.target.value)}
            className="p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="">{`Selecciona ${name.toLowerCase()}...`}</option>
            {allowedValues.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          {error && <span className="text-xs text-destructive">{error}</span>}
        </div>
      );

    case "multiselect": {
      const selected = (Array.isArray(resolvedValue) ? resolvedValue : []) as string[];
      const available = allowedValues.filter((v) => !selected.includes(v));

      return (
        <div className="flex flex-col gap-2 bg-muted/20 border border-border p-3.5 rounded-xl shadow-xs">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {name}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>

          {/* Chips seleccionados */}
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 p-2 bg-background border border-border/80 rounded-xl min-h-[42px] items-center">
              {selected.map((v) => (
                <div
                  key={v}
                  className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 rounded-lg px-2.5 py-1 text-xs font-medium font-sans"
                >
                  <span>{v}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = selected.filter((s) => s !== v);
                      onChange(next);
                    }}
                    className="p-0.5 hover:bg-primary/10 rounded text-primary transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground italic px-1">Ninguna opción seleccionada</span>
          )}

          {/* Opciones disponibles */}
          {available.length > 0 && (
            <div className="space-y-1.5 border-t border-border/50 pt-2.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Opciones disponibles:</span>
              <div className="flex flex-wrap gap-1.5">
                {available.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      const next = [...selected, v];
                      onChange(next);
                    }}
                    className="px-2.5 py-1 text-xs rounded-lg border border-border bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all font-sans cursor-pointer"
                  >
                    + {v}
                  </button>
                ))}
              </div>
            </div>
          )}
          {error && <span className="text-xs text-destructive">{error}</span>}
        </div>
      );
    }

    default:
      // Fallback for unrecognized types: render as a text input
      return (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            {name}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
          <input
            type="text"
            value={resolvedValue as string}
            onChange={(e) => onChange(e.target.value)}
            className="p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
          />
          {error && <span className="text-xs text-destructive">{error}</span>}
        </div>
      );
      return null;
  }
}
