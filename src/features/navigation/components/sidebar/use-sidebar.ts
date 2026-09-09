import { useEffect } from "react";
import { useSession, signOut } from "@/lib/auth/auth-client";
import { usePathname } from "next/navigation";

export function useSidebar(onClose: () => void) {
	const { data: session } = useSession();
	const pathname = usePathname();
	const userRole = (session?.user as { role?: string })?.role || "";
	const isAdmin = userRole === "admin";

	const handleSignOut = async () => {
		await signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = "/auth/login";
				},
			},
		});
		onClose();
	};

	useEffect(() => {
		onClose();
	}, [pathname, onClose]);

	return {
		session,
		isAdmin,
		handleSignOut,
	};
}
