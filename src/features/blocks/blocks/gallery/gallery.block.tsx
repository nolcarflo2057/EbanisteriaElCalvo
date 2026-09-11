import type { BlockDefinition } from "../../types/schema";
import { LandingGallery } from "@/features/landing/components/landing-gallery";
import { gallerySchema, galleryDefaultProps, type GalleryBlockProps } from "./gallery.schema";
import { useGallery } from "./useGallery";

export const galleryBlock: BlockDefinition<GalleryBlockProps> = {
	schema: gallerySchema,
	Component: ({ props }) => {
		 
		const {} = useGallery();
		return (
			<LandingGallery
				title={props.title}
				subtitle={props.subtitle}
				description={props.description}
				images={props.images ?? []}
			/>
		);
	},
	defaultProps: galleryDefaultProps,
};


