"use client";

import { useState } from "react";
import { Dialog } from "@/shared/components/ui/Dialog";

export function LivePreviewButton() {
	const [open, setOpen] = useState(false);
	const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

	const previewUrl = typeof window !== "undefined" ? window.location.origin : "/";

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
			>
				<svg
					className="w-4 h-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
					<circle cx="12" cy="12" r="3" />
				</svg>
				Vista Previa en Vivo
			</button>

			<Dialog
				isOpen={open}
				onClose={() => setOpen(false)}
				title="Vista previa de tu landing"
				className="sm:max-w-4xl"
			>
				<div className="space-y-4">
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/40 p-1">
							<button
								type="button"
								onClick={() => setDevice("desktop")}
								className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
									device === "desktop"
										? "bg-card text-foreground shadow-sm border border-border"
										: "text-muted-foreground"
								}`}
							>
								Desktop
							</button>
							<button
								type="button"
								onClick={() => setDevice("mobile")}
								className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
									device === "mobile"
										? "bg-card text-foreground shadow-sm border border-border"
										: "text-muted-foreground"
								}`}
							>
								Mobile
							</button>
						</div>
						<a
							href={previewUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-xs font-medium text-primary hover:underline"
						>
							Abrir en pestaña nueva ↗
						</a>
					</div>

					<div
						className="mx-auto bg-white border border-border rounded-xl overflow-hidden transition-all duration-300"
						style={{ width: device === "desktop" ? "100%" : "375px" }}
					>
						<iframe
							src={previewUrl}
							title="Vista previa de la landing"
							className="w-full bg-white"
							style={{ height: "60vh", border: "none" }}
						/>
					</div>
				</div>
			</Dialog>
		</>
	);
}
