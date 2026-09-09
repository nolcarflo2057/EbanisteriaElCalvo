"use client";

import { useState } from "react";
import { UploadDropzone } from "@/shared/utils/uploadthing";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

interface UploadImageProps {
	fieldName?: string; // Nombre del campo en el formulario (por defecto "imageUrl")
	label?: string;
}

export function UploadImage({ fieldName = "imageUrl", label = "Imagen del Recurso" }: UploadImageProps) {
	const formContext = useFormContext();
	const [previewUrl, setPreviewUrl] = useState<string>("");

	// Si no hay formulario en el contexto, se comporta de forma desacoplada
	const setValue = formContext?.setValue;
	const clearErrors = formContext?.clearErrors;
	const errors = formContext?.formState?.errors;
	const getValues = formContext?.getValues;

	const currentVal = getValues ? getValues(fieldName) : null;
	const displaySrc = (src: string) =>
		src.startsWith("http") || src.startsWith("/") ? src : `/products/${src}`;

	return (
		<div className="space-y-2">
			<label className="text-sm font-medium text-foreground block">
				{label}
			</label>
			
			<UploadDropzone
				endpoint="imageUploader"
				className="ut-button:bg-primary hover:ut-button:bg-primary/90 border border-dashed border-border rounded-lg p-6 bg-card"
				onClientUploadComplete={(res) => {
					if (res && res[0]) {
						const url = res[0].ufsUrl || res[0].url;
						setPreviewUrl(url);
						if (setValue) {
							setValue(fieldName, url, { shouldValidate: true });
							if (clearErrors) clearErrors(fieldName);
						}
						toast.success("¡Imagen subida correctamente!");
					}
				}}
				onUploadError={(error: Error) => {
					toast.error(`Error de subida: ${error.message}`);
				}}
				content={{
					button: "Seleccionar Archivo",
					label: "Arrastra la imagen aquí o haz clic para buscar",
				}}
				config={{
					cn: twMerge,
					mode: "auto",
				}}
			/>

			{errors && errors[fieldName] && (
				<p className="text-xs text-destructive">
					{String(errors[fieldName]?.message)}
				</p>
			)}

			{/* Previsualización de la nueva imagen o la actual */}
			{(previewUrl || currentVal) && (
				<div className="mt-4 border border-border p-2 rounded-lg bg-card w-full max-w-[200px]">
					<p className="text-xs font-semibold text-muted-foreground mb-2">Vista previa:</p>
					<div className="relative aspect-video w-full overflow-hidden rounded bg-muted">
						<Image
							src={displaySrc(previewUrl || currentVal)}
							alt="Previsualización"
							fill
							unoptimized={!displaySrc(previewUrl || currentVal).startsWith("/")}
							className="object-cover"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
