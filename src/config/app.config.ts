/**
 * @file app.config.ts
 * @description Configuración global del núcleo (Core). Define parámetros generales
 * de la tienda, etiquetas transversales de UI y reglas comerciales base que
 * se consumen de forma agnóstica en toda la aplicación.
 */

export const appConfig = {
  appName: "Carvin Core",

  metadata: {
    title: "Carvin Shop | Pereira",
    description: "La mejor tienda de ropa de Pereira - Carvin Shop",
  },

  store: {
    name: "Mi Tienda",
    currency: "COP",
    locale: "es-CO",
    taxRate: 0.19, // IVA del 19% en Colombia
    shippingCost: 15000, // Costo de envío estándar en Colombia
    usdExchangeRate: 4200, // COP → USD para pasarelas que operan en dólares (PayPal)
  },

  media: {
    placeholderProduct: "/images/placeholder-product.png",
  },

  labels: {
    home: "Inicio",
    products: "Productos",
    catalog: "Catálogo",
    productsSubtitle: "Nuestros productos más recientes",
    productNotFound: "Producto no encontrado",
    noProductsAvailable: "No hay productos disponibles por el momento.",
    loadingPagination: "Cargando paginación...",
    addToCart: "Añadir al carrito",
    buyNow: "Comprar ahora",
    outOfStock: "Producto agotado",
    noImage: "Sin imagen",
    menu: "Menú",
    tagline: "Tu tienda de confianza.",
  },

  footer: {
    aboutTitle: "Sobre nosotros",
    helpTitle: "Ayuda",
    companyTitle: "Empresa",
    links: {
      help: [
        { label: "Preguntas frecuentes", href: "#" },
        { label: "Envíos y devoluciones", href: "#" },
        { label: "Contacto", href: "#" },
      ],
      company: [
        { label: "Sobre nosotros", href: "#" },
        { label: "Términos y condiciones", href: "/p/terminos" },
        { label: "Privacidad", href: "/p/privacidad" },
      ],
    },
    social: [
      { label: "Instagram", href: "#" },
      { label: "Facebook", href: "#" },
      { label: "TikTok", href: "#" },
    ],
  },
} as const;

export type AppConfig = typeof appConfig;
