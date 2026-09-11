"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { cn } from "@/shared/utils/cn";

export interface TreeNode {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children: TreeNode[];
}

interface TreeSelectProps {
  nodes: TreeNode[];
  value: string;
  onChange: (value: string) => void;
  allLabel?: string;
  className?: string;
}

export function buildTree<T extends { id: string; name: string; slug: string; parentId: string | null }>(
  items: T[],
): (TreeNode & Partial<Omit<T, "id" | "name" | "slug" | "parentId">>)[] {
  const map = new Map<string, TreeNode & Partial<Omit<T, "id" | "name" | "slug" | "parentId">>>();
  const roots: (TreeNode & Partial<Omit<T, "id" | "name" | "slug" | "parentId">>)[] = [];

  for (const item of items) {
    const node: TreeNode & Partial<Omit<T, "id" | "name" | "slug" | "parentId">> = {
      id: item.id,
      name: item.name,
      slug: item.slug,
      parentId: item.parentId,
      ...(item as Omit<T, "id" | "name" | "slug" | "parentId">),
      children: [],
    };
    map.set(item.id, node);
  }

  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function findPath(nodes: TreeNode[], targetId: string): TreeNode[] {
  for (const node of nodes) {
    if (node.id === targetId) return [node];
    const found = findPath(node.children, targetId);
    if (found.length > 0) return [node, ...found];
  }
  return [];
}

function findNode(nodes: TreeNode[], targetId: string): TreeNode | undefined {
  for (const node of nodes) {
    if (node.id === targetId) return node;
    const found = findNode(node.children, targetId);
    if (found) return found;
  }
}

export function TreeSelect({ nodes, value, onChange, allLabel = "Todas las categorías", className }: TreeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedName = value
    ? findPath(nodes, value).map((n) => n.name).join(" / ")
    : null;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-scroll selected into view
  useEffect(() => {
    if (isOpen && value && listRef.current) {
      const selectedEl = listRef.current.querySelector(`[data-id="${value}"]`);
      selectedEl?.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen, value]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      onChange(id);
      setIsOpen(false);
    },
    [onChange]
  );

  const renderNode = (node: TreeNode, depth: number) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isSelected = value === node.id;

    return (
      <div key={node.id} className="group">
        <div
          data-id={node.id}
          className={cn(
            "flex w-full items-center text-left text-sm transition-colors",
            isSelected && "bg-accent font-medium text-accent-foreground"
          )}
          style={{ paddingLeft: `${12 + depth * 20}px` }}
        >
          {/* Chevron — only expand/collapse, no selection */}
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggleExpand(node.id); }}
              className={cn(
                "flex-shrink-0 w-6 h-8 flex items-center justify-center text-muted-foreground",
                "hover:text-foreground transition-colors cursor-pointer"
              )}
            >
              {isExpanded ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
            </button>
          ) : (
            <span className="flex-shrink-0 w-6" />
          )}

          {/* Name — click to select */}
          <button
            type="button"
            onClick={() => handleSelect(node.id)}
            className={cn(
              "flex-1 flex items-center gap-1.5 py-2 pr-3 transition-colors cursor-pointer",
              "hover:text-foreground rounded-r-md",
              isSelected && "text-accent-foreground"
            )}
          >
            <span className="truncate">{node.name}</span>
          </button>
        </div>
        {hasChildren && isExpanded && (
          <div>{node.children.map((child) => renderNode(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between gap-2 px-3 py-2 border rounded-md text-sm bg-background",
          "focus:outline-none focus:ring-2 focus:ring-ring",
          !selectedName && "text-muted-foreground"
        )}
      >
        <span className="truncate">{selectedName || allLabel}</span>
        <ChevronDownIcon
          className={cn(
            "w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div
          ref={listRef}
          className="absolute z-50 mt-1 w-full max-h-72 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md"
        >
          <button
            type="button"
            onClick={() => handleSelect("")}
            className={cn(
              "flex w-full items-center gap-1.5 py-2 pr-3 pl-[18px] text-left text-sm transition-colors cursor-pointer",
              "hover:bg-accent hover:text-accent-foreground rounded-none",
              !value && "bg-accent font-medium text-accent-foreground"
            )}
          >
            <span>{allLabel}</span>
          </button>
          {nodes.map((node) => renderNode(node, 0))}
        </div>
      )}
    </div>
  );
}


