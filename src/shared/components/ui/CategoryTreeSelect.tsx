"use client";

import { useState } from "react";
import { ChevronRight, Folder, FolderOpen, Check, ArrowLeft } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export interface CategoryNode {
  id: string;
  name: string;
  parentId?: string | null;
  children?: CategoryNode[];
}

export function buildCategoryTree(items: { id: string; name: string; parentId: string | null }[]): CategoryNode[] {
  const map = new Map<string, CategoryNode>();
  const roots: CategoryNode[] = [];

  for (const item of items) {
    map.set(item.id, { id: item.id, name: item.name, parentId: item.parentId });
  }

  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      const parent = map.get(node.parentId)!;
      parent.children = parent.children ?? [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

interface CategoryTreeSelectProps {
  categories: CategoryNode[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryTreeSelect({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryTreeSelectProps) {
  const [currentLevelNodes, setCurrentLevelNodes] = useState<CategoryNode[]>(categories);
  const [history, setHistory] = useState<{ name: string; nodes: CategoryNode[] }[]>([]);

  const handleOpenChildren = (e: React.MouseEvent, node: CategoryNode) => {
    e.stopPropagation();
    if (node.children && node.children.length > 0) {
      setHistory((prev) => [...prev, { name: node.name, nodes: currentLevelNodes }]);
      setCurrentLevelNodes(node.children);
    }
  };

  const handleSelectNode = (node: CategoryNode) => {
    onSelectCategory(node.id);
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setCurrentLevelNodes(previous.nodes);
    setHistory((prev) => prev.slice(0, -1));
  };

  return (
    <div className="w-full border border-border rounded-xl bg-background p-3 shadow-xs">
      {history.length > 0 && (
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border text-xs text-muted-foreground">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1 text-primary font-semibold hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver
          </button>
          <span>/</span>
          <span className="font-medium text-foreground">
            {history.map((h) => h.name).join(" / ")}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={() => onSelectCategory("")}
        className={cn(
          "flex items-center gap-2.5 w-full p-2.5 rounded-lg text-sm transition-colors mb-1 cursor-pointer",
          !selectedCategoryId
            ? "bg-primary/10 text-primary border border-primary/30 font-medium"
            : "hover:bg-accent text-muted-foreground"
        )}
      >
        <span className="truncate">Todas las categorías</span>
        {!selectedCategoryId && <Check className="w-4 h-4 text-primary ml-auto shrink-0" />}
      </button>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {currentLevelNodes.length === 0 && (
          <div className="py-6 text-center text-xs text-muted-foreground">Sin subcategorías</div>
        )}
        {currentLevelNodes.map((node) => {
          const hasChildren = Boolean(node.children && node.children.length > 0);
          const isSelected = selectedCategoryId === node.id;

          return (
            <div
              key={node.id}
              className={cn(
                "flex items-center justify-between w-full p-2.5 rounded-lg text-sm transition-colors",
                isSelected
                  ? "bg-primary/10 text-primary border border-primary/30 font-medium"
                  : "hover:bg-accent text-foreground"
              )}
            >
              {/* Lado izquierdo: icono + nombre */}
              <button
                type="button"
                onClick={() => handleSelectNode(node)}
                className="flex items-center gap-2 flex-1 text-left py-0.5 pr-2 cursor-pointer"
              >
                {hasChildren ? (
                  <Folder className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <FolderOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
                <span className="truncate">{node.name}</span>
                {isSelected && <Check className="w-4 h-4 text-primary ml-auto shrink-0" />}
              </button>

              {/* Lado derecho: solo flecha */}
              {hasChildren && (
                <button
                  type="button"
                  onClick={(e) => handleOpenChildren(e, node)}
                  className="flex items-center justify-center w-7 h-7 hover:bg-primary/10 text-primary rounded-md transition-colors shrink-0 cursor-pointer"
                  title={`Ver subcategorías de ${node.name}`}
                >
                  <ChevronRight className="w-4 h-4 text-primary" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
