# Guía de Despliegue — Landing White-Label (Ebanistería El Calvo)

> Este release es una **landing page de marca blanca con chatbot y WhatsApp**, NO una
> tienda e-commerce. No hay carrito, ni productos, ni pasarela de pagos.

## Qué incluye este release

| Módulo | Qué hace |
|---|---|
| **Landing + Bloques** | Página pública armada con un constructor visual de secciones (hero, CTA, galería, etc.). |
| **Leads de contacto** | Formulario de la landing que guarda mensajes y los envía por email (SMTP). |
| **Analítica** | GA4, Meta Pixel, Google Ads, TikTok Pixel y Google Tag Manager. |
| **Marca Blanca (White-Label)** | Branding (logo, colores, fuentes), chatbot y botón de WhatsApp. |
| **Chatbot Simple** | Responde por `tags` configurados (ej. `precio`, `horario`) con respuestas predefinidas. |
| **Chatbot Avanzado (IA)** | Usa OpenRouter para responder con IA generativa. |
| **WhatsApp** | Widget flotante que abre una conversación con el número configurado. |

**Modo tenancia:** este release está configurado en **single-tenant** (un solo negocio,
slug `ebanisteria-el-calvo`). El `proxy.ts` reescribe cualquier ruta `/ruta` →
`/ebanisteria-el-calvo/ruta`, por eso el cliente siempre usa URLs limpias
(`tudominio.com/login`, `tudominio.com/dashboard`, …).

---

## Requisitos previos (cuentas)

