const ATTRIBUTE_SYNONYMS: Record<string, string> = {
	talla: "size",
	talle: "size",
	medida: "size",
	sizes: "size",
	colour: "color",
	marca: "brand",
};

export function normalizeAttributes(attributes: Record<string, unknown> | null | undefined): Record<string, unknown> {
	if (!attributes) return {};

	const normalized: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(attributes)) {
		const canonicalKey = ATTRIBUTE_SYNONYMS[key] || key;
		normalized[canonicalKey] = value;
	}

	return normalized;
}
