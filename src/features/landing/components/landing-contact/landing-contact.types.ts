export interface LandingContactProps {
	title: string;
	subtitle?: string;
	mode?: "whatsapp" | "form";
	whatsapp?: string;
	email?: string;
	address?: string;
	hours?: string;
	ctaLabel?: string;
	formTitle?: string;
	formButtonLabel?: string;
	services?: { name: string }[];
}
