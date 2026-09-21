# Prospect Map

Enterprise sales intelligence: dark regional maps, product-to-company matching, and call-ready company research.

Phase 0 is foundation only (design system, map smoke test, quality gates).

## Setup

```bash
pnpm install
cp .env.example .env.local
```

Set `NEXT_PUBLIC_PROTOMAPS_API_KEY` (hosted tiles) or `NEXT_PUBLIC_MAP_TILES_URL` (TileJSON, ZXY, or PMTiles).

```bash
pnpm dev
```

- Home: map smoke test
- Design system: [http://localhost:3000/design](http://localhost:3000/design) (development only)

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Next.js dev server |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest |
| `pnpm build` | Production build |

See `docs/ROADMAP.md` and `docs/DECISIONS.md`.

<!-- Git push test: 09/21/2026 18:37:18 -->
