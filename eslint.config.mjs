import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals"),
	{
		ignores: [".next/**", "out/**", "build/**", "next-env.d.ts", "graphify-out/**", "playwright-report/**", "test-results/**", "releases/**", "clients/**", "db-backups/**"],
	},
];

export default eslintConfig;
