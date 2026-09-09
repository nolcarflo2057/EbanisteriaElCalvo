export interface GalleryImage {
	url: string;
	label?: string;
	alt?: string;
}

export interface LandingGalleryProps {
	title: string;
	subtitle?: string;
	description?: string;
	images: GalleryImage[];
}
