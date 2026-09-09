import * as React from "react";
import { cn } from "@/shared/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
	size?: "default" | "sm" | "lg" | "icon";
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
		const Comp = asChild ? "span" : "button"; // Fallback simple para evitar dependencias
		
		const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer";
		
		const variants = {
			default: "bg-primary text-primary-foreground hover:bg-primary/95 shadow-xs focus-visible:outline-primary",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/95 shadow-xs",
			outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground shadow-xs",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline",
		};

		const sizes = {
			default: "h-10 px-4 py-2",
			sm: "h-9 rounded-md px-3 text-xs",
			lg: "h-11 rounded-md px-8",
			icon: "h-10 w-10",
		};

		return (
			<Comp
				className={cn(baseStyles, variants[variant], sizes[size], className)}
				ref={ref as any}
				{...props}
			/>
		);
	}
);
Button.displayName = "Button";

export { Button };
