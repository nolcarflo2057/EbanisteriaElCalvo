"use client";

import { Menu, X } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useNavigation } from "./useNavigation";
import type { NavigationBlockProps } from "./navigation.schema";

export function NavigationClient({ props }: { props: NavigationBlockProps }) {
	const {
		isOpen,
		setIsOpen,
		brandName,
		linksList,
		ctaLabel,
		isActiveLink,
		handleCtaClick,
		setActiveId,
	} = useNavigation(props);

	return (
		<nav className="bg-surface/90 dark:bg-surface-dim/90 backdrop-blur-md dock full-width top-0 sticky z-[1000] shadow-sm w-full">
			<div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center h-20 w-full">
				{/* Logo */}
				<a className="font-headline-md text-headline-md text-primary tracking-tight" href="#">
					<h1>{brandName}</h1>
				</a>

				{/* Desktop Links */}
				<div className="max-md:hidden md:flex items-center gap-8">
					{linksList.map((link) => {
						const isActive = isActiveLink(link.href);
						return (
							<a
								key={link.href}
								href={link.href}
								onClick={() => setActiveId(link.href.replace(/^#/, ""))}
								className={
									"font-label-md text-label-md transition-colors" +
									(isActive
										? " text-secondary border-b-2 border-secondary pb-1"
										: " text-on-surface-variant dark:text-on-surface hover:text-secondary")
								}
							>
								{link.label}
							</a>
						);
					})}
				</div>

				{/* Desktop CTA */}
				<button
					type="button"
					onClick={handleCtaClick}
					className="max-md:hidden bg-secondary text-on-secondary font-label-md px-6 py-2.5 rounded-lg btn-active transition-all hover:bg-secondary/90 shadow-sm cursor-pointer"
				>
					{ctaLabel}
				</button>

				{/* Mobile Menu Button */}
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
					className="md:hidden p-2 rounded-md hover:bg-secondary/20 text-on-background focus:outline-none cursor-pointer transition-colors"
				>
					{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
				</button>
			</div>

			{/* Mobile Dropdown */}
			<div
				className={cn(
					"md:hidden bg-background/98 backdrop-blur-md border-b border-border transition-all duration-200 overflow-hidden",
					isOpen ? "max-h-[500px] opacity-100 py-4 shadow-lg" : "max-h-0 opacity-0 pointer-events-none",
				)}
			>
				<div className="px-margin-mobile space-y-3">
					{linksList.map((link) => {
						const isActive = isActiveLink(link.href);
						return (
							<a
								key={link.href}
								href={link.href}
								onClick={() => {
									setIsOpen(false);
									setActiveId(link.href.replace(/^#/, ""));
								}}
								className={cn(
									"block text-base font-semibold py-1.5 transition-colors",
									isActive ? "text-secondary" : "text-on-surface-variant dark:text-on-surface hover:text-secondary",
								)}
							>
								{link.label}
							</a>
						);
					})}

					{/* Mobile CTA Button inside Hamburger Menu */}
					<div className="pt-3 mt-2 border-t border-border/60">
						<button
							type="button"
							onClick={handleCtaClick}
							className="w-full flex items-center justify-center bg-secondary text-on-secondary font-label-md px-6 py-3 rounded-lg btn-active transition-all hover:bg-secondary/90 shadow-sm text-center font-semibold cursor-pointer active:scale-[0.98]"
						>
							{ctaLabel}
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
}
