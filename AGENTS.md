# Prospect Map

Conventions for agents and contributors.

## Product

Enterprise sales intelligence: products, regional company imports, a dark regional map with pins, High/Mid/Least priorities, company research for cold calling. AI matching and research run as **background jobs**. **Auth is last.**

## Theme

Black UI only. Background `#050506`, three surface layers, hairline borders `rgba(255,255,255,0.08)`. One accent: electric cyan, used sparingly. Tier colors: High emerald, Mid amber, Least slate. Inter for UI, JetBrains Mono for numbers and scores. Do not introduce a second accent or a light theme.

Tokens live in `app/globals.css` and are wired into Tailwind. Do not scatter hex values in feature code.

## Architecture

- UI: `app/`, `components/`, `features/`
- Map: `components/map`, style in `lib/geo`
- Data: Drizzle via `lib/db` when introduced
- **LLM calls only through `lib/llm`.** No direct provider SDKs in features or app routes.
- Agents live in `lib/agents` and must be invoked from background jobs, not from request/render paths.
- Feature folders: `features/{products,import,regions,matching,priorities,company}`

## Auth

Do not add authentication, sessions, or user accounts until the roadmap phase that explicitly schedules it (last).

## Quality

TypeScript strict. Validate env in `lib/env.ts` with zod. Run lint, typecheck, and tests before finishing a phase.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
