import { useEffect, useState } from "react";
import type { NavigationBlockProps } from "./navigation.schema";

export function useNavigation(props: NavigationBlockProps) {
	const [isOpen, setIsOpen] = useState(false);
	const brandName = props.brand || "El Calvo";
	const linksList = props.links || [];
	const ctaLabel = props.ctaLabel || "Pedir Presupuesto";
	const ctaHref = props.ctaHref || "#contacto";

	const [activeId, setActiveId] = useState<string>(() => linksList[0]?.href.replace(/^#/, "") || "");

	useEffect(() => {
		if (linksList.length === 0) return;
		const targets = linksList
			.map((link) => document.getElementById(link.href.replace(/^#/, "")))
			.filter((el): el is HTMLElement => !!el);
		if (targets.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
				if (visible.length > 0) setActiveId(visible[0].target.id);
			},
			{ rootMargin: "-40% 0px -55% 0px", threshold: 0 },
		);
		targets.forEach((target) => observer.observe(target));
		return () => observer.disconnect();
	}, [linksList]);

	const isActiveLink = (href: string) => href.replace(/^#/, "") === activeId;

	const handleCtaClick = () => {
		setIsOpen(false);
		if (ctaHref.startsWith("#")) {
			const targetId = ctaHref.replace(/^#/, "");
			const element = document.getElementById(targetId);
			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
			} else {
				window.location.hash = targetId;
			}
		} else {
			window.location.href = ctaHref;
		}
	};

	return {
		isOpen,
		setIsOpen,
		brandName,
		linksList,
		ctaLabel,
		ctaHref,
		activeId,
		setActiveId,
		isActiveLink,
		handleCtaClick,
	};
}
