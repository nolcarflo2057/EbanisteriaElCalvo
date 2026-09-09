"use client";

import { useState } from "react";
import { UploadDropzone } from "@/shared/utils/uploadthing";
import { twMerge } from "tailwind-merge";
import { Input } from "@/shared/components/ui/Input";
import { Label } from "@/shared/components/ui/Label";
import toast from "react-hot-toast";

interface UploadImageUrlFieldProps {
	label: string;
	value: string;
	onChange: (url: string) => void;
	placeholder?: string;
	hint?: string;
	proportionsHint?: string;
	fallbackPreview?: string;
}

export function UploadImageUrlField({
	label,
	value,
	onChange,
	placeholder,
	hint,
	proportionsHint,
	fallbackPreview,
}: UploadImageUrlFieldProps) {
	const [previewUrl, setPreviewUrl] = useState<string>("");

	const handleUploadComplete = (res: { ufsUrl?: string | undefined; url?: string | undefined }[]) => {
		if (res && res[0]) {
			const url = res[0].ufsUrl || res[0].url;
			if (!url) return;
			setPreviewUrl(url);
			onChange(url);
			toast.success("¡Imagen subida correctamente!");
		}
	};

	const src = previewUrl || value || fallbackPreview || "";
	const isFallback = !previewUrl && !value && !!fallbackPreview;

	return (
		<div className="space-y-2">
			<Label>{label}</Label>
			<UploadDropzone
				endpoint="imageUploader"
				className="ut-button:bg-primary hover:ut-button:bg-primary/90 border border-dashed border-border rounded-lg p-4 bg-card"
				onClientUploadComplete={handleUploadComplete}
				onUploadError={(error: Error) => {
					toast.error(`Error de subida: ${error.message}`);
				}}
				content={{
					button: "Subir imagen",
					label: "Arrastra la imagen aquí o haz clic",
				}}
				config={{
					cn: twMerge,
					mode: "auto",
				}}
			/>
			<Input
				type="url"
				placeholder={placeholder || "https://..."}
				value={value}
				onChange={(e) => {
					setPreviewUrl("");
					onChange(e.target.value);
				}}
			/>
			{hint && <p className="text-xs text-muted-foreground">{hint}</p>}
			{proportionsHint && (
				<p className="text-xs text-muted-foreground/80 border-l-2 border-primary/30 pl-2">
					{proportionsHint}
				</p>
			)}
			{src && (
				<div className="mt-2 flex items-center gap-3 border border-border p-2 rounded-lg bg-card w-fit max-w-full">
					<div className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden bg-muted">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={src}
							alt={label}
							className="h-full w-full object-contain"
						/>
					</div>
					<div className="flex flex-col gap-1 min-w-0">
						<span className="text-xs font-medium text-foreground">
							{isFallback ? "Imagen por defecto (se comparte esta)" : "Imagen actual"}
						</span>
						<span className="text-xs text-muted-foreground break-all max-w-[260px]">
							{src}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
