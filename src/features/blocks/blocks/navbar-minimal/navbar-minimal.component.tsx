"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLeadModal } from "@/features/leads/components/LeadModalProvider";
import { type NavbarMinimalProps } from "./navbar-minimal.schema";

export function NavbarMinimalComponent({ props }: { props: NavbarMinimalProps }) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const { openLeadModal } = useLeadModal();
	const navRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (!mobileOpen) return;

		function handlePointerDown(e: PointerEvent) {
			if (navRef.current && !navRef.current.contains(e.target as Node)) {
				setMobileOpen(false);
			}
		}
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") setMobileOpen(false);
		}

		document.addEventListener("pointerdown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [mobileOpen]);

	return (
		<nav
			ref={navRef}
			className="fixed top-0 w-full z-40 bg-background/90 border-b border-border-subtle transition-all duration-300"
			id="navbar"
			style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
		>
			<div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 md:py-6 w-full max-w-container-max mx-auto">
				<div className="flex items-center gap-4">
					<img
						className="h-6 md:h-10 object-contain"
						data-alt={props.logoAlt}
						src={props.logoImage}
					/>
					<span className="font-display-lg text-[20px] md:text-headline-lg tracking-tighter text-primary uppercase">
						{props.logoText}
					</span>
				</div>
				<div className="v-nav-links">
					{props.links.map((link, idx) => (
						<a
							key={idx}
							className="font-label-caps text-label-caps uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors duration-300"
							href={link.href}
						>
							{link.label}
						</a>
					))}
				</div>
				<button
					type="button"
					className="v-nav-cta bg-secondary text-on-secondary font-label-caps text-label-caps uppercase tracking-[0.2em] px-8 py-4 hover:bg-secondary-fixed transition-colors duration-300 scale-95 hover:scale-100 ease-in-out cursor-pointer"
					onClick={openLeadModal}
				>
					{props.ctaLabel}
				</button>
				<button
					type="button"
					className="lg:hidden text-primary p-2 cursor-pointer flex items-center justify-center gap-2"
					aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
					aria-expanded={mobileOpen}
					aria-controls="mobile-menu"
					onClick={() => setMobileOpen((open) => !open)}
				>
					{mobileOpen ? (
						<X className="h-6 w-6" />
					) : (
						<>
							<Menu className="h-6 w-6 md:hidden" />
							<span className="hidden md:block font-bold text-sm uppercase tracking-[0.2em] px-2">MENÚ</span>
						</>
					)}
				</button>
			</div>
			<div 
				className={`v-nav-mobile${mobileOpen ? " v-nav-mobile-open" : ""}`} 
				id="mobile-menu"
				style={{ 
					backgroundColor: "rgba(15, 12, 10, 0.35)", 
					backdropFilter: "blur(24px)", 
					WebkitBackdropFilter: "blur(24px)" 
				}}
			>
				<nav className="flex flex-col gap-1 px-margin-mobile pb-8 pt-4">
					{props.links.map((link, idx) => (
						<a
							key={idx}
							className="font-label-caps text-label-caps uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors duration-300 py-3"
							href={link.href}
							onClick={() => setMobileOpen(false)}
						>
							{link.label}
						</a>
					))}
					<button
						type="button"
						className="v-btn-primary w-full text-center mt-6 cursor-pointer"
						onClick={() => {
							setMobileOpen(false);
							openLeadModal();
						}}
					>
						{props.ctaLabel}
					</button>
				</nav>
			</div>
		</nav>
	);
}