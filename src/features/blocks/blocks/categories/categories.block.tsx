import type { BlockDefinition } from "../../types/schema";
import { LandingCategories } from "@/features/landing/components/landing-categories";
import { categoriesSchema, categoriesDefaultProps, type CategoriesBlockProps } from "./categories.schema";
import { useCategories } from "./useCategories";

export const categoriesBlock: BlockDefinition<CategoriesBlockProps> = {
	schema: categoriesSchema,
	Component: ({ props }) => {
		 
		const {} = useCategories();
		return (
			<LandingCategories
				categories={(props.categories ?? []).map((c) => ({
					name: c.name,
					desc: c.desc ?? "",
					image: c.image ?? `https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80`,
					href: c.href ?? "/products",
				}))}
			/>
		);
	},
	defaultProps: categoriesDefaultProps,
};
