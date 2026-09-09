# AGENTS.md — carvin-landing-boilerplate

## Project Overview
Next.js 16 (App Router) landing pages with feature-based architecture. Uses React 19, Drizzle ORM (PostgreSQL), better-auth, Tailwind CSS v4, pnpm.

## Graphify (Knowledge Graph)

**Graphify** is installed and configured for this project. It creates a queryable knowledge graph of the codebase that any agent can use to understand the architecture without reading hundreds of files.

### Quick Start
```bash
# Generate knowledge graph (code-only, no API key needed)
graphify . --code-only

# Update after code changes
graphify . --code-only --update

# Query the graph
graphify query "How does authentication work?"

# View shortest path between concepts
graphify path "ProductService" "OrderService"
```

**Note:** If `graphify` command is not found, use the full path:
- Windows: `& "C:\Users\Tatán\AppData\Roaming\Python\Python313\Scripts\graphify.exe"`
- Or add Python Scripts to PATH: `$env:PATH += ";C:\Users\Tatán\AppData\Roaming\Python\Python313\Scripts"`

### Key Files
- `graphify-out/graph.json` — Persistent graph data (1423 nodes, 3549 edges)
- `graphify-out/GRAPH_REPORT.md` — Summary with god nodes, communities, surprising connections
- `graphify-out/graph.html` — Interactive visualization (open in browser)

### For Any Agent
When working on this project:
1. **Check `graphify-out/GRAPH_REPORT.md`** first for architecture overview
2. **Use `graphify query`** to trace code relationships before reading files
3. **Update graph** after significant changes with `graphify . --code-only --update`

## RTK (Token Optimization)

**RTK** is installed and configured. It compresses terminal output by 60-90% before it reaches the AI context, saving tokens.

### Quick Start
```bash
# Show token savings analytics
rtk gain

# Show command usage history with savings
rtk gain --history

# Analyze for missed savings opportunities
rtk discover

# Execute raw command without filtering (for debugging)
rtk proxy <cmd>
```

### How It Works
- RTK automatically rewrites commands like `git status` → `rtk git status`
- Hooks are installed for Claude Code (PreToolUse hook)
- OpenCode plugin installed at `~/.config/opencode/plugins/rtk.ts`

**Note:** If `rtk` command is not found, use the full path:
- Windows: `& "C:\Users\Tatán\.local\bin\rtk.exe"`
- Or add to PATH: `$env:PATH += ";C:\Users\Tatán\.local\bin"`

### Supported Commands
- **Git**: `git status`, `git diff`, `git log`, `git add`, `git commit`, `git push`
- **Files**: `ls`, `cat`, `read`, `grep`, `find`
- **Tests**: `jest`, `vitest`, `pytest`, `cargo test`
- **Build**: `eslint`, `tsc`, `next build`, `cargo build`
- **Package Managers**: `pnpm list`, `pip list`

### Meta Commands
```bash
rtk gain              # Show token savings analytics
rtk gain --history    # Show command usage history
rtk discover          # Analyze for missed opportunities
rtk proxy <cmd>       # Execute raw command without filtering
```

## Commands
```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # ESLint (flat config: eslint.config.mjs)
pnpm db:generate  # Generate Drizzle migrations
pnpm db:push      # Push schema to DB
pnpm db:seed      # Seed database
```

**Note:** `pnpm lint` runs but reports ~98 pre-existing problems (73 errors, 25 warnings) across the codebase (no-html-link-for-pages, react-hooks/immutability, setState-in-effect, no-img-element). Known tech debt; do not expect a clean pass.

## Architecture
```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin routes (protected)
│   ├── (public)/          # Public store routes
│   ├── (static)/          # Static mock (no DB dependency) → /
│   └── api/               # API routes
├── features/              # Domain features (DDD-style)
│   ├── products/          # Product catalog & admin
│   │   ├── components/    # InventoryAdmin.tsx, ProductGrid, etc.
│   │   ├── actions/       # Server actions (getProductsAction, etc.)
│   │   └── types/
│   ├── navigation/        # TopMenu, Sidebar
│   └── ...
├── shared/                # Shared UI & utilities
│   ├── components/ui/     # Button, Switch, Table, Pagination, etc.
│   └── utils/cn.ts        # clsx + tailwind-merge helper
└── config/                # App config
```

## Key Files for Current Task

### Pagination Component (shared)
- **`src/shared/components/Pagination.tsx`** — Client component using `usePathname`/`useSearchParams`. Generates page numbers via `generatePaginationNumbers`. Used in public products page (`app/[domain]/(public)/products/page.tsx`) and InventoryAdmin.

