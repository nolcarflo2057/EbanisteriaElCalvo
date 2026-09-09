import type { LandingContactProps } from "./landing-contact.types";

export function useLandingContact({ whatsapp, mode = "form", email, address, hours }: LandingContactProps) {
	const waLink = whatsapp
		? `https://wa.me/${whatsapp.replace(/\D/g, "")}`
		: null;

	const showWhatsAppCard = !!(waLink && mode === "whatsapp");
	const showForm = mode === "form";
	const hasInfoCards = !!(email || address || hours || showWhatsAppCard);

	return {
		waLink,
		showWhatsAppCard,
		showForm,
		hasInfoCards,
	};
}
