import type { BlockDefinition } from "../../types/schema";
import { footerSchema, footerDefaultProps, type FooterBlockProps } from "./footer.schema";
import { FooterClient } from "./footer-client";

export const footerBlock: BlockDefinition<FooterBlockProps> = {
	schema: footerSchema,
	Component: ({ props }) => {
		return <FooterClient props={props} />;
	},
	defaultProps: footerDefaultProps,
};
