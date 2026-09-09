"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { useSession } from "@/lib/auth/auth-client";
import { getMyNotificationsAction, markAsReadAction } from "../actions/notifications.actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import toast from "react-hot-toast";

interface NotificationItem {
	id: string;
	title: string;
	message: string;
	type: string;
	read: boolean;
	createdAt: Date;
}

export function NotificationList() {
	const { data: session } = useSession();
	const [notifications, setNotifications] = useState<NotificationItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchNotifications = () => {
		getMyNotificationsAction().then((res) => {
			if (res.error) {
				toast.error(res.error);
			} else if (res.notifications) {
				setNotifications(res.notifications as any);
			}
			setIsLoading(false);
		});
	};

	useEffect(() => {
		fetchNotifications();
	}, []);

	useEffect(() => {
		if (!session?.user?.id || !process.env.NEXT_PUBLIC_PUSHER_KEY) return;

		const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
			cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2",
		});

		const channelName = `notification-channel-${session.user.id}`;
		const channel = pusher.subscribe(channelName);

		channel.bind("new-notification", (newNotif: NotificationItem) => {
			setNotifications((prev) => [newNotif, ...prev]);
			toast((t) => (
				<span>
					<b>{newNotif.title}</b>: {newNotif.message}
				</span>
			), { icon: "🔔" });
		});

		return () => {
			channel.unbind_all();
			channel.unsubscribe();
		};
	}, [session]);

	const handleMarkAsRead = async (id: string) => {
		const res = await markAsReadAction(id);
		if (res.success) {
			setNotifications((prev) =>
				prev.map((n) => (n.id === id ? { ...n, read: true } : n))
			);
			toast.success("Notificación marcada como leída");
		} else {
			toast.error("Ocurrió un error");
		}
	};

	if (isLoading) {
		return <div className="text-center py-8">Cargando notificaciones...</div>;
	}

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>Notificaciones</CardTitle>
				</div>
				<Badge variant="secondary">
					{notifications.filter((n) => !n.read).length} pendientes
				</Badge>
			</CardHeader>
			<CardContent className="space-y-4">
				{notifications.length === 0 ? (
					<p className="text-center text-muted-foreground py-8">
						No tienes notificaciones.
					</p>
				) : (
					notifications.map((n) => (
						<div
							key={n.id}
							className={`p-4 rounded-lg border transition-all flex items-start justify-between gap-4 ${
								n.read ? "bg-card border-border opacity-70" : "bg-primary/5 border-primary/20 shadow-xs"
							}`}
						>
							<div className="space-y-1">
								<h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
									{!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
									{n.title}
								</h4>
								<p className="text-sm text-muted-foreground">{n.message}</p>
								<span className="text-xs text-muted-foreground block">
									{new Date(n.createdAt).toLocaleString()}
								</span>
							</div>

							{!n.read && (
								<Button
									size="sm"
									variant="ghost"
									onClick={() => handleMarkAsRead(n.id)}
									className="cursor-pointer"
								>
									Marcar leída
								</Button>
							)}
						</div>
					))
				)}
			</CardContent>
		</Card>
	);
}
