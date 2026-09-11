"use client";

import { DashboardSidebar } from "./DashboardSidebar";
import { StoreNavbar } from "@/features/navigation/components/StoreNavbar";
import { useState, Fragment } from "react";
import * as Headless from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTenantTheme } from "@/core/tenant/useTenantTheme";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
	const { config: themeConfig } = useTenantTheme();

	return (
		<div className="min-h-screen bg-background">
			{/* Mobile Sidebar overlay */}
			<Headless.Dialog open={mobileSidebarOpen} onClose={setMobileSidebarOpen} className="relative z-50 md:hidden">
				<Headless.DialogBackdrop
					transition
					className="fixed inset-0 bg-black/50 transition-opacity duration-300 ease-out data-closed:opacity-0"
				/>

				<div className="fixed inset-0 flex">
					<Headless.DialogPanel
						transition
						className="relative flex w-full max-w-xs flex-1 transform bg-card text-card-foreground p-6 shadow-xl border-r border-border transition duration-300 ease-in-out data-closed:-translate-x-full"
					>
						<div className="absolute top-0 right-0 -mr-12 pt-4">
							<button
								type="button"
								onClick={() => setMobileSidebarOpen(false)}
								className="flex items-center justify-center h-10 w-10 rounded-full focus:outline-hidden text-white cursor-pointer"
							>
								<span className="sr-only">Cerrar sidebar</span>
								<XMarkIcon className="h-6 w-6" aria-hidden="true" />
							</button>
						</div>

						{/* Sidebar content for mobile */}
						<div className="flex flex-col h-full">
							<div className="flex h-6 items-center px-2 mb-8">
								<span className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
									<span className="h-6 w-6 rounded bg-primary flex items-center justify-center text-white text-xs font-black">N</span>
									NextJS Boilerplate
								</span>
							</div>
							<div className="flex-1 overflow-y-auto">
								{/* Reusar la barra de navegación del Sidebar */}
								<DashboardSidebar />
							</div>
						</div>
					</Headless.DialogPanel>
				</div>
			</Headless.Dialog>

			{/* Static sidebar for desktop */}
			<DashboardSidebar />

			{/* Main Content Area */}
			<div className="flex flex-col md:pl-64 min-h-screen">
				<StoreNavbar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} navbarStyle={themeConfig.navbarStyle} />
				<main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
					{children}
				</main>
			</div>
		</div>
	);
}


