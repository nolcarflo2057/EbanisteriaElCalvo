import { getServerSession } from "./session";
export { getServerSession };

export async function requireAuth() {
	const session = await getServerSession();
	if (!session) {
		return {
			session: null,
			isAuth: false,
		};
	}
	return {
		session,
		isAuth: true,
	};
}
