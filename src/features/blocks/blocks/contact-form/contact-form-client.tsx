"use client";

import { Fragment } from "react";
import { Check, Award } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useContactForm } from "./useContactForm";
import type { ContactFormBlockProps } from "./contact-form.schema";

export function ContactFormClient({ props }: { props: ContactFormBlockProps }) {
	const {
		formState,
		formData,
		handleChange,
		handleSubmit,
	} = useContactForm(props);

	const leftBgClass = {
		primary: "bg-primary-container text-on-primary",
		secondary: "bg-secondary text-on-secondary",
	}[props.leftBackground ?? "primary"];

	const renderField = (field: ContactFormBlockProps["fields"][0]) => {
		const value = formData[field.key] || "";
		const commonClass = "w-full bg-surface-container-low border border-primary/20 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all";

		if (field.type === "select") {
			let options: Array<{ value: string; label: string }> = [];
			try {
				options = field.options ? JSON.parse(field.options) : [];
			} catch {
				options = [];
			}
			return (
				<div className="space-y-2">
					<label className="font-label-md text-primary">{field.label}</label>
					<select
						name={field.key}
						value={value}
						onChange={e => handleChange(field.key, e.target.value)}
						className={commonClass}
						required={field.required}
					>
						{options.map(opt => (
							<option key={opt.value} value={opt.value}>{opt.label}</option>
						))}
					</select>
				</div>
			);
		}

		if (field.type === "textarea") {
			return (
				<div className="space-y-2">
					<label className="font-label-md text-primary">{field.label}</label>
					<textarea
						name={field.key}
						value={value}
						onChange={e => handleChange(field.key, e.target.value)}
						className={commonClass}
						placeholder={field.placeholder}
						rows={3}
						required={field.required}
					/>
				</div>
			);
		}

		return (
			<div className="space-y-2">
				<label className="font-label-md text-primary">{field.label}</label>
				<input
					type={field.type}
					name={field.key}
					value={value}
					onChange={e => handleChange(field.key, e.target.value)}
					className={commonClass}
					placeholder={field.placeholder}
					required={field.required}
				/>
			</div>
		);
	};

	const submitButtonText = formState.status === "submitting"
		? "Enviando..."
		: formState.status === "success"
			? "¡Recibido! Te llamaremos"
			: props.submitLabel;

	const submitButtonClass = cn(
		"w-full font-label-md py-4 rounded-xl shadow-lg transition-all btn-active cursor-pointer button-shine",
		formState.status === "success"
			? "bg-green-600 text-white"
			: "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/95"
	);

	return (
		<section className="py-12 md:py-24 bg-surface-bright relative overflow-hidden" id="contacto">
			<div className="max-w-[1400px] mx-auto px-4 md:px-margin-desktop">
				<div className="rounded-2xl shadow-xl overflow-hidden flex max-md:flex-col md:flex-row border border-outline-variant/60 interactive-card">
					{/* Left Panel - Info */}
					<div className={cn("md:w-1/2 p-6 md:p-12 flex flex-col justify-center", leftBgClass)}>
						<h2 className="font-headline-md text-headline-md mb-6 slide-up-fade">
							{props.title}
						</h2>
						<div className="font-body-md mb-8 opacity-80 slide-up-fade animation-delay-100 space-y-4">
							{props.description?.split(/(?:\r?\n|\\n|<br\s*\/?>)+/i).map((paragraph, index) => (
								paragraph.trim() ? <p key={index}>{paragraph.trim()}</p> : null
							))}
						</div>
						
						{props.benefits && props.benefits.length > 0 && (
							<>
								<h3 className="font-headline-sm text-primary mb-4 slide-up-fade animation-delay-200 bg-white px-4 py-2 rounded-lg inline-block">Beneficios</h3>
								<ul className="space-y-4 slide-up-fade animation-delay-200">
									{props.benefits.map((benefit, i) => (
										<li key={i} className="flex items-center gap-4">
											<Check className="size-5 text-secondary-container shrink-0" />
											<span>{benefit.text}</span>
										</li>
									))}
								</ul>
							</>
						)}
					</div>

					{/* Right Panel - Form */}
					<div className="md:w-1/2 p-6 md:p-12 bg-white flex flex-col justify-center">
						<form onSubmit={handleSubmit} className="space-y-6 slide-up-fade animation-delay-300">
							{props.fields?.map((field, i) => (
								<Fragment key={i}>
									{renderField(field)}
								</Fragment>
							))}
							<button
								type="submit"
								disabled={formState.status === "submitting" || formState.status === "success"}
								className={submitButtonClass}
							>
								{submitButtonText}
							</button>
							{formState.message && (
								<p className={cn("text-center text-sm mt-4", formState.status === "error" ? "text-red-600" : "text-green-600")}>
									{formState.message}
								</p>
							)}
						</form>
					</div>
				</div>
			</div>

			{/* Workshop Signature Decor */}
			<div className="mt-24 text-center slide-up-fade animation-delay-300">
				<div className="inline-flex p-4 border-2 border-primary/10 rounded-full opacity-40 items-center justify-center">
					<Award className="size-8 text-primary" />
				</div>
				<p className="text-label-sm font-label-sm text-primary/40 mt-2 uppercase tracking-[0.2em]">
					RESTAURAMOS · DISEÑAMOS · FABRICAMOS
				</p>
			</div>
		</section>
	);
}


