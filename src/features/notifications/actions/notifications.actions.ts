"use server";

import { requireAuth } from "@/lib/auth/auth-server";
import { NotificationsService } from "../services/notifications.service";

export async function getMyNotificationsAction() {
	const { session, isAuth } = await requireAuth();
	if (!isAuth || !session) return { error: "No autorizado" };

	try {
		const list = await NotificationsService.getUserNotifications(session.user.id);
		const count = await NotificationsService.getUnreadCount(session.user.id);
		return { success: true, notifications: list, unreadCount: count };
	} catch (error) {
		return { error: "Error al cargar las notificaciones" };
	}
}

export async function markAsReadAction(notificationId: string) {
	const { isAuth } = await requireAuth();
	if (!isAuth) return { error: "No autorizado" };

	try {
		await NotificationsService.markAsRead(notificationId);
		return { success: true };
	} catch (error) {
		return { error: "Error al actualizar la notificación" };
	}
}
