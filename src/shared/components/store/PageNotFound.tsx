import { titleFonts } from "@/config/fonts";
import Link from "next/link";
import Image from "next/image";

export const PageNotFound = () => {
	return (
		<div className="flex flex-col-reverse md:flex-row min-h-[800px] w-full justify-center items-center align-middle py-10">
			<div className="text-center px-5 mx-5 md:max-w-md">
				<h2 className={`${titleFonts.className} antialiased text-7xl md:text-9xl text-primary mb-4`}>404</h2>
				<p className="font-semibold text-2xl text-on-background">¡Ups! Página no encontrada.</p>
				<p className="font-light mt-4 text-lg text-on-surface-variant">
					<span>Lo sentimos, pero la página que buscas no existe. Puedes regresar al </span>
					<Link
						href="/"
						className="font-medium hover:underline transition-all text-secondary"
					>
						Inicio
					</Link>
				</p>
			</div>
			<div className="px-5 mx-5 mb-8 md:mb-0">
				<Image
					className="p-5 sm:p-0 rounded-2xl shadow-xl object-cover"
					src="/404.jpg"
					alt="Página no encontrada"
					width={550}
					height={550}
					priority
				/>
			</div>
		</div>
	);
};
