import Image from "next/image";
import type { LandingAboutProps } from "./landing-about.types";
import { useLandingAbout } from "./useLandingAbout";

export function LandingAbout({ title, text, image, imagePosition = "right", badge }: LandingAboutProps) {
	const {} = useLandingAbout();
	const imageBlock = image ? (
		<div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-sm">
			<Image
				src={image}
				alt={title}
				fill
				sizes="(max-width: 1024px) 100vw, 50vw"
				className="object-cover"
				unoptimized={image.startsWith("http")}
			/>
		</div>
	) : null;

	const textBlock = (
		<div>
			{badge && (
				<span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase bg-primary/10 text-primary">
					<span className="size-1.5 rounded-full bg-primary" />
					{badge}
				</span>
			)}
			<h2 className="mt-4 text-3xl font-bold text-foreground">{title}</h2>
			<p className="mt-5 text-muted-foreground leading-relaxed whitespace-pre-line">{text}</p>
		</div>
	);

	return (
		<section className="py-20 bg-background">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid md:grid-cols-2 gap-12 items-center">
					{imagePosition === "left" ? (
						<>
							{imageBlock}
							{textBlock}
						</>
					) : (
						<>
							{textBlock}
							{imageBlock}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
