"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "../schema/auth.schema";
import { signUp } from "@/lib/auth/auth-client";
import { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function RegisterForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: RegisterInput) => {
		setIsLoading(true);
		setErrorMessage("");
		try {
			await signUp.email({
				name: data.name,
				email: data.email,
				password: data.password,
				callbackURL: "/onboarding",
				fetchOptions: {
					onResponse: () => {
						setIsLoading(false);
					},
					onError: (ctx) => {
						setErrorMessage(ctx.error.message || "Error al crear cuenta");
						setIsLoading(false);
					},
					onSuccess: () => {
						window.location.href = "/onboarding";
					}
				}
			});
		} catch (error) {
			console.error(error);
			setErrorMessage("Ocurrió un error inesperado");
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
			<label htmlFor="name">Nombre completo</label>
			<input
				id="name"
				type="text"
				disabled={isLoading}
				className={clsx("px-5 py-2 border bg-secondary rounded mb-5", {
					"border-destructive": errors.name
				})}
				{...register("name")}
			/>
			{errors.name && (
				<span className="text-destructive text-sm -mt-4 mb-4">{errors.name.message}</span>
			)}

			<label htmlFor="email">Correo electrónico</label>
			<input
				id="email"
				type="email"
				disabled={isLoading}
				className={clsx("px-5 py-2 border bg-secondary rounded mb-5", {
					"border-destructive": errors.email
				})}
				{...register("email")}
			/>
			{errors.email && (
				<span className="text-destructive text-sm -mt-4 mb-4">{errors.email.message}</span>
			)}

			<label htmlFor="password">Contraseña</label>
			<input
				id="password"
				type="password"
				disabled={isLoading}
				className={clsx("px-5 py-2 border bg-secondary rounded mb-5", {
					"border-destructive": errors.password
				})}
				{...register("password")}
			/>
			{errors.password && (
				<span className="text-destructive text-sm -mt-4 mb-4">{errors.password.message}</span>
			)}

			<div className="flex h-8 items-end space-x-1 mb-2">
				{errorMessage && (
					<div className="flex items-center space-x-1 mb-2">
						<InformationCircleIcon className="h-5 w-5 text-destructive" />
						<p className="text-sm text-destructive">
							{errorMessage}
						</p>
					</div>
				)}
			</div>

			<button
				type="submit"
				disabled={isLoading}
				className={clsx("w-full cursor-pointer h-12 flex items-center justify-center rounded-md font-semibold text-primary-foreground", {
					"bg-primary hover:bg-primary/90": !isLoading,
					"bg-primary/50 cursor-not-allowed": isLoading
				})}
			>
				{isLoading ? "Creando cuenta..." : "Crear cuenta"}
			</button>

			{/* divisor line */}
			<div className="flex items-center my-5">
				<div className="flex-1 border-t border-border"></div>
				<div className="px-2 text-muted-foreground">O</div>
				<div className="flex-1 border-t border-border"></div>
			</div>

			<Link href="/login" className="w-full text-center h-12 flex items-center justify-center rounded-md font-semibold border border-border bg-card text-foreground hover:bg-secondary transition-colors cursor-pointer">
				Ingresar
			</Link>
		</form>
	);
}
