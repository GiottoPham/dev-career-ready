# CareerReady

> **Biết mình thiếu gì. Luyện đúng chỗ. Tự tin phỏng vấn.**

CareerReady helps developers prepare for job interviews. Paste a job description and upload your CV — the AI identifies skill gaps, builds a learning roadmap, and generates mock interview questions with scored feedback.

---

## Modules

| Module | Description |
|---|---|
| **Skill Gap Analyzer** | Paste or upload a JD (PDF/DOCX) + upload CV (PDF) or enter skills manually. AI outputs existing skills, missing skills, and a resource roadmap. |
| **Mock Interview** | Choose a role (Frontend, Backend, PM, Designer…). AI generates questions from the JD. Answer via text or audio — AI scores and gives feedback. |
| **Dashboard** | Practice session history, per-skill progress tracker, score trend over time. |

---

## Monorepo Structure

```
dev-career-ready-monorepo/
├── apps/
│   ├── web/          # Vite + TanStack Router (React 19, Tailwind v4)
│   └── api/          # Express 5 + Drizzle ORM (runs via Bun)
├── packages/
│   └── shared/       # Shared Zod schemas and TypeScript types
├── package.json      # Bun workspaces root
└── tsconfig.json
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend runtime** | Vite 8, React 19 |
| **Routing** | TanStack Router (file-based) |
| **Styling** | Tailwind CSS v4, `clsx`, `tailwind-merge`, `tw-animate-css` |
| **UI primitives** | Base UI (`@base-ui/react`) |
| **Icons** | Phosphor Icons (`@phosphor-icons/react`) |
| **Font** | JetBrains Mono (`@fontsource-variable/jetbrains-mono`) |
| **Backend runtime** | Bun |
| **API framework** | Express 5 |
| **ORM** | Drizzle ORM + drizzle-kit |
| **Shared** | Zod schemas, TypeScript types |
| **Language** | TypeScript 6 |
| **Linting** | ESLint 10 (flat config) + Prettier |
| **Package manager** | Bun workspaces |

---

## Getting Started

```bash
bun install
```

### Dev servers

```bash
bun run dev:web      # Frontend at http://localhost:3000
bun run dev:api      # API with Bun --hot reload
```

### Quality checks

```bash
bun run type-check   # tsc across all workspaces
bun run lint         # ESLint across monorepo
```
