export interface CategoryCard {
	name: string;
	desc: string;
	image: string;
	href: string;
}

export interface LandingCategoriesProps {
	categories: CategoryCard[];
}
