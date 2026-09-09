export const countryNames: Record<string, string> = {
  CO: "Colombia", MX: "México", AR: "Argentina", CL: "Chile", PE: "Perú",
  EC: "Ecuador", VE: "Venezuela", BR: "Brasil", US: "Estados Unidos",
  ES: "España", CR: "Costa Rica", PA: "Panamá", DO: "República Dominicana",
  GT: "Guatemala", HN: "Honduras", SV: "El Salvador", NI: "Nicaragua",
  BO: "Bolivia", PY: "Paraguay", UY: "Uruguay",
};

export function getCountryName(code: string): string {
  return countryNames[code.toUpperCase()] || code;
}
