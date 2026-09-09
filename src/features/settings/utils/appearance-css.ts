import type { CSSProperties } from "react";

export interface AppearanceCssVars {
	primaryColor?: string | null;
	secondaryColor?: string | null;
	accentColor?: string | null;
	borderRadius?: string | null;
	shadowStyle?: string | null;
	fontSettings?: { sans?: string; serif?: string; mono?: string } | null;
}

const SHADOW_MAP: Record<string, string> = {
	"shadow-xs": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
	"shadow-sm": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
	"shadow": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
	"shadow-md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
	"shadow-lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
	"shadow-xl": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
};

export function buildAppearanceCssVars(appearance: AppearanceCssVars | null): CSSProperties {
	const vars: Record<string, string> = {};

	if (appearance?.primaryColor) {
		vars["--primary"] = appearance.primaryColor;
	}

	if (appearance?.secondaryColor) {
		vars["--secondary"] = appearance.secondaryColor;
	}

	if (appearance?.accentColor) {
		vars["--ring"] = appearance.accentColor;
	}

	if (appearance?.borderRadius) {
		vars["--radius"] = appearance.borderRadius;
	}

	if (appearance?.shadowStyle && SHADOW_MAP[appearance.shadowStyle]) {
		vars["--shadow"] = SHADOW_MAP[appearance.shadowStyle];
	}

	const fonts = appearance?.fontSettings;
	if (fonts?.sans) {
		vars["--font-sans"] = `${fonts.sans}, system-ui, sans-serif`;
	}
	if (fonts?.serif) {
		vars["--font-serif"] = `${fonts.serif}, Georgia, serif`;
	}
	if (fonts?.mono) {
		vars["--font-mono"] = `${fonts.mono}, monospace`;
	}

	return vars as CSSProperties;
}

export function appearanceCssVarsToString(appearance: AppearanceCssVars | null): string {
	const vars = buildAppearanceCssVars(appearance);
	return Object.entries(vars)
		.map(([key, value]) => `${key}: ${value};`)
		.join("\n");
}
