# Bitácora: Resolución ESLint + Configuración Producción

**Fecha:** 2026-09-08

## Contexto

El proyecto tenía 18 warnings de ESLint y credenciales de desarrollo. Se procedió a limpiar el lint y configurar todas las variables de entorno con credenciales del cliente para despliegue en producción.

---

## 1. Resolución de 18 Warnings ESLint → 0

### `<img>` → `<next/image>` (9 warnings)

| Archivo | Línea | Fix |
|---|---|---|
| `app/[domain]/(public)/profile/page.tsx` | 146 | `<Image>` con `fill`, `sizes="128px"`, `unoptimized` |
| `app/[domain]/dashboard/profile/page.tsx` | 148 | `<Image>` con `fill`, `sizes="192px"`, `unoptimized` |
| `src/features/blocks/blocks/artisan-showcase/artisan-showcase.block.tsx` | 26 | `<Image>` con `fill`, `sizes="(max-width: 768px) 100vw, 50vw"` |
| `src/features/blocks/blocks/split-section/split-section.block.tsx` | 26 | `<Image>` con `fill`, `sizes="(max-width: 768px) 100vw, 50vw"` |
| `src/features/blocks/blocks/hero-cover/hero-cover.component.tsx` | 11 | `<Image>` con `fill`, `sizes="100vw"`, `priority`, `alt` corregido (antes usaba `data-alt`) |
| `src/features/blocks/blocks/navbar-minimal/navbar-minimal.component.tsx` | 42 | `<Image>` con `width={40}`, `height={40}`, `alt` corregido (antes usaba `data-alt`) |
| `src/features/dashboard/components/AdminSidebar.tsx` | 270, 350 | `<Image>` ×2 con `width`/`height` y `unoptimized` |
| `src/features/dashboard/components/AdminSidebarMobile.tsx` | 280 | `<Image>` con `width={40}`, `height={40}`, `unoptimized` |

### Hooks dependencies (5 warnings)

| Archivo | Línea | Fix |
|---|---|---|
| `src/features/dashboard/components/AdminSidebar.tsx` | 248 | `router` agregado al dep array de useEffect |
| `src/features/dashboard/components/AdminSidebarMobile.tsx` | 245 | `router` agregado al dep array de useEffect |
| `src/features/navigation/hooks/useSidebar.ts` | 139 | `isSuperAdmin` removido de useMemo (no se usaba dentro) |
| `src/features/whiteLabel/components/ChatboxConfigCard.tsx` | 156 | `watch` agregado al dep array de useEffect |
| `src/features/blocks/blocks/navigation/useNavigation.ts` | 7 | `linksList` envuelto en `useMemo` para evitar recreación en cada render |

### Custom fonts (2 warnings)

| Archivo | Línea | Fix |
|---|---|---|
| `app/layout.tsx` | 168, 172 | `eslint-disable-next-line @next/next/no-page-custom-font` — falsos positivos, en App Router los fonts en root layout son correctos |

### Otros (2 warnings)

| Archivo | Línea | Fix |
|---|---|---|
| `src/features/blocks/blocks/hero-cover/hero-cover.component.tsx` | 11 | `alt={props.backgroundAlt}` agregado (antes era `data-alt`) |
| `src/features/blocks/blocks/navbar-minimal/navbar-minimal.component.tsx` | 42 | `alt={props.logoAlt}` agregado (antes era `data-alt`) |

---

## 2. Configuración de Variables de Entorno (Producción)

Todas las credenciales fueron reemplazadas por las del cliente.

### Dominio
- `APP_URL` → `https://ebanisteriaelcalvo.com`
- `NEXT_PUBLIC_APP_URL` → `https://ebanisteriaelcalvo.com`
- `BETTER_AUTH_URL` → `https://ebanisteriaelcalvo.com`

### Base de datos (Neon)
- `DATABASE_URL` → nueva connection string del cliente
- Schema subido con `pnpm db:push` — tablas creadas exitosamente

### Credenciales del cliente

| Servicio | Variables actualizadas |
|---|---|
| **Resend** (email) | `SMTP_PASS=re_***` (token del cliente) |
| **UploadThing** (imágenes) | `UPLOADTHING_TOKEN=eyJ...` (token del cliente) |
| **Pusher** (realtime) | `PUSHER_APP_ID=2193076`, `PUSHER_KEY=***`, `PUSHER_SECRET=***`, `PUSHER_CLUSTER=us2` |
| **Upstash Redis** (rate limiting) | `UPSTASH_REDIS_REST_URL=https://sought-crab-151626.upstash.io`, token correspondiente |
| **OpenRouter** (IA chatbot) | `OPEN_ROUTER_KEY=sk-or-v1-***` (token del cliente) |

---

## 3. Estado de Verificación

| Check | Status |
|---|---|
| `pnpm lint` | ✅ 0 errores, 0 warnings |
| `pnpm build` | ✅ Compila exitoso |
| `.env` | ✅ 100% credenciales del cliente |
| DB schema | ✅ Subido a Neon nueva |
| Git push | ⏳ Pendiente — falta permisos de collaborator en GitHub |

## 4. Pendiente

- [ ] Aceptar invitación de collaborator en `nolcarflo2057/EbanisteriaElCalvo` para `tatan22`
- [ ] Push a GitHub
- [ ] Deploy en Vercel con variables de entorno del `.env`
- [ ] Configurar dominio `ebanisteriaelcalvo.com` en Vercel (A record: `76.76.21.21`, CNAME: `cname.vercel-dns.com`)
- [ ] Crear usuario admin en producción con `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`

---

## 5. Actualización de Teléfono/WhatsApp por Defecto

**Fecha adicional:** 2026-09-08

Se actualizaron los defaults de teléfono y WhatsApp del cliente (`3127609748`).

| Archivo | Línea | Antes | Ahora |
|---|---|---|---|
| `mock-ebanisteria.ts` | 124 | `+34 600 000 000` | `+57 312 760 9748` |
| `mock-ebanisteria.ts` | 192 | `+34 600 000 000` | `+57 312 760 9748` |
| `mock-ebanisteria.ts` | 195 | `34600000000` | `573127609748` |
| `contact.schema.ts` | 57 | `573001234567` | `573127609748` |

---

## 6. Migración de Base de Datos (Vieja → Nueva)

**Fecha adicional:** 2026-09-08

Se migraron todos los datos de la DB vieja (`ep-bold-darkness-ayob5cks`) a la nueva (`ep-curly-term-ay1gpyhc`).

**Tablas migradas (16 con datos):**

| Tabla | Registros |
|---|---|
| tenants | 1 |
| users | 2 |
| accounts | 2 |
| sessions | 23 |
| categories | 4 |
| leads | 3 |
| chat_messages | 86 |
| tenant_page_blocks | 8 |
| white_label_config | 1 |
| tenant_appearance | 1 |
| audit_logs | 26 |
| files | 2 |
| chatbot_knowledge | 3 |
| chatbot_unknown_questions | 1 |

**Tablas vacías (0 registros):** cms_menus, global_attributes, notifications, tenant_integrations, appointments, verifications, tenant_verticals, __drizzle_migrations

**Resultado:** ✅ 0 errores, migración exitosa con `SET CONSTRAINTS ALL DEFERRED`
