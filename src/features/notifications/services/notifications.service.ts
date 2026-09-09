import { db } from "@/db";
import { notifications } from "@/db/schema/notifications";
import { pusher } from "@/lib/pusher";
import { eq, and, desc } from "drizzle-orm";

export class NotificationsService {
	/**
	 * Crea una notificación en la base de datos y la transmite en tiempo real usando Pusher
	 */
	static async createAndNotify(params: {
		userId: string;
		title: string;
		message: string;
		type?: string;
		data?: Record<string, any>;
	}) {
		try {
			// 1. Guardar en Base de Datos
			const [notification] = await db
				.insert(notifications)
				.values({
					userId: params.userId,
					title: params.title,
					message: params.message,
					type: params.type || "info",
					data: params.data || {},
				})
				.returning();

			// 2. Transmitir en tiempo real usando Pusher
			if (process.env.PUSHER_KEY) {
				await pusher.trigger(
					`notification-channel-${params.userId}`,
					"new-notification",
					notification
				);
			}

			return notification;
		} catch (error) {
			console.error("Error creating and publishing notification:", error);
			throw new Error("No se pudo procesar la notificación");
		}
	}

	/**
	 * Obtiene el conteo de notificaciones no leídas
	 */
	static async getUnreadCount(userId: string): Promise<number> {
		try {
			const results = await db
				.select()
				.from(notifications)
				.where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
			return results.length;
		} catch (error) {
			console.error("Error getting unread count:", error);
			return 0;
		}
	}

	/**
	 * Obtiene todas las notificaciones de un usuario
	 */
	static async getUserNotifications(userId: string) {
		try {
			return await db
				.select()
				.from(notifications)
				.where(eq(notifications.userId, userId))
				.orderBy(desc(notifications.createdAt))
				.limit(50);
		} catch (error) {
			console.error("Error fetching user notifications:", error);
			return [];
		}
	}

	/**
	 * Marca una notificación como leída
	 */
	static async markAsRead(notificationId: string): Promise<void> {
		try {
			await db
				.update(notifications)
				.set({ read: true })
				.where(eq(notifications.id, notificationId));
		} catch (error) {
			console.error("Error marking notification as read:", error);
		}
	}
}
