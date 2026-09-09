import * as React from "react";
import * as Headless from "@headlessui/react";
import { cn } from "@/shared/utils/cn";

export interface SwitchProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
	id?: string;
}

export function Switch({ checked, onChange, disabled = false, className, id }: SwitchProps) {
	return (
		<Headless.Switch
			id={id}
			checked={checked}
			onChange={onChange}
			disabled={disabled}
			className={cn(
				"group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
				checked ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700",
				className
			)}
		>
			<span
				aria-hidden="true"
				className={cn(
					"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-all duration-200 ease-in-out data-checked:translate-x-5 data-unchecked:translate-x-0",
					checked && "shadow-md"
				)}
			/>
		</Headless.Switch>
	);
}
