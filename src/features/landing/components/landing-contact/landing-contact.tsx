import { LeadContactForm } from "@/features/leads/components/LeadContactForm";
import type { LandingContactProps } from "./landing-contact.types";
import { useLandingContact } from "./useLandingContact";

export function LandingContact(props: LandingContactProps) {
	const { title, subtitle, email, address, hours, ctaLabel, formTitle, formButtonLabel, services } = props;
	const { waLink, showWhatsAppCard, showForm, hasInfoCards } = useLandingContact(props);

	return (
		<section className="py-20 bg-muted/50">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-14">
					{subtitle && <span className="text-sm font-semibold tracking-wide text-primary uppercase">{subtitle}</span>}
					<h2 className="mt-3 text-3xl font-bold text-foreground">{title}</h2>
				</div>
				<div className="grid gap-8 md:grid-cols-3">
					{showForm && (
						<div className="md:col-span-2 flex flex-col">
							{formTitle && (
								<h3 className="font-bold text-foreground mb-4">{formTitle}</h3>
							)}
							<LeadContactForm 
								buttonLabel={formButtonLabel ?? "Enviar mensaje"} 
								services={services}
							/>
						</div>
					)}
					{hasInfoCards && (
						<div className="flex flex-col gap-8">
							{showWhatsAppCard && waLink && (
								<a
									href={waLink}
									target="_blank"
									rel="noopener noreferrer"
									className="flex flex-col items-center rounded-2xl bg-card p-8 text-center shadow-sm hover:shadow-md transition-shadow"
								>
									<div className="size-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-2xl mb-5">💬</div>
									<h3 className="font-bold text-foreground">{ctaLabel}</h3>
									<p className="mt-2 text-sm text-muted-foreground">Respuesta rápida por WhatsApp</p>
								</a>
							)}
							{email && (
								<a
									href={`mailto:${email}`}
									className="flex flex-col items-center rounded-2xl bg-card p-8 text-center shadow-sm hover:shadow-md transition-shadow"
								>
									<div className="size-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-2xl mb-5">✉️</div>
									<h3 className="font-bold text-foreground">Escríbenos</h3>
									<p className="mt-2 text-sm text-muted-foreground break-all">{email}</p>
								</a>
							)}
							{(address || hours) && (
								<div className="flex flex-col items-center rounded-2xl bg-card p-8 text-center shadow-sm">
									<div className="size-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-2xl mb-5">📍</div>
									<h3 className="font-bold text-foreground">Visítanos</h3>
									{address && <p className="mt-2 text-sm text-muted-foreground">{address}</p>}
									{hours && <p className="mt-2 text-sm text-muted-foreground">{hours}</p>}
								</div>
							)}
						</div>
					)}
					{!hasInfoCards && !showForm && (
						<p className="text-sm text-muted-foreground text-center col-span-full">
							Configura el bloque de contacto para mostrar tus datos.
						</p>
					)}
				</div>
			</div>
		</section>
	);
}


