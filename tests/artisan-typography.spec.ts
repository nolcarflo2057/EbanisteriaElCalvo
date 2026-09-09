import { test, expect, type Page } from "@playwright/test";

interface Typo {
	fontFamily: string;
	fontSize: string;
	fontWeight: string;
	lineHeight: string;
	letterSpacing: string;
}

async function getTypo(page: Page, selector: string): Promise<Typo | null> {
	return page.evaluate((sel) => {
		const el = document.querySelector(sel) as Element | null;
		if (!el) return null;
		const cs = getComputedStyle(el);
		return {
			fontFamily: cs.fontFamily.split(",")[0].trim(),
			fontSize: cs.fontSize,
			fontWeight: cs.fontWeight,
			lineHeight: cs.lineHeight,
			letterSpacing: cs.letterSpacing,
		};
	}, selector);
}

async function checkTypoMatches(page: Page, artisanSel: string, gallerySel: string, what: string) {
	const artisan = await getTypo(page, artisanSel);
	const gallery = await getTypo(page, gallerySel);
	expect(artisan, `${what}: sección artesano (#${artisanSel}) no encontrada`).not.toBeNull();
	expect(gallery, `${what}: sección galería (#${gallerySel}) no encontrada`).not.toBeNull();
	for (const prop of ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing"] as const) {
		expect(artisan![prop], `${what} · ${prop} (artesano: ${artisan![prop]} vs galería: ${gallery![prop]})`).toBe(gallery![prop]);
	}
}

test.describe("Tipografía artesano = galería", () => {
	test("Desktop — título, descripción y badge coinciden con la galería", async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await page.waitForSelector("[id=artesano] h2");
		await page.waitForSelector("[id=galeria] h2");

		await checkTypoMatches(page, "[id=artesano] h2", "[id=galeria] h2", "Título (h2)");
		await checkTypoMatches(page, "[id=artesano] p", "[id=galeria] .text-center > p", "Descripción (p)");
		await checkTypoMatches(page, "[id=artesano] span", "[id=galeria] span", "Badge/etiqueta (span)");
	});

	test("Mobile — título, descripción y badge coinciden con la galería", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await page.waitForSelector("[id=artesano] h2");
		await page.waitForSelector("[id=galeria] h2");

		await checkTypoMatches(page, "[id=artesano] h2", "[id=galeria] h2", "Título (h2)");
		await checkTypoMatches(page, "[id=artesano] p", "[id=galeria] .text-center > p", "Descripción (p)");
		await checkTypoMatches(page, "[id=artesano] span", "[id=galeria] span", "Badge/etiqueta (span)");
	});
});
