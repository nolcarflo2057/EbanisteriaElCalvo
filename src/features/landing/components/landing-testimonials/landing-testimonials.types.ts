export interface TestimonialItem {
	author: string;
	role: string;
	quote: string;
	rating: number;
	avatar?: string;
}

export interface LandingTestimonialsProps {
	title: string;
	subtitle: string;
	items: TestimonialItem[];
}
