import type { LocationHoursBlockProps } from "@/features/blocks/blocks/location-hours/location-hours.schema";

export function LocationHoursStatic(props: LocationHoursBlockProps) {
	return (
		<section className="py-12 md:py-24 bg-surface" id="ubicacion">
			<div className="max-w-[1200px] mx-auto px-4 md:px-10">
				{props.mapEmbedUrl ? (
					<div className="bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-5 border border-outline-variant">
						<div className="relative md:col-span-3 h-full min-h-[380px]">
							<iframe
								allowFullScreen
								className="absolute inset-0 w-full h-full"
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								src={props.mapEmbedUrl}
								title="Mapa de ubicación"
								style={{ border: 0 }}
							/>
						</div>
						<div className="bg-primary-container p-8 md:p-12 flex flex-col justify-center text-left text-on-primary md:col-span-2">
							<span className="material-symbols-outlined text-secondary-container text-4xl mb-6" style={{ fontVariationSettings: '"FILL" 1' }}>
								{props.icon}
							</span>
							<h2 className="font-headline-md text-headline-md mb-4 text-on-primary">{props.title}</h2>
							<div className="font-body-md text-on-primary/80 mb-8 space-y-4">
								{props.description?.split(/(?:\r?\n|\\n|<br\s*\/?>)+/i).map((paragraph, index) => (
									paragraph.trim() ? <p key={index}>{paragraph.trim()}</p> : null
								))}
							</div>
							{props.address && (
								<div className="flex items-center gap-3 text-on-primary mb-4">
									<span className="material-symbols-outlined text-secondary-container">map</span>
									<span className="font-label-md">{props.address}</span>
								</div>
							)}
							{props.schedule && (
								<div className="flex items-center gap-3 text-on-primary mb-4">
									<span className="material-symbols-outlined text-secondary-container">schedule</span>
									<span className="font-label-md">{props.schedule}</span>
								</div>
							)}
							{props.phone && (
								<div className="flex items-center gap-3 text-on-primary mb-4">
									<span className="material-symbols-outlined text-secondary-container">call</span>
									<span className="font-label-md">{props.phone}</span>
								</div>
							)}
							{props.directionsUrl && (
								<a
									className="mt-8 inline-flex items-center justify-center gap-2 bg-secondary text-on-secondary font-label-md px-6 py-3 rounded-lg hover:bg-secondary/90 transition-all btn-active self-start"
									href={props.directionsUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									<span className="material-symbols-outlined">directions</span>
									Cómo llegar
								</a>
							)}
						</div>
					</div>
				) : (
					<div className="max-w-xl mx-auto px-4">
						<span className="material-symbols-outlined text-secondary-container text-5xl mb-6 block text-center" style={{ fontVariationSettings: '"FILL" 1' }}>
							{props.icon}
						</span>
						<h2 className="font-headline-md text-headline-md mb-4 text-center">{props.title}</h2>
						<p className="font-body-md opacity-80 text-center mb-8">{props.description}</p>
						{props.address && <p className="font-body-md mb-2 opacity-90 text-center">{props.address}</p>}
						{props.schedule && (
							<div className="inline-flex items-center gap-2 border border-current/20 px-6 py-3 rounded-full font-label-md mt-4">
								<span className="material-symbols-outlined">schedule</span>
								{props.schedule}
							</div>
						)}
						{props.phone && (
							<div className="mt-6 flex items-center justify-center gap-2 text-sm opacity-80">
								<span className="material-symbols-outlined">call</span>
								{props.phone}
							</div>
						)}
					</div>
				)}
			</div>
		</section>
	);
}