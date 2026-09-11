"use client";

import { useState } from "react";
import { UploadDropzone } from "@/shared/utils/uploadthing";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { Upload, Link, X } from "lucide-react";
import toast from "react-hot-toast";
import type { FieldSchema } from "@/features/blocks/types/schema";

interface ImageUploadFieldProps {
	value: string | undefined;
	onChange: (value: string) => void;
	field: FieldSchema;
	id: string;
}

export function ImageUploadField({ value, onChange, field, id }: ImageUploadFieldProps) {
	// `mode` se resincroniza cuando `value` cambia (ej. al editar un bloque
	// distinto en el mismo dialog, que Headless UI mantiene montado).
	const [mode, setMode] = useState<"upload" | "url">(value ? "url" : "upload");
	const [prevValue, setPrevValue] = useState(value);
	if (prevValue !== value) {
		setPrevValue(value);
		setMode(value ? "url" : "upload");
	}

	const handleUploadComplete = (res: { ufsUrl?: string; url?: string }[]) => {
		if (res && res[0]) {
			const url = res[0].ufsUrl || res[0].url;
			if (url) {
				onChange(url);
				toast.success("Imagen subida correctamente");
			}
		}
	};

	const handleUploadError = (error: Error) => {
		toast.error(`Error de subida: ${error.message}`);
	};

	const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};

	const handleClear = () => {
		onChange("");
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<Button
					type="button"
					variant={mode === "upload" ? "default" : "outline"}
					size="sm"
					onClick={() => setMode("upload")}
					className="h-7 text-xs"
				>
					<Upload className="h-3 w-3 mr-1" />
					Subir
				</Button>
				<Button
					type="button"
					variant={mode === "url" ? "default" : "outline"}
					size="sm"
					onClick={() => setMode("url")}
					className="h-7 text-xs"
				>
					<Link className="h-3 w-3 mr-1" />
					URL
				</Button>
				{value && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={handleClear}
						className="h-7 text-xs text-destructive hover:text-destructive"
					>
						<X className="h-3 w-3 mr-1" />
						Limpiar
					</Button>
				)}
			</div>

			{mode === "upload" ? (
				<UploadDropzone
					endpoint="imageUploader"
					className="ut-button:bg-primary hover:ut-button:bg-primary/90 border border-dashed border-border rounded-lg p-4 bg-muted/30"
					onClientUploadComplete={handleUploadComplete}
					onUploadError={handleUploadError}
					content={{
						button: "Seleccionar",
						label: "Arrastra o haz clic para subir imagen",
					}}
					config={{
						mode: "auto",
					}}
				/>
			) : (
				<Input
					id={id}
					type="url"
					value={value ?? ""}
					onChange={handleUrlChange}
					placeholder={field.placeholder ?? "https://ejemplo.com/imagen.jpg"}
				/>
			)}

			{value && (
				<div className="relative">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={value}
						alt="Vista previa"
						className="h-24 w-full rounded-md border border-border object-cover"
					/>
				</div>
			)}
		</div>
	);
}


