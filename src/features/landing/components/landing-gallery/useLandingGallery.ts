import type { LandingGalleryProps } from "./landing-gallery.types";

export function useLandingGallery({ images }: LandingGalleryProps) {
	const validImages = (images || []).filter((img) => img && img.url);

	return {
		validImages,
	};
}
