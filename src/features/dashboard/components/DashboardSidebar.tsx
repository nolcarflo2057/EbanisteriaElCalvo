"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { enabledModules } from "@/config/modules";
import { cn } from "@/shared/utils/cn";
import {
	HomeIcon,
	ShoppingBagIcon,
	DocumentTextIcon,
	CreditCardIcon,
	UsersIcon,
	BellIcon,
	ClockIcon,
	Cog6ToothIcon,
} from "@heroicons/react/24/outline";

interface NavigationItem {
	name: string;
	href: string;
	icon: React.ComponentType<any>;
	moduleKey?: keyof typeof enabledModules;
	adminOnly?: boolean;
}

const navigationItems: NavigationItem[] = [
	{ name: "Inicio", href: "/admin", icon: HomeIcon },
	{ name: "Leads", href: "/dashboard/leads", icon: UsersIcon, moduleKey: "landing" },
	{ name: "Bloques", href: "/dashboard/blocks", icon: DocumentTextIcon, moduleKey: "blocks" },
	{ name: "Usuarios", href: "/admin/users", icon: UsersIcon, moduleKey: "users" },
	{ name: "Notificaciones", href: "/admin/notifications", icon: BellIcon, moduleKey: "notifications" },
	{ name: "Auditoría", href: "/admin/audit", icon: ClockIcon, moduleKey: "audit" },
	{ name: "Configuración", href: "/dashboard/settings", icon: Cog6ToothIcon, moduleKey: "settings", adminOnly: true },
];

export function DashboardSidebar() {
	const pathname = usePathname();

	const activeItems = navigationItems.filter(
		(item) => !item.moduleKey || enabledModules[item.moduleKey]
	);

	return (
		<aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card px-4 py-6 md:block hidden">
			<div className="flex h-6 items-center px-2 mb-8">
				<span className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
					<span className="h-6 w-6 rounded bg-primary flex items-center justify-center text-white text-xs font-black">N</span>
					NextJS Boilerplate
				</span>
			</div>
			
			<nav className="space-y-1">
				{activeItems.map((item) => {
					const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
					
					return (
						<Link
							key={item.name}
							href={item.href as any}
							className={cn(
								"group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
								isActive
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-secondary hover:text-foreground"
							)}
						>
							<item.icon
								className={cn(
									"h-5 w-5 shrink-0 transition-colors",
									isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
								)}
								aria-hidden="true"
							/>
							{item.name}
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