### Inventory Admin (Dashboard)
- **`src/features/products/components/InventoryAdmin.tsx`** — Client component with:
  - Local filters: `searchQuery` (name/SKU), `selectedCategoryId`
  - Server-side pagination via `getProductsAction({ page, limit })`; uses shared `Pagination` component
  - Optimistic toggle via `toggleProductAction`
  - Page driven by URL `?page=` (see `useInventoryAdmin.ts`); `totalCount` returned by `getProducts` for correct "Mostrando X-Y de Z" counter

### Top Menu (Navbar)
- **`src/features/navigation/components/top-menu/TopMenuDesktop.tsx`** — "Todos" button links to `/products` (correct public catalog route).

## Conventions
- **Server actions** in `features/*/actions/` — called directly from Server Components or via `use client` components
- **Feature components** co-located with their feature
- **Shared UI** in `src/shared/components/ui/` — primitive components (Button, Switch, Table, Pagination, Dialog, etc.)
- **`cn()` utility** from `@/shared/utils/cn` for class merging (clsx + tailwind-merge)
- **TypeScript strict** — run `npx tsc --noEmit` to verify
- **Currency** — client displays via `useFormatPrice()`/`formatPrice(price, priceConfig)`; per-store config from `getStoreConfig` (never hardcode COP/es-CO)

## Current Task Context
1. **DONE Phase 1**: `InventoryAdmin.tsx` uses shared `Pagination` component, page synced via URL (`useInventoryAdmin.ts`), filter reactivity preserved (search + category debounced to URL).
2. **DONE Phase 2**: "Todos" button in `TopMenuDesktop.tsx` points to `/products` (correct).
3. **DONE Phase 3**: Release client script + update script + stubs for disabled modules.

## Gotchas
- `Pagination` expects `totalPages` prop and reads `page` from URL search params. `useInventoryAdmin` derives `currentPage` from `searchParams.get("page")` and reloads on change.
- Admin routes use `(admin)` route group; public routes use `(public)`.
- `better-auth` for authentication; admin checks via role.

## ⚠️ ERRORES CRÍTICOS — leer antes de tocar nada (detalle completo: `docs/bitacora-errores-criticos-prevencion.md`)
1. **`proxy.ts` es el ÚNICO archivo edge permitido.** NUNCA crear `middleware.ts`: si coexisten, el server muere al arrancar (`Unhandled Rejection: Both middleware file and proxy file detected`). Auth guard (`/dashboard`, `/admin`) + tenant resolve + module guard viven fusionados ahí.
2. **Caché Turbopack se corrompe** tras borrar archivos/`db:push`/ediciones masivas: rutas existentes dan 404 aunque `tsc` pase. Recuperación: matar procesos node con `Get-CimInstance Win32_Process` (NUNCA `Get-NetTCPConnection`, da PID 0) → borrar `.next` → UN solo dev server → validar log.
3. **Server actions administrativas SIEMPRE llaman `verifyAdmin()` primero** y devuelven el error real. HTTP 200 ≠ éxito (throw capturado también responde 200). Validar persistencia en BD real, no confiar en toasts.
4. **IDs en `<script>`/`dangerouslySetInnerHTML` SIEMPRE pasan por `safeId()`** (`/^[A-Za-z0-9-_]+$/`) — patrón en `TrackingScripts.tsx` / `AnalyticsInjector.tsx`.
5. **Invalidar caché al escribir**: si el servicio lee con `unstable_cache(tags:[...])`, la action debe llamar `revalidateTag()` de esos mismos tags o los cambios no se reflejan (público puede quedar stale 60s+ o para siempre).
- **Drizzle migrations**: `drizzle/__drizzle_migrations` must stay in sync with `drizzle/meta/_journal.json`. After manual SQL changes, register them with `sha256(sql)` hash and `journal.when` as `created_at`, or `drizzle-kit migrate` will try to re-apply and fail on existing tables. `db:push` is the primary workflow (does not touch the migrations table).
- **Release stubs**: When a module is disabled, its components are purged. If another module depends on them (e.g., `landing` depends on `leads` for `LeadContactForm`), a stub is copied automatically by `release-client.js` and `update-release.js`.
- **Block registry cleanup**: `patchBrokenImports` removes orphaned imports AND registry entries. If a block's import is removed, its `[xxxBlock.schema.type]: xxxBlock,` line is also removed.
- **Middleware/proxy**: Next.js 16 usa SOLO `proxy.ts` — NUNCA crear `middleware.ts` (coexistencia = server muerto al arrancar). Usa `import { isRouteAllowed }` estático (no `require()`); Turbopack no maneja `require()` en edge.
- **DB URL truncation**: When passing `--db=` with `&` in the URL, ensure the full URL is in `.env` after generation. pnpm splits on `&`.

## CMS Category Cleanup Utility
- `cleanupOrphanedCategoriesAction(dryRun = true)` — finds & optionally deletes orphaned categories (parentId points to non-existent UUID). Dry-run by default. Reuses cascade deletion with product validation.
- Full implementation log: `docs/bitacora-categorias-cms.md`