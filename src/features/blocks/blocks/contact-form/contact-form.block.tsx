import type { BlockDefinition } from "../../types/schema";
import { contactFormSchema, contactFormDefaultProps, type ContactFormBlockProps } from "./contact-form.schema";
import { ContactFormClient } from "./contact-form-client";

export const contactFormBlock: BlockDefinition<ContactFormBlockProps> = {
	schema: contactFormSchema,
	Component: ({ props }) => {
		return <ContactFormClient props={props} />;
	},
	defaultProps: contactFormDefaultProps,
};


