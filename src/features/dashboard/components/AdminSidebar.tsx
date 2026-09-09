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
		description: "Vista general del panel",
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
		title: "Leads de Contacto",
		description: "Mensajes del formulario de la landing",
		href: "/dashboard/leads",
		moduleKey: "leads" as const,
		icon: (
			<svg
				className="w-5 h-5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M4 4h16v16H4z" />
				<path d="m4 6 8 6 8-6" />
			</svg>
		),
	},
	{
		title: "Citas",
		description: "Citas agendadas desde la landing",
		href: "/dashboard/appointments",
		moduleKey: "appointments" as const,
		icon: (
			<svg
				className="w-5 h-5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<rect x="3" y="4" width="18" height="17" rx="2" />
				<path d="M16 2v4M8 2v4M3 10h18" />
			</svg>
		),
	},
	{
		title: "Editor de Bloques",
		description:
			"Construir la home con bloques dinámicos (hero, secciones, CTA)",
		href: "/dashboard/blocks",
		moduleKey: "blocks" as const,
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
				<rect x="14" y="14" width="7" height="7" rx="1" />
			</svg>
		),
	},
	{
		title: "Configuración de Tienda",
		description: "Moneda, idioma, pasarelas de pago, envíos",
		href: "/dashboard/settings",
		adminOnly: true,
		icon: (
			<svg
				className="w-5 h-5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
				<path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.5 1.5-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.12v-.4a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.5-1.5.06-.06A1.7 1.7 0 0 0 9.2 15a1.7 1.7 0 0 0-1.56-1.03H7.2v-2.12h.44A1.7 1.7 0 0 0 9.2 10.8a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.5-1.5.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56V5h2.12v.4a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.5 1.5-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.03h.4v2.12h-.4A1.7 1.7 0 0 0 19.4 15Z" />
			</svg>
		),
	},
	{
		title: "Mi Perfil",
		description: "Ver y editar la información de tu cuenta",
		href: "/dashboard/profile",
		icon: (
			<svg
				className="w-5 h-5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<circle cx="12" cy="8" r="4" />
				<path d="M4 21a8 8 0 0 1 16 0" />
			</svg>
		),
	},
];

interface AdminSidebarProps {
	initialStoreName?: string;
	initialPrimaryColor?: string;
	initialLogoUrl?: string | null;
}

export function AdminSidebar({
	initialStoreName = "Panel de control",
	initialPrimaryColor = "#F97316",
	initialLogoUrl = null,
}: AdminSidebarProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { data: session } = useSession();

	const [newLeadsCount, setNewLeadsCount] = useState(0);
	const [storeName, setStoreName] = useState(initialStoreName);
	const [primaryColor, setPrimaryColor] = useState(initialPrimaryColor);
	const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl);

	function getInitials(name: string): string {
		if (!name) return "A";

		const parts = name.trim().split(/\s+/);

		if (parts.length === 1) {
			return parts[0].charAt(0).toUpperCase();
		}

		return (
			parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
		).toUpperCase();
	}

	// Cargar información de la tienda y apariencia
	useEffect(() => {
		Promise.all([getSettingsAction(), getAppearanceAction()]).then(
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

	// Pusher
	useEffect(() => {
		const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;

		if (!enabledModules.leads || !session?.user?.id || !pusherKey) {
			return;
		}

		const pusher = new Pusher(pusherKey, {
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
		<aside className="desktop-sidebar fixed top-0 left-0 z-30 hidden h-screen w-72 flex-col border-r border-border bg-background lg:flex">
			{/* Header */}
			<div className="p-6 border-b border-border">
				<div className="flex items-center gap-3">
					<div
						className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden"
						style={{ backgroundColor: primaryColor }}
					>
						{logoUrl ? (
							<img
								src={logoUrl}
								alt={storeName}
								className="w-full h-full object-cover rounded-lg"
							/>
						) : (
							<span>{getInitials(storeName)}</span>
						)}
					</div>

					<div className="min-w-0 flex-1">
						<h2 className="font-semibold text-sm text-foreground truncate">
							{storeName}
						</h2>

						<p className="text-xs text-muted-foreground truncate">
							Panel de control
						</p>
					</div>
				</div>
			</div>

			{/* Navegación */}
			<nav className="flex-1 p-4 space-y-3 overflow-y-auto">
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
						<Link key={item.href} href={item.href} className="group block">
							<div
								className={cn(
									"flex flex-col gap-1 p-3 rounded-lg transition-all duration-200 border cursor-pointer",
									isActive
										? "bg-primary/5 text-primary border-primary/20 shadow-xs"
										: "text-muted-foreground hover:bg-secondary/40 hover:text-foreground border-transparent",
								)}
							>
								<div className="flex items-center gap-2">
									<span
										className={cn(
											"flex-shrink-0",
											isActive ? "text-primary" : "text-muted-foreground",
										)}
									>
										{item.icon}
									</span>

									<span className="font-semibold text-sm text-foreground">
										{item.title}
									</span>

									{item.href === "/dashboard/leads" && newLeadsCount > 0 && (
										<span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-background animate-pulse">
											{newLeadsCount}
										</span>
									)}
								</div>

								<p className="text-xs text-muted-foreground pl-7 leading-relaxed">
									{item.description}
								</p>
							</div>
						</Link>
					);
				})}
			</nav>

			{/* Usuario / Logout */}
			<div className="p-4 border-t border-border flex flex-col gap-3">
				<div className="flex items-center gap-4 px-4 py-3 text-sm text-muted-foreground">
					<div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 text-sm font-bold text-foreground overflow-hidden">
						{session?.user?.image ? (
							<img
								src={session.user.image}
								alt={session.user.name || "Usuario"}
								className="w-full h-full object-cover"
							/>
						) : (
							<span>
								{session?.user?.name ? getInitials(session.user.name) : "U"}
							</span>
						)}
					</div>

					<div className="flex-1 min-w-0">
						<p className="font-semibold text-foreground text-sm capitalize truncate">
							{(session?.user as any)?.role || "Administrador"}
						</p>

						<p className="text-xs text-muted-foreground truncate">
							{session?.user?.name || "Cargando..."}
						</p>
					</div>
				</div>

				<Link
					href="/"
					className="w-full h-11 flex items-center justify-center gap-2 rounded-md font-semibold text-sm border border-border bg-card text-muted-foreground hover:text-primary hover:bg-secondary/40 transition-colors"
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
						<path d="M19 12H5" />
						<path d="m12 19-7-7 7-7" />
					</svg>
					Volver a Tienda
				</Link>

				<button
					onClick={handleSignOut}
					className="w-full mt-1 cursor-pointer h-11 flex items-center justify-center gap-2 rounded-md font-semibold text-sm border border-border bg-card text-destructive hover:bg-destructive/10 transition-colors"
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
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
						<polyline points="16 17 21 12 16 7" />
						<line x1="21" y1="12" x2="9" y2="12" />
					</svg>
					Cerrar Sesión
				</button>
			</div>
		</aside>
	);
}
