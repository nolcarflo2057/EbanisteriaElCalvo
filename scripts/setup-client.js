const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
	console.log("==================================================");
	console.log("🚀 Asistente de Configuración para Nuevo Cliente");
	console.log("==================================================\n");

	const name = await question("1. Nombre del Negocio (ej. Barbería Paco): ");
	if (!name.trim()) {
		console.error("❌ El nombre del negocio es requerido.");
		process.exit(1);
	}

	const slugSuggestion = name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");

	const slug = await question(`2. Subdominio/Slug sugerido [${slugSuggestion}]: `) || slugSuggestion;
	const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");

	const niche = await question("3. Rubro/Nicho del negocio (ej. barberia, clinica, carpinteria): ") || "servicios";

	const color = await question("4. Color principal hexadecimal [#F97316]: ") || "#F97316";

	const currency = await question("5. Moneda (COP, USD, EUR, MXN...) [USD]: ") || "USD";
	const cleanCurrency = currency.trim().toUpperCase();

	const dbUrl = await question("6. URL de conexión a la Base de Datos PostgreSQL: ");
	if (!dbUrl.trim()) {
		console.error("❌ La URL de la base de datos es requerida.");
		process.exit(1);
	}

	rl.close();

	console.log("\n⚙️ Generando archivos de configuración...");

	// 1. Crear/Actualizar archivo .env
	const authSecret = crypto.randomBytes(32).toString("hex");
	const envContent = `DATABASE_URL="${dbUrl.trim()}"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SINGLE_TENANT="true"
NEXT_PUBLIC_TENANT_SLUG="${cleanSlug}"
BETTER_AUTH_SECRET="${authSecret}"
`;
	fs.writeFileSync(path.resolve(process.cwd(), ".env"), envContent);
	console.log("✅ Archivo .env generado exitosamente.");

	// 2. Crear/Actualizar seed.config.json
		const seedConfig = {
			store: {
				name: name.trim(),
				slug: cleanSlug,
				currency: cleanCurrency,
				locale: "es-CO",
				taxRate: 0,
				shippingCost: 0,
				niche: niche.trim(),
				department: "servicios",
				appearance: {
					primaryColor: color,
					secondaryColor: "#F4F4F5",
					accentColor: "#EA580C",
					borderRadius: "0.375rem",
					shadowStyle: "shadow-xs",
				},
			},
			categories: [],
		};
	fs.writeFileSync(
		path.resolve(process.cwd(), "seed.config.json"),
		JSON.stringify(seedConfig, null, 2)
	);
	console.log("✅ Archivo seed.config.json generado exitosamente.");

	// 3. Ejecutar inicialización de Base de Datos
	console.log("\n📦 Inicializando base de datos...");
	try {
		console.log("Ejecutando push de tablas...");
		execSync("npx drizzle-kit push", { stdio: "inherit" });

		console.log("Ejecutando siembra de datos (seed)...");
		execSync("npx tsx src/db/seed.ts", { stdio: "inherit" });

		console.log("\n==================================================");
		console.log("🎉 ¡Configuración completada con éxito!");
		console.log(`Negocio:      ${name}`);
		console.log(`Subdominio:   ${cleanSlug}.carvin.dev`);
		console.log("==================================================");
		console.log("\nPara iniciar el servidor de desarrollo local:");
		console.log("pnpm dev\n");
	} catch (error) {
		console.error("\n❌ Error durante el despliegue de base de datos:", error.message);
		process.exit(1);
	}
}

main();
