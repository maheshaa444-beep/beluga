# Roadmap

## Phase 0 — Foundation and design system

- [x] Next.js App Router, TypeScript strict, Tailwind, shadcn/ui primitives
- [x] Black design tokens, glass, motion presets
- [x] MapLibre + Protomaps black style + `BaseMap` smoke test
- [x] Quality gates: ESLint, Prettier, Vitest, zod env, Husky, CI
- [x] Docs: AGENTS.md, .cursorrules, decisions

## Phase 1 — Products

- [x] Product model and local persistence (in-memory repository)
- [x] Add / edit / list products on the landing page
- [x] Active product selection (region picker disabled until Phase 3)


## Phase 2 — Bulk import

- [ ] CSV / spreadsheet ingest for company records
- [ ] Validation, error report, idempotent re-import
- [ ] Thousands of rows without blocking the UI

## Phase 3 — Regions

- [ ] Group imported companies by region
- [ ] Region picker after a product is selected
- [ ] Region metadata for map framing (bounds / outline source)

## Phase 4 — Regional map

- [ ] Zoom the dark map to the selected region
- [ ] Region outline
- [ ] Company pins (no priority coloring required to start)

## Phase 5 — Matching

- [ ] Background job: match companies to the active product via `lib/llm`
- [ ] Store match scores and rationale
- [ ] Job status surface (queued / running / done / failed)

## Phase 6 — Priorities panel

- [ ] Right-side panel: High / Mid / Least lists
- [ ] Sort and filter within a region
- [ ] Click a company to focus its pin

## Phase 7 — Company detail

- [ ] Exact pin highlight
- [ ] Photos, background, and contact fields for cold calling
- [ ] Empty and loading states using design primitives

## Phase 8 — Research agents

- [ ] Background agents enrich company records
- [ ] Research artifacts attached to the company view
- [ ] Rate limits, retries, and cost controls through `lib/llm`

## Phase 9 — Polish and scale

- [ ] Map performance for dense pin sets
- [ ] Import and job observability
- [ ] Keyboard shortcuts and panel motion pass

## Phase 10 — Auth (last)

- [ ] Login and session
- [ ] Tenant isolation for products, imports, and jobs
- [ ] No auth work before this phase
