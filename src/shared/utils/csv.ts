/**
 * Utilidad para exportar datos a CSV (client-side).
 */

function escapeCell(value: unknown): string {
	if (value === null || value === undefined) return "";
	const str = String(value);
	// Escapar comillas dobles y encerrar si contiene comas, comillas o saltos de línea.
	if (/[",\n\r]/.test(str)) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

export function toCsv(headers: string[], rows: unknown[][]): string {
	const lines = [
		headers.join(","),
		...rows.map((row) => row.map((cell) => escapeCell(cell)).join(",")),
	];
	// BOM para que Excel reconozca UTF-8.
	return "\uFEFF" + lines.join("\r\n");
}

export function downloadCsv(filename: string, csv: string): void {
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

export function timestampForFile(): string {
	const d = new Date();
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
}
