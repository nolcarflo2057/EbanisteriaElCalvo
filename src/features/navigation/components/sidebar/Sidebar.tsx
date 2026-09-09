"use client";

import Link from "next/link";
import { useSidebar } from "@/features/navigation/hooks/useSidebar";
import type { SidebarNavSection } from "@/features/navigation/hooks/useSidebar.types";
import clsx from "clsx";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
  UsersIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

interface Props {
  open: boolean;
  onClose: () => void;
}

// Map icon names to components
function renderIcon(name: string) {
  switch (name) {
    case "UserIcon": return <UserIcon className="w-5 h-5 mr-3" />;
    case "ArrowRightOnRectangleIcon": return <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />;
    case "ArrowLeftOnRectangleIcon": return <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />;
    case "ClipboardDocumentListIcon": return <ClipboardDocumentListIcon className="w-5 h-5 mr-3" />;
    case "ShoppingBagIcon": return <ShoppingBagIcon className="w-5 h-5 mr-3" />;
    case "UsersIcon": return <UsersIcon className="w-5 h-5 mr-3" />;
    case "Cog6ToothIcon": return <Cog6ToothIcon className="w-5 h-5 mr-3" />;
    default: return null;
  }
}

export function Sidebar({ open, onClose }: Props) {
  const { isAuthenticated, handleSearch, navSections, handleSignOut } = useSidebar(onClose);

  if (!open) return null;

  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen z-[60] bg-black opacity-40" onClick={onClose} />
      <div onClick={onClose} className="fade-in fixed top-0 left-0 w-screen h-screen z-[60] backdrop-filter backdrop-blur-sm" />
      <nav className="fixed p-5 right-0 top-0 w-full max-w-xs h-screen z-[70] bg-card text-card-foreground shadow-2xl overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-5 p-1 rounded-full bg-secondary hover:bg-border transition-colors cursor-pointer">
          <XMarkIcon className="w-6 h-6 text-foreground" />
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const val = (e.currentTarget.elements.namedItem("search") as HTMLInputElement).value;
            handleSearch(val);
          }}
          className="relative mt-14"
        >
          <MagnifyingGlassIcon className="absolute top-2 left-2 w-5 h-5 text-muted-foreground" />
          <input
            name="search"
            type="text"
            placeholder="Buscar"
            className="w-full bg-secondary rounded pl-10 py-1 pr-10 border-b-2 text-xl border-border focus:outline-none focus:border-primary"
          />
        </form>

        {navSections.map((section: SidebarNavSection, sectionIndex: number) => (
          <div key={sectionIndex} className="mt-10 space-y-2">
            {section.divider && <div className="w-full h-px bg-border my-6" />}
            {section.label && (
              <p className="text-xs text-muted-foreground uppercase tracking-wide px-2">{section.label}</p>
            )}
            {section.items.map((item: any, itemIndex: number) => {
              const isLink = !!item.href && item.href !== "#";
              const baseClasses = clsx(
                "flex items-center p-2 hover:bg-secondary rounded transition-all text-lg",
                item.isDestructive && "text-destructive",
                item.isAdminOnly && "font-bold text-primary"
              );
              const onClick = () => {
                item.onClick?.();
                onClose();
              };

              if (isLink) {
                return (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    onClick={onClick}
                    className={baseClasses}
                  >
                    {renderIcon(item.iconName)}
                    {item.label}
                  </Link>
                );
              }

              return (
                <button
                  key={itemIndex}
                  onClick={onClick}
                  className={clsx(baseClasses, "w-full cursor-pointer")}
                >
                  {renderIcon(item.iconName)}
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </>
  );
}
