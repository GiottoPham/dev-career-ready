# CareerReady — Project Reference

## Concept

CareerReady helps developers prepare for job interviews.
- **Tagline:** "Biết mình thiếu gì. Luyện đúng chỗ. Tự tin phỏng vấn."
- Users paste a job description + upload a CV → AI identifies skill gaps and generates a learning roadmap + mock interview questions with AI feedback.

## Modules

| Module | Description |
|---|---|
| **Skill Gap Analyzer** | Paste JD + upload CV (PDF) or enter skills manually. AI outputs ✅ existing skills, ❌ missing skills, 📚 resource roadmap. |
| **Mock Interview** | Choose role (Frontend, Backend, PM, Designer…). AI generates questions from the JD. User answers via text or audio. AI scores and gives feedback. |
| **Dashboard** | Practice session history, per-skill progress tracker, score trend over time. |

## Monorepo Structure

```
dev-career-ready-monorepo/
├── apps/
│   ├── web/          # Vite + TanStack Router (React 19, Tailwind v4)
│   └── api/          # Express 5 + Drizzle ORM (runs via Bun)
├── packages/
│   └── shared/       # Shared types / utilities (zod schemas, etc.)
├── package.json      # Bun workspaces root
└── tsconfig.json
```

## Tech Stack

### Frontend (`apps/web`)
- **Runtime/bundler:** Vite 8, deployed to Cloudflare Workers via `@cloudflare/vite-plugin`
- **Router:** TanStack Router (file-based, `src/routes/`)
- **UI:** React 19, Tailwind CSS v4, Radix UI primitives, shadcn-style components in `src/components/ui/`
- **Forms:** TanStack Form
- **Styling utilities:** `clsx`, `tailwind-merge`, `class-variance-authority`

### Backend (`apps/api`)
- **Runtime:** Bun (use `bun` commands, not `node`)
- **Framework:** Express 5
- **ORM:** Drizzle ORM + drizzle-kit for migrations
- **DB:** to be configured (Drizzle supports SQLite/Postgres)
- **Middleware:** cors, morgan

### Shared (`packages/shared`)
- Zod schemas, shared TypeScript types consumed by both web and api

## Dev Commands

```bash
bun run dev:web      # Start web at http://localhost:3000
bun run dev:api      # Start API with Bun --hot
bun run type-check   # tsc across all workspaces + eslint --fix
```

## Key Conventions

- **Package manager:** Bun everywhere. Use `bun install`, `bunx`, `bun run`.
- **Env vars:** Bun auto-loads `.env` — no dotenv needed in API code.
- **Routes:** TanStack Router uses file-based routing under `apps/web/src/routes/`. Run `bun run generate-routes` after adding route files.
- **Path alias:** `#/*` maps to `apps/web/src/*`.
- **Shared imports:** import from `packages/shared` as a workspace package.
- **Type checking:** run per-workspace tsconfigs (`apps/web/tsconfig.json`, `apps/api/tsconfig.json`), not root tsconfig directly.
