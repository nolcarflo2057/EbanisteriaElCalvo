export interface FaqItem {
	question: string;
	answer: string;
}

export interface LandingFaqProps {
	title: string;
	subtitle?: string;
	items: FaqItem[];
}
