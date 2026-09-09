import type { Metadata } from "next";
import { BRAND } from "@/features/blocks/templates/mock-ebanisteria";

export const metadata: Metadata = {
	title: BRAND,
	description: "Productos y servicios cuidadosamente elaborados, con la calidad que tu negocio merece.",
};

export default function StaticLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<style
				dangerouslySetInnerHTML={{
					__html: `
:root {
	--primary: #B45309;
	--on-primary: #ffffff;
	--primary-container: #5d4037;
	--on-primary-container: #ffddc8;
	--secondary: #7e5700;
	--on-secondary: #ffffff;
	--secondary-container: #feb300;
	--on-secondary-container: #271900;
	--accent: #EA580C;
	--background: #fbf9f5;
	--on-background: #1c1b18;
	--surface: #fbf9f5;
	--on-surface: #1c1b18;
	--surface-variant: #eee1d0;
	--on-surface-variant: #4d4639;
	--surface-dim: #ddd9d0;
	--surface-bright: #fbf9f5;
	--surface-container-lowest: #ffffff;
	--surface-container-low: #f8f3eb;
	--surface-container: #f2ede5;
	--surface-container-high: #ece8df;
	--surface-container-highest: #e6e2da;
	--outline: #7e7667;
	--outline-variant: #d0c5b4;
	--destructive: #dc2626;
	--ring: #B45309;
	--radius: 0.375rem;
	--shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	--font-sans: var(--font-outfit), var(--font-inter), system-ui, sans-serif;
	--font-serif: "Domine", "Georgia", serif;
	--font-mono: ui-monospace, monospace;
}
					`,
				}}
			/>
			{children}
		</>
	);
}
