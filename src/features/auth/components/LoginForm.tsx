"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "../schema/auth.schema";
import { signIn } from "@/lib/auth/auth-client";
import { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LoginForm({ redirectTo = "/", showRegisterLink = true }: { redirectTo?: string; showRegisterLink?: boolean }) {
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const router = useRouter();
	
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginInput) => {
		setIsLoading(true);
		setErrorMessage("");
		try {
			const { error } = await signIn.email({
				email: data.email,
				password: data.password,
			});

			if (error) {
				setErrorMessage(error.message || "Credenciales incorrectas");
			} else {
				router.push(redirectTo);
				router.refresh();
			}
		} catch (error) {
			console.error("Error signing in:", error);
			setErrorMessage("Ocurrió un error inesperado");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			{errorMessage && (
				<div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20 animate-shake">
					<InformationCircleIcon className="h-5 w-5 shrink-0" />
					<p>{errorMessage}</p>
				</div>
			)}

			<div className="space-y-2">
				<label htmlFor="email" className="text-sm font-medium text-foreground">
					Correo electrónico
				</label>
				<input
					id="email"
					type="email"
					placeholder="ejemplo@correo.com"
					className={clsx(
						"w-full bg-surface-container-low border rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground",
						errors.email ? "border-destructive" : "border-border"
					)}
					{...register("email")}
				/>
				{errors.email && (
					<p className="text-xs text-destructive mt-1 font-medium">{errors.email.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<label htmlFor="password" className="text-sm font-medium text-foreground">
					Contraseña
				</label>
				<input
					id="password"
					type="password"
					placeholder="••••••••"
					className={clsx(
						"w-full bg-surface-container-low border rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground",
						errors.password ? "border-destructive" : "border-border"
					)}
					{...register("password")}
				/>
				{errors.password && (
					<p className="text-xs text-destructive mt-1 font-medium">{errors.password.message}</p>
				)}
			</div>

			<button
				type="submit"
				disabled={isLoading}
				className="w-full bg-primary text-primary-foreground font-label-md font-semibold h-12 rounded-xl btn-active hover:opacity-95 transition-all shadow-md mt-6 cursor-pointer flex items-center justify-center disabled:opacity-50"
			>
				{isLoading ? "Ingresando..." : "Ingresar"}
			</button>

			{/* divisor line */}
			<div className="flex items-center my-5">
				<div className="flex-1 border-t border-border"></div>
				<div className="px-2 text-muted-foreground">O</div>
				<div className="flex-1 border-t border-border"></div>
			</div>

			{showRegisterLink ? (
				<Link href="/register" className="w-full text-center h-12 flex items-center justify-center rounded-xl font-label-md border border-border bg-card text-foreground hover:bg-secondary transition-colors cursor-pointer">
					Crear una nueva cuenta
				</Link>
			) : (
				<Link href="/auth/forgot-password" className="w-full text-center h-12 flex items-center justify-center rounded-xl font-label-md border border-border bg-card text-foreground hover:bg-secondary transition-colors cursor-pointer">
					Recuperar contraseña
				</Link>
			)}

			{/* Volver a Tienda */}
			<Link
				href="/"
				className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center gap-1"
			>
				<span aria-hidden="true">←</span> Volver al inicio
			</Link>
		</form>
	);
}
