"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { useEffect, useState } from "react";
import { getAppearanceAction } from "@/features/settings/actions/settings.actions";

import { isModuleEnabled } from "@/config/modules";

export function SettingsSidebar() {
	const pathname = usePathname();
	const [primaryColor, setPrimaryColor] = useState("#feb300");

	useEffect(() => {
		getAppearanceAction().then((res) => {
			if (res.success && res.data?.primaryColor) {
				setPrimaryColor(res.data.primaryColor);
			}
		});
	}, []);

	const allLinks = [
		{
			href: "/dashboard/settings/general",
			label: "General",
			icon: "⚙️",
			condition: true,
		},
		{
			href: "/dashboard/settings/appearance",
			label: "Personalización",
			icon: "🎨",
			condition: true,
		},
		{
			href: "/dashboard/settings/seo",
			label: "SEO",
			icon: "🔍",
			condition: true,
		},
		{
			href: "/dashboard/settings/social",
			label: "Redes Sociales",
			icon: "🔗",
			condition: true,
		},
		{
			href: "/dashboard/settings/legales",
			label: "Legales",
			icon: "⚖️",
			condition: true,
		},
		{
			href: "/dashboard/settings/integrations",
			label: "Analytics",
			icon: "📊",
			condition: isModuleEnabled("analytics_traffic") || isModuleEnabled("analytics_conversions") || isModuleEnabled("analytics_behavior"),
		},
		{
			href: "/dashboard/settings/white-label",
			label: "Marca Blanca",
			icon: "🏷️",
			condition: isModuleEnabled("whitelabel"),
		},
	];

	const links = allLinks.filter((link) => link.condition);

	return (
		<div className="w-full select-none relative z-10">
			{/* Folder organizer style tabs */}
			<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-0">
				{links.map((link) => {
					const isActive = pathname === link.href;
					return (
						<Link
							key={link.href}
							href={link.href}
							className={cn(
								"relative flex items-center justify-center gap-1 px-1 py-3 text-xs font-medium rounded-t-xl transition-all duration-200 cursor-pointer -mb-[1px] text-center",
								isActive
									? "bg-card text-foreground border border-border border-b-card shadow-sm font-bold z-10 max-lg:order-last"
									: "bg-secondary/20 text-muted-foreground border border-border/50 border-b-transparent hover:text-foreground hover:bg-secondary/40 hover:border-border/80"
							)}
							style={isActive ? { borderTopColor: primaryColor, borderTopWidth: '3px' } : undefined}
						>
							<span className="text-base hidden xs:inline">{link.icon}</span>
							<span className="truncate">{link.label}</span>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
