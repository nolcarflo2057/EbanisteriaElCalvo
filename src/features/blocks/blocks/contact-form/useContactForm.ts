import { useState } from "react";
import type { ContactFormBlockProps, ContactFormBlockState } from "./contact-form.schema";

export function useContactForm(props: ContactFormBlockProps) {
	const [formState, setFormState] = useState<ContactFormBlockState>({ status: "idle", message: "" });
	const [formData, setFormData] = useState<Record<string, string>>({});

	const handleChange = (key: string, value: string) => {
		setFormData(prev => ({ ...prev, [key]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormState({ status: "submitting", message: "Enviando..." });

		try {
			const endpoint = props.submitEndpoint || "/api/contact";
			const response = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				setFormState({ status: "success", message: "¡Recibido! Te llamaremos pronto." });
				setFormData({});
			} else {
				throw new Error("Error al enviar");
			}
		} catch {
			setFormState({ status: "error", message: "Error al enviar. Intenta de nuevo." });
		}
	};

	return {
		formState,
		formData,
		handleChange,
		handleSubmit,
	};
}
