"use client";

const SHADOW_MAP: Record<string, string> = {
	"shadow-xs": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
	"shadow-sm": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
	shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
	"shadow-md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
	"shadow-lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
	"shadow-xl": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
};

function resolveButtonRadius(style?: string): string {
	switch (style) {
		case "pill": return "9999px";
		case "sharp": return "0px";
		case "rounded":
		default: return "0.75rem";
	}
}

function resolveNavbarStyle(style?: string, secondary: string = "#F4F4F5"): React.CSSProperties {
	switch (style) {
		case "solid":
			return { backgroundColor: secondary, borderBottom: "1px solid #e5e7eb" };
		case "transparent":
			return { backgroundColor: "transparent" };
		case "glass":
		default:
			return { backgroundColor: `${secondary}cc`, backdropFilter: "blur(12px)", borderBottom: "1px solid #e5e7eb80" };
	}
}

function resolveWidgetRadius(shape?: string): string {
	switch (shape) {
		case "rounded": return "0.75rem";
		case "square": return "0.375rem";
		case "circle":
		default: return "9999px";
	}
}

interface ThemePreviewProps {
	primaryColor?: string;
	secondaryColor?: string;
	accentColor?: string;
	borderRadius?: string;
	shadowStyle?: string;
	logoUrl?: string;
	fontSettings?: { sans?: string; serif?: string; mono?: string };
	buttonStyle?: string;
	navbarStyle?: string;
	widgetShape?: string;
}

export function ThemePreview({
	primaryColor,
	secondaryColor,
	accentColor,
	borderRadius,
	shadowStyle,
	logoUrl,
	fontSettings,
	buttonStyle,
	navbarStyle,
	widgetShape,
}: ThemePreviewProps) {
	const primary = primaryColor || "#F97316";
	const secondary = secondaryColor || "#F4F4F5";
	const accent = accentColor || "#EA580C";
	const radius = borderRadius || "0.375rem";
	const shadow = (shadowStyle && SHADOW_MAP[shadowStyle]) || SHADOW_MAP["shadow-xs"];
	const fontSans = fontSettings?.sans || "var(--font-outfit)";
	const btnRadius = resolveButtonRadius(buttonStyle);
	const widgetRadius = resolveWidgetRadius(widgetShape);
	const navbarCss = resolveNavbarStyle(navbarStyle, secondary);

	return (
		<div
			className="border border-border rounded-xl overflow-hidden"
			style={{ boxShadow: shadow }}
		>
			{/* Simulación de navbar */}
			<div
				className="flex items-center justify-between px-5 py-3"
				style={navbarCss}
			>
				{logoUrl ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={logoUrl} alt="Logo" className="h-7 w-auto object-contain" />
				) : (
					<span
						className="font-bold text-sm"
						style={{ color: primary, fontFamily: fontSans }}
					>
						Mi Tienda
					</span>
				)}
				<div className="flex items-center gap-2">
					<span className="text-xs text-foreground/70">Inicio</span>
					<span className="text-xs text-foreground/70">Productos</span>
					<span
						className="text-xs font-semibold px-3 py-1.5 text-white"
						style={{
							backgroundColor: primary,
							borderRadius: btnRadius,
						}}
					>
						Comprar
					</span>
				</div>
			</div>

			{/* Simulación de hero + botones */}
			<div className="p-5 space-y-3 bg-background">
				<div className="h-3 w-2/3 rounded-full" style={{ backgroundColor: accent }} />
				<div className="h-3 w-1/2 rounded-full" style={{ backgroundColor: secondary }} />
				<div className="flex gap-2 pt-2">
					<span
						className="px-4 py-2 text-xs font-semibold text-white"
						style={{ backgroundColor: primary, borderRadius: btnRadius }}
					>
						Ver catálogo
					</span>
					<span
						className="px-4 py-2 text-xs font-semibold"
						style={{
							backgroundColor: secondary,
							color: primary,
							border: `1px solid ${primary}`,
							borderRadius: btnRadius,
						}}
					>
						Contactar
					</span>
				</div>
			</div>

			{/* Simulación de widget flotante */}
			<div className="flex justify-end p-3 bg-background/50">
				<div
					className="w-8 h-8 flex items-center justify-center text-white text-xs"
					style={{ backgroundColor: primary, borderRadius: widgetRadius }}
				>
					💬
				</div>
			</div>
		</div>
	);
}
