import { useRef, useState, useCallback } from "react";

/**
 * Hook que gestiona la lógica de búsqueda del Top Menu.
 * Provee estado del término, apertura/cierre del campo y el manejo del submit.
 */
export function useTopMenuSearch() {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const openSearch = useCallback(() => {
		setIsSearchOpen(true);
		// Enfocar el input en el siguiente frame para garantizar que ya está montado
		requestAnimationFrame(() => inputRef.current?.focus());
	}, []);

	const closeSearch = useCallback(() => {
		setIsSearchOpen(false);
		setSearchTerm("");
	}, []);

	const clearSearch = useCallback(() => {
		setSearchTerm("");
		inputRef.current?.focus();
	}, []);

	const handleSearch = useCallback(() => {
		if (!searchTerm.trim()) return;
		setIsSearchOpen(false);
		setSearchTerm("");
	}, [searchTerm]);

	return {
		isSearchOpen,
		searchTerm,
		inputRef,
		openSearch,
		closeSearch,
		clearSearch,
		handleSearch,
		setSearchTerm,
	};
}
