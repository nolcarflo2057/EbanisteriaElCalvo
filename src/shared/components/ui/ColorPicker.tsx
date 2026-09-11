"use client";

import * as Headless from "@headlessui/react";
import * as React from "react";
import { cn } from "@/shared/utils/cn";
import { Input } from "./Input";
import { Label } from "./Label";

export const PRESET_COLORS = [
	"#F97316", // Orange (default Carvin)
	"#EA580C", // Orange oscuro
	"#EF4444", // Rojo
	"#F59E0B", // Ámbar
	"#84CC16", // Lima
	"#22C55E", // Verde
	"#14B8A6", // Teal
	"#06B6D4", // Cyan
	"#3B82F6", // Azul
	"#6366F1", // Índigo
	"#8B5CF6", // Violeta
	"#A855F7", // Púrpura
	"#EC4899", // Rosa
	"#F43F5E", // Rose
	"#78716C", // Stone
	"#0F172A", // Slate oscuro
];

export interface ColorPickerProps {
	value: string;
	onChange: (value: string) => void;
	label?: string;
	presetColors?: string[];
	className?: string;
}

export function ColorPicker({
	value,
	onChange,
	label,
	presetColors = PRESET_COLORS,
	className,
}: ColorPickerProps) {
	const [prevValue, setPrevValue] = React.useState(value);
	const [hexInput, setHexInput] = React.useState(value || "#000000");

	if (value !== prevValue) {
		setPrevValue(value);
		setHexInput(value || "#000000");
	}

	const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value;
		setHexInput(raw);
		if (/^#[0-9a-fA-F]{6}$/.test(raw)) {
			onChange(raw);
		}
	};

	return (
		<div className={cn("space-y-2", className)}>
			{label && <Label>{label}</Label>}
			<div className="flex items-center gap-3">
				<Headless.Popover className="relative">
					<Headless.PopoverButton
						className="h-10 w-10 shrink-0 cursor-pointer rounded-md border border-border shadow-xs transition-transform hover:scale-105 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						style={{ backgroundColor: value || "#000000" }}
						aria-label="Abrir selector de color"
					/>
					<Headless.PopoverPanel className="absolute z-50 mt-2 w-64 rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-lg focus:outline-hidden">
						{/* Paleta de colores */}
						<div className="grid grid-cols-8 gap-2">
							{presetColors.map((color) => (
								<button
									key={color}
									type="button"
									onClick={() => onChange(color)}
									className={cn(
										"h-6 w-6 cursor-pointer rounded-md border border-border transition-transform hover:scale-110 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
										value === color && "ring-2 ring-ring ring-offset-2"
									)}
									style={{ backgroundColor: color }}
									aria-label={color}
								/>
							))}
						</div>

						<div className="my-3 h-px bg-border" />

						{/* Selector nativo de color */}
						<div className="flex items-center gap-3">
							<label
								className="relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-md border border-border"
								style={{ backgroundColor: value || "#000000" }}
							>
								<input
									type="color"
									value={/^#[0-9a-fA-F]{6}$/.test(value || "") ? value : "#000000"}
									onChange={(e) => onChange(e.target.value)}
									className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
									aria-label="Seleccionar color personalizado"
								/>
							</label>
							<Input
								value={hexInput}
								onChange={handleHexChange}
								placeholder="#000000"
								className="h-9 font-mono"
								aria-label="Código hexadecimal del color"
							/>
						</div>
					</Headless.PopoverPanel>
				</Headless.Popover>
				<Input
					value={value || ""}
					onChange={(e) => {
						onChange(e.target.value);
						setHexInput(e.target.value);
					}}
					placeholder="#000000"
					className="flex-1 font-mono"
					aria-label="Color en hexadecimal"
				/>
			</div>
		</div>
	);
}


