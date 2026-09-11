"use client";

import * as Headless from "@headlessui/react";
import * as React from "react";
import { cn } from "@/shared/utils/cn";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export interface SelectOption {
	value: string;
	label: string;
}

export interface SelectProps {
	value?: string;
	onChange: (value: string) => void;
	options: SelectOption[];
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	ariaLabel?: string;
	id?: string;
}

export function Select({
	value,
	onChange,
	options,
	placeholder = "Seleccionar...",
	disabled = false,
	className,
	ariaLabel,
	id,
}: SelectProps) {
	const selected = options.find((o) => o.value === value);

	return (
		<Headless.Listbox value={value ?? ""} onChange={onChange} disabled={disabled}>
			<div className="relative">
				<Headless.ListboxButton
					id={id}
					aria-label={ariaLabel}
					className={cn(
						"relative flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-left ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
						!selected && "text-muted-foreground",
						className
					)}
				>
					<span className="truncate">{selected?.label ?? placeholder}</span>
					<ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
				</Headless.ListboxButton>
				<Headless.ListboxOptions
					className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover text-popover-foreground shadow-lg focus:outline-hidden"
				>
					{options.map((option) => (
						<Headless.ListboxOption
							key={option.value}
							value={option.value}
							className={({ active, selected }) =>
								cn(
									"relative flex cursor-pointer select-none items-center justify-between py-2 pl-3 pr-8 text-sm",
									active ? "bg-accent text-accent-foreground" : "text-popover-foreground",
									selected && "font-medium"
								)
							}
						>
							{({ selected }) => (
								<>
									<span className="truncate">{option.label}</span>
									{selected && (
										<CheckIcon className="absolute right-3 h-4 w-4 text-primary" />
									)}
								</>
							)}
						</Headless.ListboxOption>
					))}
				</Headless.ListboxOptions>
			</div>
		</Headless.Listbox>
	);
}


