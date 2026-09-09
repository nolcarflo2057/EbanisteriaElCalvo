import { chromium } from "@playwright/test";
import fs from "fs";

const authFile = "test-results/.auth/state.json";

async function globalSetup() {
	const dir = require("path").dirname(authFile);
	fs.mkdirSync(dir, { recursive: true });

	const browser = await chromium.launch();
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("http://localhost:3000/login");
	await page.fill("input#email", "admin@admin.com");
	await page.fill("input#password", "12345678");
	await page.click('button[type="submit"]');

	await page.waitForURL(/dashboard/, { timeout: 60000 });
	await page.locator("h1").waitFor({ state: "visible", timeout: 30000 });

	await context.storageState({ path: authFile });
	await browser.close();
}

export default globalSetup;