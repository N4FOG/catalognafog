# Project Knowledge

## Project
**rawell-v3** (JCV/Rawell Química) — A Portuguese-language (pt-BR) B2C/B2B **product catalog & quote system** for lawn/garden chemicals ("jardinagem amadora"). React 19 + Vite + TypeScript + Tailwind v4 + Zustand. Deployed/hosted PWA-style SPA (base `/`), also generates static product landing pages for SEO/WhatsApp previews.

## Commands
- Install: `npm install`
- Dev: `npm run dev` (Vite, uses port 5173 with host exposed)
- Build: `npm run build` (`tsc -b && vite build && node scripts/generate-product-pages.js` — **critical**: it runs TS check first, and it generates `/dist/p/<slug>/` product HTML pages via `scripts/generate-product-pages.js` as the last step)
- Preview: `npm run preview`
- Lint: `npm run lint` (oxlint; config in `.oxlintrc.json`)

## Architecture
- `src/App.tsx` — root app: routing-ish logic, `?vendedor=` / `?produto=` URL params, theme bootstrap
- `src/data/` — seed/static data: `config.ts` (contacts, webhook URLs, sellers), `categories.ts`, `products.ts` (largest file)
- `src/store/` — Zustand stores (persisted via `idb-keyval`/localStorage): `useCartStore`, `useSellerStore`, `useAdminStore`, `useCatalogStore`, `useThemeStore`, `useToastStore`
- `src/components/` — `catalog/`, `cart/`, `proposal/` (PDF + WhatsApp), `seller/` (PIN login, dashboard, commissions), `admin/` (product CRUD), `layout/`, `ui/`
- `src/utils/` — finance/price-discount calc engine, formatters, telemetry (Google Sheets auditor via Apps Script webhook in `google-apps-script.js`), Drive upload, PDF gen (jspdf), search (minisearch)
- `scripts/generate-product-pages.js` — post-build: creates `/p/<slug>` + `/produto/<slug>` static HTML from `products.ts` for SEO/WhatsApp share previews (bot-only meta; humans redirect to `/?produto=<slug>`)
- `public/sw.js` — hand-written service worker cache
- Repo root also holds legacy/static artifacts (`Cátalogo 2026.pdf`, `MEGABRAIN_RAWELL_2026.md` — authoritative product catalog / tech specs bible, several standalone `.html` legacy pages, `google-apps-script.js`) that do NOT belong to the Vite app build

## Conventions & Gotchas
- **Language**: All UI copy, data, comments and user-facing text is Brazilian Portuguese — match it.
- **Product data is the single source of truth** in `src/data/products.ts` (fields like `nome`, `o_que_faz`, `imagens`). Changing it triggers static page slugs — keep the slug format (`scripts/generate-product-pages.js` slugify) stable for existing URLs.
- **Money rules are strict**: pricing/discount logic lives in `src/utils/calculations.ts` (item discount + global order discount that only applies to items without individual discount; also computes client "economia"). Don't reimplement or bypass when touching cart/proposal code.
- The **audit/telemetry webhook URL** (`CONFIG.auditWebhookUrl`) points to a real Google Apps Script deployment (see `GUIA-AUDITORIA-GOOGLE-SHEETS.md` for how it's set up); code in `src/utils/driveUploader.ts` still validates it at runtime (must start with `http`) — never assume it's valid.
- Seller PINs and WhatsApp numbers live in `src/data/config.ts` (`VENDEDORES`); treat as sensitive, don't echo around.
- Tech stack pins: Tailwind **v4** (CSS-first config, no `tailwind.config.js` file), React 19, **lucide-react v1.41** (note: version is unusual), jspdf v4, minisearch, motion.
- Store images/downloads under `public/img/` and `src/assets/`; product images in `public/img/`.
- lint uses **oxlint** (`npm run lint`), not eslint.
- Never edit files in `dist/` — it's generated output (`npm run build`).
