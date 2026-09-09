"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { cn } from "@/shared/utils/cn";
import { signOut, useSession } from "@/lib/auth/auth-client";
import { enabledModules, isRouteAllowed } from "@/config/modules";
import Pusher from "pusher-js";
import { getNewLeadsCountAction } from "@/features/leads/actions/lead.actions";
import {
	getSettingsAction,
	getAppearanceAction,
} from "@/features/settings/actions/settings.actions";

const NAV_ITEMS = [
	{
		title: "Dashboard",
		fullName: "Vista general del panel",
		href: "/dashboard",
		moduleKey: "settings" as const,
		icon: (
			<svg
				className="w-5 h-5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<rect x="3" y="3" width="7" height="7" rx="1" />
				<rect x="14" y="3" width="7" height="7" rx="1" />
				<rect x="3" y="14" width="7" height="7" rx="1" />
				<path d="M14 17h4M14 21h2" />
			</svg>
		),
	},
	{
		title: "Leads",
		fullName: "Leads de Contacto",
		href: "/dashboard/leads",
		moduleKey: "leads" as const,
		icon: (
			<svg
				className="w-5 h-5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
				<circle cx="9" cy="7" r="4" />
				<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
				<path d="M16 3.13a4 4 0 0 1 0 7.75" />
			</svg>
		),
	},
	{
		title: "Citas",
		fullName: "Citas Agendadas",
		href: "/dashboard/appointments",
		moduleKey: "appointments" as const,
		icon: (
			<svg
				className="w-5 h-5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
				<line x1="16" y1="2" x2="16" y2="6" />
				<line x1="8" y1="2" x2="8" y2="6" />
				<line x1="3" y1="10" x2="21" y2="10" />
			</svg>
		),
	},
	{
		title: "Bloques",
		fullName: "Editor de Bloques",
		href: "/dashboard/blocks",
		moduleKey: "blocks" as const,
		icon: (
			<svg
				className="w-5 h-5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
				<line x1="3" y1="9" x2="21" y2="9" />
				<line x1="9" y1="21" x2="9" y2="9" />
			</svg>
		),
	},
	{
		title: "Config",
		fullName: "Configuración",
		href: "/dashboard/settings",
		adminOnly: true,
		icon: (
			<svg
				className="w-5 h-5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<circle cx="12" cy="12" r="3" />
				<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
			</svg>
		),
	},
	{
		title: "Perfil",
		fullName: "Mi Perfil",
		href: "/dashboard/profile",
		icon: (
			<svg
				className="w-5 h-5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
				<circle cx="12" cy="7" r="4" />
			</svg>
		),
	},
];

interface AdminSidebarMobileProps {
	initialStoreName?: string;
	initialPrimaryColor?: string;
	initialLogoUrl?: string | null;
}