| Qué | Para qué | Costo |
|---|---|---|
| [Vercel](https://vercel.com) (o Docker) | Alojar la web | Gratis (Hobby) |
| [Neon.tech](https://neon.tech) o [Supabase](https://supabase.com) | PostgreSQL | Gratis |
| [Upstash Redis](https://upstash.com) | Rate-limit de login (anti force-brute) | Gratis |
| [OpenRouter](https://openrouter.ai) | Clave de IA para el chatbot avanzado | Prepago |
| [UploadThing](https://uploadthing.com) | Subir logo e imágenes del branding | Gratis (2GB) |
| SMTP (Mailtrap, Resend, etc.) | Recibir leads del formulario por email | Gratis |
| Un dominio | URL profesional | ~$10-30/año |

---

## Paso 1: Base de datos PostgreSQL

1. Crea un proyecto en Neon o Supabase (región cercana a Colombia, p.ej. `us-east-1`).
2. Copia el string de conexión (`postgresql://usuario:pass@host/db?sslmode=...`).
3. Lo usarás en la variable `DATABASE_URL`.

---

## Paso 2: Subir el código a GitHub

```bash
git remote add origin https://github.com/tu-usuario/ebanisteria-el-calvo.git
git branch -M main
git push -u origin main
```

---

## Paso 3: Configurar Vercel (Environment Variables)

En **Project → Settings → Environment Variables** agrega:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | El string de PostgreSQL del Paso 1 |
| `BETTER_AUTH_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `BETTER_AUTH_URL` | `https://tudominio.com` (o la URL `.vercel.app` temporal) |
| `NEXT_PUBLIC_APP_URL` | igual que `BETTER_AUTH_URL` |
| `APP_URL` | igual que `BETTER_AUTH_URL` |
| `NEXT_PUBLIC_SINGLE_TENANT` | `true` |
| `NEXT_PUBLIC_TENANT_SLUG` | `ebanisteria-el-calvo` |
| `UPSTASH_REDIS_REST_URL` | URL de tu base Upstash Redis |
| `UPSTASH_REDIS_REST_TOKEN` | Token de Upstash Redis |
| `OPEN_ROUTER_KEY` | Clave de API de OpenRouter (chatbot IA) |
| `UPLOADTHING_TOKEN` | Token de UploadThing |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Credenciales SMTP para leads |
| `SEED_ADMIN_EMAIL` | Email del admin (p.ej. `admin@admin.com`) |
| `SEED_ADMIN_PASSWORD` | Contraseña inicial del admin |
| `PUSHER_APP_ID` / `PUSHER_KEY` / `PUSHER_SECRET` / `PUSHER_CLUSTER` | Opcional (realtime) |
| `NEXT_PUBLIC_PUSHER_KEY` / `NEXT_PUBLIC_PUSHER_CLUSTER` | Opcional |

> ⚠️ `BETTER_AUTH_URL` y `NEXT_PUBLIC_APP_URL` **deben apuntar al dominio real**.
> Si quedan en `localhost`, el login se rechaza en producción (better-auth valida el Origin).

---

## Paso 4: OpenRouter (chatbot avanzado)

1. Regístrate en https://openrouter.ai → Keys → crea una API Key.
2. Pásala a `OPEN_ROUTER_KEY` en Vercel.
3. En el dashboard, se elige el modelo de IA y se activa el modo "Avanzado".

---

## Paso 5: UploadThing (logo e imágenes)

1. https://uploadthing.com → nueva app → copia el token.
2. Pásalo a `UPLOADTHING_TOKEN`.

---

## Paso 6: SMTP (leads por email)

Configura las 4 variables `SMTP_*`. El formulario de la landing enviará los leads
a la dirección que definas en la configuración de White-Label.

---

## Paso 7: Rate-limit de login (ya incluido)

El login tiene protección anti force-brute: **3 intentos fallidos por ventana de 10 min**
(Devuelve HTTP `429` hasta que pasa la ventana). El contador vive en **Upstash Redis**,
por lo que funciona correctamente en Vercel (serverless), no solo en un proceso único.

---

## Paso 8: Sembrar la base de datos (crea el tenant + admin)

Después del primer deploy:

```bash
npm i -g vercel
vercel link
vercel env pull .env.production.local
pnpm db:push          # sincroniza el schema
pnpm db:seed          # crea el tenant "ebanisteria-el-calvo" + usuario admin
```

> En local (Docker) ya viene sembrado; en producción corre `db:push` + `db:seed` una vez.

---

## Paso 9: Dominio personalizado

1. Vercel → Settings → Domains → agrega `tudominio.com`.
2. Configura el CNAME / nameservers que indique Vercel.
3. Cambia `BETTER_AUTH_URL` y `NEXT_PUBLIC_APP_URL` a `https://tudominio.com` y redeploy.

---

## Paso 10: Primer login y configuración

1. Entra a `https://tudominio.com/login`.
2. Usa `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.
3. Ve a **Dashboard → Settings → White Label** y configura:
   - **Branding:** nombre, logo, colores, fuentes.
   - **Chatbot Simple:** define `tags` (ej. `precio`, `horario`) y su respuesta.
   - **Chatbot Avanzado:** activa IA y elige modelo de OpenRouter.
   - **WhatsApp:** número y mensaje predeterminado del widget flotante.
4. **Cambia la contraseña del admin** inmediatamente.

---

## Troubleshooting

| Síntoma | Causa probable | Solución |
|---|---|---|
| Login devuelve `401` siempre / no entra | `BETTER_AUTH_URL` o `NEXT_PUBLIC_APP_URL` apuntan a `localhost` | Pon el dominio real y redeploy |
| Login devuelve `429` tras 3 intentos | Rate-limit funcionando | Espera 10 min o limpia la clave en Upstash Redis |
| Landing da `404` | Falta `NEXT_PUBLIC_TENANT_SLUG` / `NEXT_PUBLIC_SINGLE_TENANT` | Agrégalos en env y redeploy |
| Imágenes/logo no cargan | `UPLOADTHING_TOKEN` mal | Revisa la variable en Vercel |
| Chatbot avanzado no responde | `OPEN_ROUTER_KEY` inválida o sin crédito | Verifica la clave y el saldo |
| Leads no llegan por email | SMTP mal configurado | Revisa `SMTP_*` |
