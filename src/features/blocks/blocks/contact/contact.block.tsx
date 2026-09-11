import type { BlockDefinition } from "../../types/schema";
import { LandingContact } from "@/features/landing/components/landing-contact";
import { contactSchema, contactDefaultProps, type ContactBlockProps } from "./contact.schema";
import { useContact } from "./useContact";

export const contactBlock: BlockDefinition<ContactBlockProps> = {
	schema: contactSchema,
	Component: ({ props }) => {
		 
		const {} = useContact();
		return (
			<LandingContact
				title={props.title}
				subtitle={props.subtitle}
				mode={props.mode ?? "form"}
				whatsapp={props.whatsapp}
				email={props.email}
				address={props.address}
				hours={props.hours}
				ctaLabel={props.ctaLabel ?? "Escríbenos por WhatsApp"}
				formTitle={props.formTitle ?? "Déjanos un mensaje"}
				formButtonLabel={props.formButtonLabel ?? "Enviar mensaje"}
				services={props.services}
			/>
		);
	},
	defaultProps: contactDefaultProps,
};


