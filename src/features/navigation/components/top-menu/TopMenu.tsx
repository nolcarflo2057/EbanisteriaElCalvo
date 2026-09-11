"use client";
import { useTopMenu } from "./use-top-menu";
import Link from "next/link";
import { ShoppingCartIcon, Bars3Icon } from "@heroicons/react/24/outline";
import type { MenuItem } from "@/features/navigation/types/navigation.types";
import { useStoreConfig } from "@/features/stores/components/StoreConfigProvider";
import Image from "next/image";

import { TopMenuSearch } from "./TopMenuSearch";
import { TopMenuDesktop } from "./TopMenuDesktop";
import { TopMenuMobile } from "./TopMenuMobile";

interface Props {
	onOpenSidebar: () => void;
	categories: MenuItem[];
}

export function TopMenu({ onOpenSidebar, categories }: Props) {
	const {
		loaded,
		totalItemsInCart,
		activeCategoryName,
		isStoreRoute,
	} = useTopMenu(categories);

	const { config } = useStoreConfig();
	const storeName = config?.name || "Tienda";
	const logoUrl = config?.logoUrl;
	const logoDarkUrl = config?.logoDarkUrl;

	return (
		<header className="sticky top-0 z-40 w-full flex flex-col bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
			<nav className="flex px-5 justify-between items-center w-full h-16">
				{/* Logo */}
				<div>
					<Link href="/" className="flex items-center gap-2">
						{(logoUrl || logoDarkUrl) ? (
							<>
								{logoUrl && (
									<Image
										src={logoUrl}
										alt={storeName}
										width={160}
										height={40}
										className="h-8 max-h-8 w-auto object-contain dark:hidden"
										unoptimized={logoUrl.startsWith("http")}
									/>
								)}
								{logoDarkUrl && (
									<Image
										src={logoDarkUrl}
										alt={storeName}
										width={160}
										height={40}
										className="hidden h-8 max-h-8 w-auto object-contain dark:block"
										unoptimized={logoDarkUrl.startsWith("http")}
									/>
								)}
							</>
						) : (
							<span className="antialiased font-black text-xl sm:text-2xl">{storeName}</span>
						)}
					</Link>
				</div>

				{/* Center menu (Desktop) */}
				<TopMenuDesktop 
					categories={categories} 
					activeCategoryName={activeCategoryName} 
				/>

				{/* Right menu */}
				<div className="flex items-center gap-1 sm:gap-2">
					
					<TopMenuSearch />

					<Link
						href="/cart"
						className="p-2 text-muted-foreground hover:text-foreground transition-colors relative"
					>
						{loaded && totalItemsInCart > 0 && (
							<span className="fade-in absolute px-1 min-w-4.5 h-4 flex items-center justify-center text-[10px] sm:text-xs rounded-full font-bold text-primary-foreground right-0 sm:-right-1 top-0 sm:-top-1 bg-primary">
								{totalItemsInCart}
							</span>
						)}
						<ShoppingCartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
					</Link>

					<button
						onClick={onOpenSidebar}
						className="p-2 rounded-md transition-all hover:bg-secondary cursor-pointer text-muted-foreground hover:text-foreground"
					>
						<span className="hidden sm:inline text-sm font-medium">Menú</span>
						<Bars3Icon className="sm:hidden w-5 h-5" />
					</button>
				</div>
			</nav>

			{isStoreRoute && (
				<TopMenuMobile 
					categories={categories} 
					activeCategoryName={activeCategoryName} 
				/>
			)}
		</header>
	);
}


