"use client";

import { useSession, signOut } from "@/lib/auth/auth-client";

import {
	Bars3Icon,
	ArrowRightOnRectangleIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import * as Headless from "@headlessui/react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { resolveNavbarClasses } from "@/core/tenant/resolve-styles";
import { DEFAULT_THEME_CONFIG } from "@/core/tenant/tenant-theme.types";

interface NavbarProps {
	onOpenMobileSidebar?: () => void;
	/** Estilo del navbar resuelto desde TenantThemeConfig */
	navbarStyle?: "glass" | "solid" | "transparent";
}

export function StoreNavbar({ onOpenMobileSidebar, navbarStyle }: NavbarProps) {
	const { data: session } = useSession();
	const resolvedNavbarStyle = navbarStyle ?? DEFAULT_THEME_CONFIG.navbarStyle;
	const navbarClasses = resolveNavbarClasses({ navbarStyle: resolvedNavbarStyle } as any);

	const handleSignOut = async () => {
		await signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = "/login";
				},
			},
		});
	};

	return (
		<header className={cn(
			"sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border px-4 md:px-8",
			navbarClasses
		)}>
			{/* Mobile menu trigger */}
			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={onOpenMobileSidebar}
					className="md:hidden text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-md"
				>
					<Bars3Icon className="h-6 w-6" aria-hidden="true" />
				</button>
				
				<span className="text-sm font-medium text-muted-foreground hidden md:inline">
					Bienvenido de nuevo{session?.user ? `, ${session.user.name}` : ""}
				</span>
				<Link href="/" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors ml-4 hidden md:inline">
					← Volver a Tienda
				</Link>
			</div>

			{/* User Menu / Quick Actions */}
			<div className="flex items-center gap-4">
				<Headless.Menu as="div" className="relative">
					<Headless.MenuButton className="flex items-center gap-2 rounded-full p-1 text-sm hover:bg-secondary transition-colors cursor-pointer focus:outline-hidden">
						{session?.user?.image ? (
							<Image
								className="h-8 w-8 rounded-full object-cover"
								src={session.user.image}
								alt={session.user.name ?? "Usuario"}
								width={32}
								height={32}
								unoptimized={session.user.image.startsWith("http")}
							/>
						) : (
							<div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
								{session?.user?.name ? session.user.name.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
							</div>
						)}
					</Headless.MenuButton>

					<Headless.MenuItems
						transition
						className="absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-md bg-card text-card-foreground p-1 shadow-lg border border-border transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
					>
						<div className="px-3 py-2 border-b border-border text-xs text-muted-foreground">
							Sesión activa: <span className="font-semibold text-foreground truncate block">{session?.user?.email}</span>
						</div>
						
						{session?.user && (
							(() => {
								const role = (session.user as any).role || "";
								const hasAccess = role === "admin" || role === "super_admin" || role === "manager";
								if (!hasAccess) return null;
								return (
									<Headless.MenuItem>
										<Link
											href="/dashboard"
											className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary text-primary font-bold cursor-pointer"
										>
											<span className="text-base">⚙️</span>
											Panel de Control
										</Link>
									</Headless.MenuItem>
								);
							})()
						)}

						<Headless.MenuItem>
							<Link
								href="/profile"
								className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary text-foreground cursor-pointer"
							>
								<UserIcon className="h-4 w-4" />
								Mi Perfil
							</Link>
						</Headless.MenuItem>

						<Headless.MenuItem>
							<button
								onClick={handleSignOut}
								className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 cursor-pointer"
							>
								<ArrowRightOnRectangleIcon className="h-4 w-4" />
								Cerrar Sesión
							</button>
						</Headless.MenuItem>
					</Headless.MenuItems>
				</Headless.Menu>
			</div>
		</header>
	);
}
