"use client";

import { useCallback, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
import { Switch } from "@/shared/components/ui/Switch";
import { Button } from "@/shared/components/ui/Button";
import { PlusIcon, Trash2 } from "lucide-react";
import type { FieldSchema } from "@/features/blocks/types/schema";
import { ImageUploadField } from "./ImageUploadField";

function getDefaultValue(field: FieldSchema): unknown {
	if (field.default !== undefined) return field.default;
	switch (field.type) {
		case "boolean":
			return false;
		case "number":
			return "";
		case "list":
			return [];
		case "group":
			return Object.fromEntries(
				(field.fields ?? []).map((f) => [f.key, getDefaultValue(f)])
			);
		default:
			return "";
	}
}

function setIn(obj: Record<string, unknown>, path: string[], value: unknown): Record<string, unknown> {
	if (path.length === 0) return obj;
	const [head, ...rest] = path;
	if (rest.length === 0) {
		return { ...obj, [head]: value };
	}
	return { ...obj, [head]: setIn((obj[head] as Record<string, unknown>) ?? {}, rest, value) };
}

function getIn(obj: unknown, path: string[]): unknown {
	let current = obj;
	for (const key of path) {
		if (current == null || typeof current !== "object") return undefined;
		current = (current as Record<string, unknown>)[key];
	}
	return current;
}

interface FieldProps {
	field: FieldSchema;
	path: string[];
	value: unknown;
	onChange: (path: string[], value: unknown) => void;
	compact?: boolean;
}

function TextareaField({ value, onChange, field, id }: { value: unknown; onChange: (v: unknown) => void; field: FieldSchema; id: string }) {
	return (
		<textarea
			id={id}
			value={(value as string) ?? ""}
			onChange={(e) => onChange(e.target.value)}
			placeholder={field.placeholder}
			rows={3}
			className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
		/>
	);
}

// ImageField is now handled by ImageUploadField component

function ListField({ field, value, onChange, path }: FieldProps) {
	const items = (value as unknown[]) ?? [];
	const itemFields = field.fields ?? [];

	const updateItem = (index: number, itemPath: string[], itemValue: unknown) => {
		const next = items.map((it, i) => (i === index ? setIn((it as Record<string, unknown>) ?? {}, itemPath, itemValue) : it));
		onChange(path, next);
	};

	const addItem = () => {
		const empty = Object.fromEntries(itemFields.map((f) => [f.key, getDefaultValue(f)]));
		onChange(path, [...items, empty]);
	};

	const removeItem = (index: number) => {
		onChange(path, items.filter((_, i) => i !== index));
	};

	return (
		<div className="space-y-3">
			{items.length === 0 && (
				<p className="text-xs text-muted-foreground">Sin elementos.</p>
			)}
			{items.map((item, index) => (
				<div key={index} className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-xs font-semibold text-muted-foreground">Elemento {index + 1}</span>
						<button
							type="button"
							onClick={() => removeItem(index)}
							className="p-1 text-destructive hover:bg-destructive/10 rounded-md cursor-pointer"
							aria-label={`Eliminar elemento ${index + 1}`}
						>
							<Trash2 className="h-3.5 w-3.5" />
						</button>
					</div>
					{itemFields.map((subField) => (
						<DynamicField
							key={subField.key}
							field={subField}
							path={[index.toString(), ...subField.key.split(".")]}
							value={getIn(item, [subField.key])}
							onChange={(subPath, subValue) => {
								const keyPath = subPath.slice(1);
								updateItem(index, keyPath, subValue);
							}}
							compact
						/>
					))}
				</div>
			))}
			<Button type="button" variant="outline" size="sm" onClick={addItem}>
				<PlusIcon className="h-3.5 w-3.5 mr-1" /> Agregar
			</Button>
		</div>
	);
}

function GroupField({ field, value, onChange, path }: FieldProps) {
	return (
		<div className="space-y-3 rounded-lg border border-border p-3">
			{(field.fields ?? []).map((subField) => (
				<DynamicField
					key={subField.key}
					field={subField}
					path={[...path, subField.key]}
					value={getIn(value, [subField.key])}
					onChange={onChange}
					compact
				/>
			))}
		</div>
	);
}

export function DynamicField({ field, path, value, onChange, compact }: FieldProps) {
	const id = `field-${path.join("_")}-${field.key}`;
	const label = (
		<label htmlFor={id} className="block text-xs font-medium text-muted-foreground mb-1">
			{field.label}
			{field.required && <span className="text-destructive ml-0.5">*</span>}
		</label>
	);

	const setValue = useCallback(
		(v: unknown) => onChange(path, v),
		[onChange, path]
	);

	return (
		<div className={cn("space-y-1", !compact && "mb-4")}>
			{field.type !== "boolean" && label}
			{field.type === "text" && (
				<Input
					id={id}
					value={(value as string) ?? ""}
					onChange={(e) => setValue(e.target.value)}
					placeholder={field.placeholder}
				/>
			)}
			{field.type === "textarea" && <TextareaField value={value} onChange={setValue} field={field} id={id} />}
			{field.type === "number" && (
				<Input
					id={id}
					type="number"
					value={(value as number | string) ?? ""}
					onChange={(e) => setValue(e.target.value === "" ? "" : Number(e.target.value))}
				/>
			)}
			{field.type === "boolean" && (
				<div className="flex items-center justify-between rounded-md border border-input px-3 py-2">
					<span className="text-sm">{field.label}</span>
					<Switch checked={Boolean(value)} onChange={(v) => setValue(v)} id={id} />
				</div>
			)}
			{field.type === "select" && (
				<Select
					value={(value as string) ?? ""}
					onChange={(v) => setValue(v)}
					options={(field.options ?? []).map((o) => ({ value: o.value, label: o.label }))}
					placeholder={field.placeholder ?? "Seleccionar..."}
				/>
			)}
			{field.type === "multiselect" && (
				<div className="space-y-2">
					{(field.options ?? []).map((opt) => {
						const selected = Array.isArray(value) && (value as string[]).includes(opt.value);
						return (
							<label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
								<input
									type="checkbox"
									checked={selected}
									onChange={(e) => {
										const current = Array.isArray(value) ? (value as string[]) : [];
										const next = e.target.checked
											? [...current, opt.value]
											: current.filter((v) => v !== opt.value);
										setValue(next);
									}}
									className="size-4 rounded border-border"
								/>
								{opt.label}
							</label>
						);
					})}
				</div>
			)}
			{field.type === "color" && (
				<Input
					id={id}
					type="color"
					value={(value as string) ?? "#000000"}
					onChange={(e) => setValue(e.target.value)}
					className="h-10 w-16 p-1"
				/>
			)}
			{field.type === "image" && <ImageUploadField value={value as string | undefined} onChange={(val) => setValue(val)} field={field} id={id} />}
			{field.type === "list" && <ListField field={field} path={path} value={value} onChange={onChange} />}
			{field.type === "group" && <GroupField field={field} path={path} value={value} onChange={onChange} />}
			{field.help && <p className="text-[11px] text-muted-foreground mt-1">{field.help}</p>}
		</div>
	);
}

interface DynamicFormProps {
	fields: FieldSchema[];
	value: Record<string, unknown>;
	onChange: (value: Record<string, unknown>) => void;
}

export function DynamicForm({ fields, value, onChange }: DynamicFormProps) {
	const setField = (path: string[], v: unknown) => {
		onChange(setIn(value, path, v));
	};

	return (
		<div>
			{fields.map((field) => {
				// visibleIf: ocultar campo según otro valor del mismo nivel
				if (field.visibleIf) {
					const current = getIn(value, [field.visibleIf.key]);
					if (current !== field.visibleIf.value) return null;
				}
				return (
					<DynamicField
						key={field.key}
						field={field}
						path={[field.key]}
						value={getIn(value, [field.key])}
						onChange={setField}
					/>
				);
			})}
		</div>
	);
}


