"use client";
import { useTopMenuSearch } from "./use-top-menu-search";
import {
	MagnifyingGlassIcon,
	XMarkIcon,
	ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export function TopMenuSearch() {
	const {
		isSearchOpen,
		searchTerm,
		inputRef,
		openSearch,
		closeSearch,
		clearSearch,
		handleSearch,
		setSearchTerm,
	} = useTopMenuSearch();

	return (
		<form
			onSubmit={handleSearch}
			className={`flex items-center transition-all duration-300 ease-in-out ${
				isSearchOpen
					? "absolute inset-0 z-50 bg-background/95 backdrop-blur-md px-5 sm:relative sm:inset-auto sm:z-auto sm:bg-secondary sm:rounded-full sm:px-3 sm:py-1.5"
					: "bg-transparent p-2 relative"
			}`}
		>
			{/* Botón de atrás (solo móvil cuando está abierto) */}
			{isSearchOpen && (
				<button
					type="button"
					onClick={closeSearch}
					className="mr-3 text-muted-foreground hover:text-foreground sm:hidden"
				>
					<ArrowLeftIcon className="w-5 h-5" />
				</button>
			)}

			<button
				type="button"
				onClick={() => {
					if (!isSearchOpen) {
						openSearch();
					} else if (searchTerm.trim()) {
						handleSearch();
					}
				}}
				className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
			>
				<MagnifyingGlassIcon className="w-5 h-5 sm:w-6 sm:h-6" />
			</button>

			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center ${
					isSearchOpen
						? "flex-1 ml-2 opacity-100 sm:w-48 sm:flex-none"
						: "w-0 opacity-0"
				}`}
			>
				<input
					ref={inputRef}
					type="text"
					placeholder="Buscar..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					onBlur={() => {
						if (!searchTerm.trim()) {
							closeSearch();
						}
					}}
					className="bg-transparent border-none outline-none w-full text-sm text-foreground placeholder:text-muted-foreground"
				/>
				{searchTerm && (
					<button
						type="button"
						onMouseDown={(e) => {
							e.preventDefault();
							clearSearch();
						}}
						className="text-muted-foreground hover:text-foreground ml-1 p-2 sm:p-0"
					>
						<XMarkIcon className="w-5 h-5 sm:w-4 sm:h-4" />
					</button>
				)}
			</div>
		</form>
	);
}
