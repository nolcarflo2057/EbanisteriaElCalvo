/**
 * @file fonts.ts
 * @description Configuración de tipografías del sistema. Centraliza la carga
 * e inicialización de fuentes de Google Fonts (Next.js) y expone sus variables
 * CSS para consumo en Tailwind u hojas de estilo globales.
 */

import { Inter, Outfit, Montserrat_Alternates, Domine, Work_Sans } from "next/font/google";

export const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const titleFonts = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

export const domine = Domine({
  subsets: ["latin"],
  variable: "--font-domine",
  display: "swap",
});

export const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});
