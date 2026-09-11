import * as React from "react";
import * as Headless from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/shared/utils/cn";

export interface DialogProps {
	isOpen: boolean;
	onClose: () => void;
	title?: React.ReactNode;
	description?: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
}

export function Dialog({ isOpen, onClose, title, description, children, className }: DialogProps) {
	return (
		<Headless.Dialog open={isOpen} onClose={onClose} className="relative z-50">
			<Headless.DialogBackdrop
				transition
				className="fixed inset-0 bg-black/50 transition-opacity duration-300 ease-out data-closed:opacity-0"
			/>
			
			<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div
					className="flex min-h-full items-center justify-center p-4 text-center sm:p-0"
					onClick={(e) => {
						if (e.target === e.currentTarget) onClose();
					}}
				>
					<Headless.DialogPanel
						transition
						className={cn(
							"relative transform overflow-hidden rounded-lg bg-card text-card-foreground p-6 text-left shadow-xl transition-all duration-300 ease-out data-closed:scale-95 data-closed:opacity-0 sm:my-8 sm:w-full sm:max-w-lg border border-border",
							className
						)}
					>
						<div className="absolute top-0 right-0 pr-4 pt-4">
							<button
								type="button"
								onClick={onClose}
								aria-label="Cerrar"
								className="rounded-md bg-card text-muted-foreground hover:text-foreground focus:outline-hidden cursor-pointer"
							>
								<span className="sr-only">Cerrar</span>
								<XMarkIcon className="h-6 w-6" aria-hidden="true" />
							</button>
						</div>

						<div>
							{title && (
								<Headless.DialogTitle as="h3" className="text-lg font-semibold leading-6 text-foreground mb-2">
									{title}
								</Headless.DialogTitle>
							)}
							{description && (
								<p className="text-sm text-muted-foreground mb-4">
									{description}
								</p>
							)}
							<div className="mt-2">{children}</div>
						</div>
					</Headless.DialogPanel>
				</div>
			</div>
		</Headless.Dialog>
	);
}


