"use client";

import { useState, useCallback } from "react";
import { TopMenu } from "@/features/navigation/components/top-menu/TopMenu";
import { Sidebar } from "@/features/navigation/components/sidebar/Sidebar";
import type { MenuItem } from "@/features/navigation/types/navigation.types";

interface Props {
  menuItems: MenuItem[];
}

export function StoreLayoutClient({ menuItems }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <>
      <TopMenu onOpenSidebar={() => setSidebarOpen(true)} categories={menuItems} />
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
    </>
  );
}