export function AdminSidebarMobile({
	initialStoreName = "Panel de control",
	initialPrimaryColor = "#F97316",
	initialLogoUrl = null,
}: AdminSidebarMobileProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { data: session } = useSession();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [newLeadsCount, setNewLeadsCount] = useState(0);
	const [storeName, setStoreName] = useState(initialStoreName);
	const [primaryColor, setPrimaryColor] = useState(initialPrimaryColor);
	const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl);

	function getInitials(name: string): string {
		if (!name) return "A";
		const parts = name.trim().split(/\s+/);
		if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
		return (
			parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
		).toUpperCase();
	}

		useEffect(() => {		Promise.all([getSettingsAction(), getAppearanceAction()]).then(
			([settingsRes, appearanceRes]) => {
				if (settingsRes.success && settingsRes.data) {
					setStoreName(settingsRes.data.name);
				}
				if (appearanceRes.success && appearanceRes.data) {
					setPrimaryColor(appearanceRes.data.primaryColor || "#F97316");
					setLogoUrl(appearanceRes.data.logoUrl || null);
				}
			},
		);
	}, []);

	// Obtener cantidad de nuevos leads (polling: funciona aunque Pusher no esté disponible)
	const lastNotifiedRef = useRef<number | null>(null);
	useEffect(() => {
		if (!enabledModules.leads || pathname === "/dashboard/leads") {
			setNewLeadsCount(0);
			lastNotifiedRef.current = 0;
			return;
		}

		let active = true;
		const poll = async () => {
			try {
				const res = await getNewLeadsCountAction();
				if (!active || !res || typeof res.count !== "number") return;
				setNewLeadsCount(res.count);
				if (lastNotifiedRef.current === null) {
					lastNotifiedRef.current = res.count;
				} else if (res.count > lastNotifiedRef.current) {
					toast.success("¡Nuevo Lead de Contacto recibido!");
					lastNotifiedRef.current = res.count;
				}
			} catch {
				/* ignorar */
			}
		};

		poll();
		const id = setInterval(poll, 5000);
		return () => {
			active = false;
			clearInterval(id);
		};
	}, [pathname]);

	useEffect(() => {
		if (!enabledModules.leads || !session?.user?.id || !process.env.NEXT_PUBLIC_PUSHER_KEY) return;

		const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
			cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2",
		});

		const channelName = `notification-channel-${session.user.id}`;
		const channel = pusher.subscribe(channelName);

		channel.bind("new-notification", (newNotif: { title: string }) => {
			if (newNotif?.title === "Nuevo Lead de Contacto") {
				if (pathname !== "/dashboard/leads") {
					setNewLeadsCount((prev) => prev + 1);
				} else {
					router.refresh();
				}
			}
		});

		return () => {
			channel.unbind_all();
			channel.unsubscribe();
			pusher.disconnect();
		};
	}, [session?.user?.id, pathname]);

	const handleSignOut = async () => {
		await signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = "/admin";
				},
			},
		});
	};

	return (
		<div className="mobile-sidebar lg:hidden">
			{/* ============================================================ */}
			{/*  SLIDE-OVER DRAWER (Mobile - hidden on lg+)                  */}
			{/* ============================================================ */}
			{drawerOpen && (
				<div className="lg:hidden fixed inset-0 z-50 flex">
					{/* Backdrop */}
					<div
						className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
						onClick={() => setDrawerOpen(false)}
					/>

					{/* Drawer Panel */}
					<div className="relative flex flex-col w-72 max-w-[80vw] bg-card border-r border-border h-full p-5 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
						{/* Header: Store Identity */}
						<div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
							<div className="flex items-center gap-3 min-w-0">
								<div
									className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-xs"
									style={{ backgroundColor: primaryColor }}
								>
									{logoUrl ? (
										<img
											src={logoUrl}
											alt={storeName}
											className="w-full h-full object-cover rounded-xl"
										/>
									) : (
										<span>{getInitials(storeName)}</span>
									)}
								</div>
								<div className="min-w-0">
									<h2 className="font-bold text-sm text-foreground truncate">
										{storeName}
									</h2>
									<p className="text-xs text-muted-foreground">Administrador</p>
								</div>
							</div>

							{/* Close Button */}
							<button
								type="button"
								onClick={() => setDrawerOpen(false)}
								className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors cursor-pointer"
								aria-label="Cerrar menú"
							>
								<svg
									className="w-5 h-5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<line x1="18" y1="6" x2="6" y2="18" />
									<line x1="6" y1="6" x2="18" y2="18" />
								</svg>
							</button>
						</div>

						{/* Nav Links */}
						<nav className="flex-1 space-y-1.5 overflow-y-auto py-2">
							{NAV_ITEMS.filter(item => {
								if (!isRouteAllowed(item.href)) return false;
								if (item.adminOnly && (session?.user as any)?.role !== "admin") return false;
								return true;
							}).map((item) => {
 								const isActive =
 									pathname === item.href ||
 									(item.href !== "/dashboard" &&
 										item.href !== "/dashboard/leads" &&
 										pathname.startsWith(item.href));

								return (
									<Link
										key={item.href}
										href={item.href}
										onClick={() => setDrawerOpen(false)}
										className={cn(
											"flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98]",
											isActive
												? "bg-primary text-primary-foreground font-semibold shadow-xs"
												: "text-foreground/80 hover:bg-secondary hover:text-foreground",
										)}
									>
										<span
											className={cn(
												"shrink-0",
												isActive
													? "text-primary-foreground"
													: "text-muted-foreground",
											)}
										>
											{item.icon}
										</span>
										<span className="truncate">{item.fullName}</span>

										{item.href === "/dashboard/leads" && newLeadsCount > 0 && (
											<span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
												{newLeadsCount}
											</span>
										)}
									</Link>
								);
							})}
						</nav>

						{/* Logout Footer */}
						<div className="pt-4 mt-auto border-t border-border">
							<button
								type="button"
								onClick={handleSignOut}
								className="flex items-center gap-3 text-destructive hover:bg-destructive/10 rounded-xl px-3.5 py-3 w-full text-sm font-medium transition-colors cursor-pointer active:scale-[0.98]"
							>
								<svg
									className="w-5 h-5 shrink-0"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
									<polyline points="16 17 21 12 16 7" />
									<line x1="21" y1="12" x2="9" y2="12" />
								</svg>
								<span>Cerrar Sesión</span>
							</button>
						</div>
					</div>
				</div>
			)}

			{/* ============================================================ */}
			{/*  BOTTOM NAVIGATION BAR (Mobile - hidden on lg+)              */}
			{/* ============================================================ */}
			<nav
				className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border flex justify-around items-center px-3 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl"
				style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
			>
				{NAV_ITEMS.filter(item => {
					if (!isRouteAllowed(item.href)) return false;
					if (item.adminOnly && (session?.user as any)?.role !== "admin") return false;
					return true;
				}).map((item) => {
					const isActive =
						pathname === item.href ||
						(item.href !== "/dashboard" && pathname.startsWith(item.href));

					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200 active:scale-90 relative min-w-[3.5rem]",
								isActive
									? "bg-primary text-primary-foreground font-semibold shadow-xs"
									: "text-muted-foreground hover:text-foreground active:bg-secondary",
							)}
						>
							<span
								className={cn(
									"shrink-0",
									isActive
										? "text-primary-foreground"
										: "text-muted-foreground",
								)}
							>
								{item.icon}
							</span>
							<span className="text-[11px] leading-none font-medium">
								{item.title}
							</span>

							{item.href === "/dashboard/leads" && newLeadsCount > 0 && (
								<span className="absolute -top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-background animate-pulse">
									{newLeadsCount}
								</span>
							)}
						</Link>
					);
				})}
			</nav>
		</div>
	);
}
