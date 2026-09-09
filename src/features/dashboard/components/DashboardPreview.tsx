"use client";

import { useState } from "react";
import { Monitor, Smartphone, ExternalLink } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import Link from "next/link";

export function DashboardPreview() {
	const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

	return (
		<div className="flex flex-col h-[calc(100vh-8rem)] bg-card border border-border rounded-lg shadow-sm overflow-hidden">
			{/* Topbar for controls */}
			<div className="flex items-center justify-between p-3 border-b border-border bg-secondary/50">
				<div className="flex items-center gap-2">
					<h2 className="text-sm font-semibold text-foreground">Vista Previa</h2>
					<span className="text-xs text-muted-foreground px-2 py-0.5 bg-primary/10 text-primary rounded-full">
						En Vivo
					</span>
				</div>
				
				<div className="flex items-center gap-1 bg-background border border-border rounded-lg p-1">
					<button
						type="button"
						onClick={() => setViewMode("desktop")}
						className={cn(
							"p-1.5 rounded-md transition-colors",
							viewMode === "desktop" 
								? "bg-secondary text-foreground shadow-xs" 
								: "text-muted-foreground hover:text-foreground"
						)}
						title="Vista Escritorio"
					>
						<Monitor className="w-4 h-4" />
					</button>
					<button
						type="button"
						onClick={() => setViewMode("mobile")}
						className={cn(
							"p-1.5 rounded-md transition-colors",
							viewMode === "mobile" 
								? "bg-secondary text-foreground shadow-xs" 
								: "text-muted-foreground hover:text-foreground"
						)}
						title="Vista Móvil"
					>
						<Smartphone className="w-4 h-4" />
					</button>
				</div>
				
				<div>
					<Link
						href="/"
						target="_blank"
						className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
					>
						Abrir sitio
						<ExternalLink className="w-3.5 h-3.5" />
					</Link>
				</div>
			</div>

			{/* Iframe Container */}
			<div className="flex-1 bg-neutral-100/50 dark:bg-neutral-900/50 flex items-center justify-center p-4 overflow-hidden relative">
				<div
					className={cn(
						"bg-background shadow-md overflow-hidden transition-all duration-300 ease-in-out relative",
						viewMode === "mobile" 
							? "w-[375px] h-full max-h-[812px] rounded-[2rem] border-[8px] border-neutral-800" 
							: "w-full h-full rounded-lg border border-border"
					)}
				>
					{viewMode === "mobile" && (
						<div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-800 rounded-b-xl z-10" />
					)}
					<iframe
						src="/"
						className="w-full h-full border-none"
						title="Previsualización de la tienda"
					/>
				</div>
			</div>
		</div>
	);
}
