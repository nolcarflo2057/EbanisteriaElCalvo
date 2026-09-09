import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoreConfig } from "@/features/stores/services/store-config.service";
import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { SettingsService } from "@/features/settings/services/settings.service";
import { MarkdownRenderer } from "@/shared/components/ui/MarkdownRenderer";
import {
	DefaultPrivacyContent,
	DefaultTermsContent,
	DefaultLegalNoticeContent,
} from "@/features/settings/components/default-legal-content";

type LegalDocKey = "privacyMarkdown" | "termsMarkdown" | "legalNoticeMarkdown";

interface LegalDocConfig {
	title: string;
	field: LegalDocKey;
	Fallback: (props: { storeName?: string }) => React.ReactNode;
}

/**
 * Registro de vistas legales dinámicas. Cada slug resuelve a un campo Markdown
 * de `tenants.settings.legales`; si está vacío se muestra el contenido por defecto.
 * Agregar una entrada aquí habilita la vista `/p/<slug>` automáticamente.
 */
const LEGAL_DOCS: Record<string, LegalDocConfig> = {
	privacidad: {
		title: "Política de Privacidad",
		field: "privacyMarkdown",
		Fallback: DefaultPrivacyContent,
	},
	privacy: {
		title: "Política de Privacidad",
		field: "privacyMarkdown",
		Fallback: DefaultPrivacyContent,
	},
	terminos: {
		title: "Términos y Condiciones",
		field: "termsMarkdown",
		Fallback: DefaultTermsContent,
	},
	terms: {
		title: "Términos y Condiciones",
		field: "termsMarkdown",
		Fallback: DefaultTermsContent,
	},
	"aviso-legal": {
		title: "Aviso Legal",
		field: "legalNoticeMarkdown",
		Fallback: DefaultLegalNoticeContent,
	},
};

interface PageProps {
	params: Promise<{ domain: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const doc = LEGAL_DOCS[slug];
	return {
		title: doc?.title ?? "Página",
		robots: { index: false, follow: false },
	};
}

export default async function DynamicLegalPage({ params }: PageProps) {
	const { slug } = await params;
	const doc = LEGAL_DOCS[slug];
	if (!doc) notFound();

	const tenantId = await getTenantIdFromHeaders();
	let storeName = "Mi Tienda";
	let markdown: string | undefined;

	try {
		const config = await getStoreConfig(tenantId);
		if (config?.name) storeName = config.name;

		const legales = await SettingsService.getLegales(tenantId);
		const value = legales?.[doc.field];
		if (value) markdown = value;
	} catch {
		// ignorar: se muestra el contenido por defecto
	}

	const Fallback = doc.Fallback;

	return (
		<div className="max-w-3xl mx-auto px-4 py-16">
			<Link href="/" className="text-sm text-primary hover:underline">
				← Volver al inicio
			</Link>
			<h1 className="text-3xl font-bold text-foreground mt-4">{doc.title}</h1>
			<p className="text-muted-foreground text-sm mt-1">Última actualización: {new Date().toLocaleDateString("es-CO")}</p>

			<div className="mt-8">{markdown ? <MarkdownRenderer content={markdown} /> : <Fallback storeName={storeName} />}</div>
		</div>
	);
}
