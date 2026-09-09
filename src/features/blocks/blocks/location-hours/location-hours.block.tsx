import type { BlockDefinition } from "../../types/schema";
import { locationHoursSchema, locationHoursDefaultProps, type LocationHoursBlockProps } from "./location-hours.schema";
import { getWhiteLabelConfig } from "@/features/whiteLabel/services/config.service";

/**
 * El bloque de Ubicación centraliza la identidad del negocio en la configuración
 * white-label (Fuente Única de Verdad): dirección, teléfono y horario se leen de
 * `white_label_config` para coincidir con footer, contacto y widgets. El mapa y el
 * enlace "Cómo llegar" siguen siendo configurables por bloque (son específicos de
 * la ubicación en el mapa). Como fallback (p.ej. preview sin tenant), usa los props.
 */
async function LocationHoursContent({ props, tenantId }: { props: LocationHoursBlockProps; tenantId?: string }) {
	let wlAddress: string | undefined;
	let wlPhone: string | undefined;
	let wlSchedule: string | undefined;

	if (tenantId) {
		const wl = await getWhiteLabelConfig(tenantId);
		wlAddress = wl?.address ?? undefined;
		wlPhone = wl?.phone ?? undefined;
		wlSchedule = wl?.hours ?? undefined;
	}

	const address = wlAddress ?? props.address ?? "";
	const phone = wlPhone ?? props.phone ?? "";
	const schedule = wlSchedule ?? props.schedule ?? "";

	const infoCard = (
		<div className="bg-primary-container p-8 md:p-12 flex flex-col justify-center text-left text-on-primary md:col-span-2">
			<span className="material-symbols-outlined text-secondary-container text-4xl mb-6" style={{ fontVariationSettings: '"FILL" 1' }}>
				{props.icon}
			</span>
			<h2 className="font-headline-md text-headline-md mb-4 text-on-primary">
				{props.title}
			</h2>
			<p className="font-body-md text-on-primary/80 mb-8">
				{props.description}
			</p>
			{address && (
				<div className="flex items-center gap-3 text-on-primary mb-4">
					<span className="material-symbols-outlined text-secondary-container">map</span>
					<span className="font-label-md">{address}</span>
				</div>
			)}
			{schedule && (
				<div className="flex items-center gap-3 text-on-primary mb-4">
					<span className="material-symbols-outlined text-secondary-container">schedule</span>
					<span className="font-label-md">{schedule}</span>
				</div>
			)}
			{phone && (
				<div className="flex items-center gap-3 text-on-primary mb-4">
					<span className="material-symbols-outlined text-secondary-container">call</span>
					<span className="font-label-md">{phone}</span>
				</div>
			)}
			{props.email && (
				<div className="flex items-center gap-3 text-on-primary mb-4">
					<span className="material-symbols-outlined text-secondary-container">email</span>
					<span className="font-label-md">{props.email}</span>
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
	);

	return (
		<section className="py-12 md:py-24 bg-surface" id="ubicacion">
			<div className="max-w-[1200px] mx-auto px-4 md:px-margin-desktop">
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
						{infoCard}
					</div>
				) : (
					<div className="max-w-xl mx-auto px-4">
						<span className="material-symbols-outlined text-secondary-container text-5xl mb-6 block text-center" style={{ fontVariationSettings: '"FILL" 1' }}>
							{props.icon}
						</span>
						<h2 className="font-headline-md text-headline-md mb-4 text-center">
							{props.title}
						</h2>
						<p className="font-body-md opacity-80 text-center mb-8">
							{props.description}
						</p>
						{address && (
							<p className="font-body-md mb-2 opacity-90 text-center">{address}</p>
						)}
						{schedule && (
							<div className="inline-flex items-center gap-2 border border-current/20 px-6 py-3 rounded-full font-label-md mt-4">
								<span className="material-symbols-outlined">schedule</span>
								{schedule}
							</div>
						)}
						{(phone || props.email) && (
							<div className="mt-6 flex flex-col items-center gap-2 text-sm opacity-80">
								{phone && (
									<div className="flex items-center gap-2">
										<span className="material-symbols-outlined">call</span>
										{phone}
									</div>
								)}
								{props.email && (
									<div className="flex items-center gap-2">
										<span className="material-symbols-outlined">email</span>
										{props.email}
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</section>
	);
}

export const locationHoursBlock: BlockDefinition<LocationHoursBlockProps> = {
	schema: locationHoursSchema,
	Component: ({ props, tenantId }) => <LocationHoursContent props={props} tenantId={tenantId} />,
	defaultProps: locationHoursDefaultProps,
};
