import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "@/lib/auth/auth-server";
import { db } from "@/db";
import { files } from "@/db/schema/uploads";
import { AuditService } from "@/features/audit/services/audit.service";

const f = createUploadthing();

export const ourFileRouter = {
	// Definiendo el endpoint de subida general
	imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
		.middleware(async () => {
			const session = await getServerSession();

			if (!session) {
				console.error("[UploadThing Middleware] Unauthorized: No session found");
				throw new UploadThingError("Unauthorized");
			}
			return { userId: session.user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			try {
				// Registrar el archivo subido en la base de datos
				const [dbFile] = await db
					.insert(files)
					.values({
						name: file.name,
						key: file.key,
						url: file.ufsUrl || file.url,
						mimeType: "image/png", // Estimado por defecto
						size: file.size,
						uploadedBy: metadata.userId,
					})
					.returning();

				// Registrar en la auditoría transversal
				await AuditService.log({
					userId: metadata.userId,
					action: "CREATE",
					entity: "files",
					entityId: dbFile.id,
					metadata: { filename: file.name, size: file.size },
				});

				return { uploadedBy: metadata.userId, fileId: dbFile.id };
			} catch (error) {
				console.error("Error storing file metadata:", error);
				throw new Error("Failed to store file metadata");
			}
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
