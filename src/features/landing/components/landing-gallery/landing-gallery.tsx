import Image from "next/image";
import type { LandingGalleryProps } from "./landing-gallery.types";
import { useLandingGallery } from "./useLandingGallery";

export function LandingGallery(props: LandingGalleryProps) {
	const { title, subtitle, description } = props;
	const { validImages } = useLandingGallery(props);

	if (!validImages.length) return null;

	return (
		<section className="py-24 bg-surface relative" id="galeria">
			{/* Wood texture overlay following impeccable aesthetic style */}
			<div className="wood-texture-overlay absolute inset-0"></div>

			<div className="max-w-[1400px] mx-auto px-margin-desktop relative z-10">
				<div className="text-center mb-16">
					{subtitle && (
						<span className="text-secondary font-label-md uppercase tracking-widest block mb-2">
							{subtitle}
						</span>
					)}
					<h2 className="font-headline-md text-headline-md text-primary">
						{title}
					</h2>
					{description && (
						<p className="font-body-md text-on-surface-variant mt-4 max-w-4xl mx-auto">
							{description}
						</p>
					)}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
					{validImages.map((img, i) => (
						<div
							key={`${img.url}-${i}`}
							className="group relative overflow-hidden rounded-2xl aspect-video shadow-lg bg-surface-container-low"
						>
							<Image
								src={img.url}
								alt={img.alt || img.label || "Imagen de galería"}
								fill
								sizes="(max-width: 768px) 100vw, 50vw"
								className="object-cover transition-transform duration-500 group-hover:scale-110"
								unoptimized={img.url.startsWith("http")}
							/>
							{img.label && (
								<div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
									<p className="text-on-primary font-headline-sm">
										{img.label}
									</p>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}


