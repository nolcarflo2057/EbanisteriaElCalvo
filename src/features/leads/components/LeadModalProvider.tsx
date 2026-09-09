"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { LeadModalDialog } from "./LeadModalDialog";

interface LeadModalContextValue {
	openLeadModal: () => void;
	closeLeadModal: () => void;
}

const LeadModalContext = createContext<LeadModalContextValue | null>(null);

export function useLeadModal() {
	const ctx = useContext(LeadModalContext);
	if (!ctx) {
		return { openLeadModal: () => {}, closeLeadModal: () => {} };
	}
	return ctx;
}

export function LeadModalProvider({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false);

	const openLeadModal = useCallback(() => setOpen(true), []);
	const closeLeadModal = useCallback(() => setOpen(false), []);

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			const target = e.target as HTMLElement | null;
			const anchor = target?.closest?.('a[href="#contacto"]');
			if (anchor) {
				e.preventDefault();
				setOpen(true);
			}
		}
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") setOpen(false);
		}
		document.addEventListener("click", handleClick);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("click", handleClick);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<LeadModalContext.Provider value={{ openLeadModal, closeLeadModal }}>
			{children}
			{open && <LeadModalDialog isOpen={open} onClose={closeLeadModal} />}
		</LeadModalContext.Provider>
	);
}