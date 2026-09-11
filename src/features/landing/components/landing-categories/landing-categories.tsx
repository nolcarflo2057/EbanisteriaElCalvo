import Link from "next/link";
import Image from "next/image";
import type { LandingCategoriesProps } from "./landing-categories.types";
import { useLandingCategories } from "./useLandingCategories";

export function LandingCategories({ categories }: LandingCategoriesProps) {
	const {} = useLandingCategories();
	if (!categories.length) return null;

	return (
		<section className="py-16 bg-background">
			<div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{categories.map((cat, i) => (
						<Link
							key={i}
							href={cat.href}
							className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-border"
						>
							<div className="relative aspect-[4/3] overflow-hidden">
								<Image
									src={cat.image}
									alt={cat.name}
									fill
									sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
									className="object-cover group-hover:scale-105 transition-transform duration-300"
								/>
							</div>
							<div className="p-5">
								<h3 className="font-semibold text-lg text-foreground mb-1">{cat.name}</h3>
								{cat.desc && (
									<p className="text-sm text-muted-foreground line-clamp-2">{cat.desc}</p>
								)}
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}


