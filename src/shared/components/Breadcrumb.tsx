"use client";

import Link from "next/link";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface Props {
	items: BreadcrumbItem[];
	className?: string;
}

export function Breadcrumb({ items, className = "" }: Props) {
	return (
		<nav aria-label="Breadcrumb" className={`flex items-center text-xs sm:text-sm text-muted-foreground my-3 ${className}`}>
			<ol className="flex items-center flex-wrap gap-1.5 sm:gap-2">
				{/* Inicio */}
				<li className="flex items-center">
					<Link 
						href="/" 
						className="hover:text-primary transition-colors flex items-center gap-1 font-medium text-muted-foreground"
					>
						<HomeIcon className="w-3.5 h-3.5" />
						<span>Inicio</span>
					</Link>
				</li>

				{items.map((item, index) => {
					const isLast = index === items.length - 1;

					return (
						<li key={index} className="flex items-center gap-1.5 sm:gap-2">
							<ChevronRightIcon className="w-3 h-3 text-muted-foreground/60 shrink-0" />
							{isLast || !item.href ? (
								<span className="font-bold text-primary truncate max-w-50 sm:max-w-none">
									{item.label}
								</span>
							) : (
								<Link
									href={item.href as any}
									className="hover:text-primary transition-colors font-medium truncate max-w-37.5 sm:max-w-none text-muted-foreground"
								>
									{item.label}
								</Link>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}


