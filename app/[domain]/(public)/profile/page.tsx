"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth/auth-client";
import { Title } from "@/shared/components/Title";
import { Dialog } from "@/shared/components/ui/Dialog";
import { UploadDropzone } from "@/shared/utils/uploadthing";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { Camera, Mail, Shield, User, Loader2, Save, Key, Lock } from "lucide-react";

export default function ProfilePage() {
	const { data: session, isPending: sessionPending } = useSession();
	const router = useRouter();

	// Profile State
	const [name, setName] = useState("");
	const [image, setImage] = useState<string | null>(null);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUploadOpen, setIsUploadOpen] = useState(false);

	// Password State
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isChangingPassword, setIsChangingPassword] = useState(false);

	// Sync state when session loads
	useEffect(() => {
		if (session?.user) {
			setName(session.user.name || "");
			setImage(session.user.image || null);
		}
	}, [session]);

	if (sessionPending) {
		return (
			<div className="flex h-96 items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!session?.user) {
		router.replace(`/login?redirect=${encodeURIComponent("/dashboard/profile")}`);
		return null;
	}

	function getInitials(nameString: string): string {
		if (!nameString) return "U";
		const parts = nameString.trim().split(/\s+/);
		if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
		return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
	}

	const handleSaveChanges = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("El nombre no puede estar vacío");
			return;
		}

		setIsUpdating(true);
		try {
			const res = await authClient.updateUser({
				name: name.trim(),
				image: image || undefined,
			});

			if (res?.error) {
				toast.error(res.error.message || "Error al actualizar perfil");
			} else {
				toast.success("Perfil actualizado con éxito");
				router.refresh();
			}
		} catch (error) {
			console.error("Error updating profile:", error);
			toast.error("Ocurrió un error inesperado");
		} finally {
			setIsUpdating(false);
		}
	};

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!currentPassword || !newPassword || !confirmPassword) {
			toast.error("Por favor completa todos los campos de contraseña");
			return;
		}

		if (newPassword.length < 8) {
			toast.error("La nueva contraseña debe tener al menos 8 caracteres");
			return;
		}

		if (newPassword !== confirmPassword) {
			toast.error("La nueva contraseña y la confirmación no coinciden");
			return;
		}

		setIsChangingPassword(true);
		try {
			const res = await authClient.changePassword({
				currentPassword,
				newPassword,
				revokeOtherSessions: true,
			});

			if (res?.error) {
				toast.error(res.error.message || "Error al cambiar la contraseña");
			} else {
				toast.success("Contraseña cambiada con éxito");
				setCurrentPassword("");
				setNewPassword("");
				setConfirmPassword("");
			}
		} catch (error) {
			console.error("Error changing password:", error);
			toast.error("Ocurrió un error inesperado al cambiar la contraseña");
		} finally {
			setIsChangingPassword(false);
		}
	};

	return (
		<div className="flex flex-col w-full max-w-3xl mx-auto px-5 mb-72 space-y-8">
			<div>
				<Title title="Mi Perfil" />
				<p className="text-muted-foreground mt-1">
					Administra tu información de cuenta y foto de perfil.
				</p>
			</div>

			{/* Main Profile Info Card */}
			<div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
				{/* Header Cover Banner */}
				<div className="h-44 w-full bg-gradient-to-r from-primary to-primary-container relative">
					<div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
				</div>

				{/* Profile Photo Centered & Overlapping */}
				<div className="relative flex flex-col items-center -mt-20 pb-6 px-6">
					<div className="relative group w-32 h-32 rounded-full border-4 border-card shadow-lg bg-secondary overflow-hidden flex items-center justify-center">
						{image ? (
							<Image src={image} alt={name} fill sizes="128px" className="object-cover" unoptimized />
						) : (
							<span className="text-3xl font-bold text-muted-foreground">
								{getInitials(name)}
							</span>
						)}

						{/* Hover Overlay to Edit Photo */}
						<button
							type="button"
							onClick={() => setIsUploadOpen(true)}
							className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-semibold transition-opacity duration-200 cursor-pointer"
						>
							<Camera className="w-5 h-5 mb-1" />
							<span>Cambiar Foto</span>
						</button>
					</div>

					<h2 className="text-xl font-bold text-foreground mt-4">{name || "Usuario"}</h2>
					<p className="text-xs text-muted-foreground capitalize flex items-center gap-1.5 mt-1 bg-secondary px-3 py-1 rounded-full border border-border font-medium">
						<Shield className="w-3.5 h-3.5 text-primary" />
						{(session.user as any).role || "Usuario"}
					</p>
				</div>

				{/* Editable Info Fields */}
				<form onSubmit={handleSaveChanges} className="p-8 border-t border-border space-y-6">
					<div className="space-y-2">
						<label htmlFor="name" className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
							<User className="w-4 h-4" />
							Nombre Completo
						</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Ej. Juan Pérez"
							className="w-full bg-surface-container-low border border-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground"
							required
						/>
					</div>

					<div className="space-y-2">
						<label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
							<Mail className="w-4 h-4" />
							Correo Electrónico
						</label>
						<input
							type="email"
							value={session.user.email}
							disabled
							className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-sm text-muted-foreground cursor-not-allowed opacity-80"
						/>
						<p className="text-[10px] text-muted-foreground/80 pl-1">
							El correo electrónico no puede ser modificado ya que está vinculado a tu cuenta.
						</p>
					</div>

					<div className="flex justify-end pt-4 border-t border-border">
						<button
							type="submit"
							disabled={isUpdating}
							className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:bg-primary/95 transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
						>
							{isUpdating ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" />
									<span>Guardando...</span>
								</>
							) : (
								<>
									<Save className="w-4 h-4" />
									<span>Guardar Cambios</span>
								</>
							)}
						</button>
					</div>
				</form>
			</div>

			{/* Security / Password Change Card */}
			<div className="bg-card rounded-2xl shadow-xl border border-border p-8 space-y-6">
				<div className="flex items-center gap-2.5 border-b border-border pb-4">
					<Key className="w-5 h-5 text-primary" />
					<div>
						<h3 className="font-bold text-foreground text-base">Seguridad</h3>
						<p className="text-xs text-muted-foreground">Actualiza tu contraseña para mantener tu cuenta segura.</p>
					</div>
				</div>

				<form onSubmit={handleChangePassword} className="space-y-4">
					<div className="space-y-2">
						<label htmlFor="currentPassword" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
							<Lock className="w-3.5 h-3.5" />
							Contraseña Actual
						</label>
						<input
							id="currentPassword"
							type="password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							placeholder="Introduce tu contraseña actual"
							className="w-full bg-surface-container-low border border-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground"
							required
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<label htmlFor="newPassword" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
								<Lock className="w-3.5 h-3.5" />
								Nueva Contraseña
							</label>
							<input
								id="newPassword"
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								placeholder="Mínimo 8 caracteres"
								className="w-full bg-surface-container-low border border-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground"
								required
							/>
						</div>

						<div className="space-y-2">
							<label htmlFor="confirmPassword" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
								<Lock className="w-3.5 h-3.5" />
								Confirmar Nueva Contraseña
							</label>
							<input
								id="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="Repite la nueva contraseña"
								className="w-full bg-surface-container-low border border-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-foreground"
								required
							/>
						</div>
					</div>

					<div className="flex justify-end pt-4 border-t border-border">
						<button
							type="submit"
							disabled={isChangingPassword}
							className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:bg-primary/95 transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
						>
							{isChangingPassword ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" />
									<span>Cambiando contraseña...</span>
								</>
							) : (
								<>
									<Key className="w-4 h-4" />
									<span>Actualizar Contraseña</span>
								</>
							)}
						</button>
					</div>
				</form>
			</div>

			{/* Upload Image Modal */}
			<Dialog
				isOpen={isUploadOpen}
				onClose={() => setIsUploadOpen(false)}
				title="Actualizar Foto de Perfil"
				description="Sube una nueva foto de perfil utilizando el selector o arrastrando el archivo."
			>
				<div className="space-y-4 pt-2">
					<UploadDropzone
						endpoint="imageUploader"
						onClientUploadComplete={(res) => {
							const url = res?.[0]?.url;
							if (url) {
								setImage(url);
								setIsUploadOpen(false);
								toast.success("Imagen cargada con éxito. No olvides guardar los cambios.");
							}
						}}
						onUploadError={(error: Error) => {
							toast.error(`Error al subir imagen: ${error.message}`);
						}}
					/>
					<div className="flex justify-end">
						<button
							onClick={() => setIsUploadOpen(false)}
							className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-semibold rounded-xl hover:bg-secondary/80 transition-colors cursor-pointer"
						>
							Cancelar
						</button>
					</div>
				</div>
			</Dialog>
		</div>
	);
}

