import { SettingsService } from "@/features/settings/services/settings.service";
import { getTenantContext } from "@/core/tenant/tenant-context";
import { appearanceCssVarsToString } from "@/features/settings/utils/appearance-css";

export async function ThemeProvider() {
	let appearance = null;
	try {
		const tenant = getTenantContext();
		if (tenant?.tenantId) {
			appearance = await SettingsService.getAppearance(tenant.tenantId);
		}
	} catch (error) {
		// Ignorar el error si no hay tenant activo o la DB no conecta en build time
	}

	if (!appearance) return null;

	const cssVars = appearanceCssVarsToString(appearance);

	return (
		<>
			{appearance.faviconUrl && (
				<link rel="icon" href={appearance.faviconUrl} />
			)}
			{cssVars && (
				<style dangerouslySetInnerHTML={{ __html: `:root { ${cssVars} }` }} />
			)}
			<script
				dangerouslySetInnerHTML={{
					__html: `
						(function() {
							if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
								document.documentElement.classList.add('dark');
							}
							window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
								if (e.matches) {
									document.documentElement.classList.add('dark');
								} else {
									document.documentElement.classList.remove('dark');
								}
							});
						})();
					`,
				}}
			/>
		</>
	);
}


