# Analyze Page — Design Spec

> Skill Gap Analyzer: Paste JD + upload CV → AI outputs existing skills, missing skills, and a resource roadmap.
>
> **Design system:** Dark background (stone-950) + warm amber accents (amber-400 primary). Stone palette for neutrals. No translucent colors on borders — use solid Tailwind colors.

---

## 1. Page Layout (Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│  CareerReady_            Analyzer   Mock Interview   [Start]   🌐  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  SKILL GAP ANALYZER                                                │
│  Paste a job description and upload your CV.                       │
│  AI will identify your skill gaps and generate a roadmap.          │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─── JOB DESCRIPTION ─────────────────────────────────────────┐   │
│  │                                                              │   │
│  │  [ Paste job description here...                          ]  │   │
│  │  [                                                        ]  │   │
│  │  [                                                        ]  │   │
│  │  [                                                        ]  │   │
│  │  [                                                        ]  │   │
│  │  [                                                        ]  │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─── YOUR SKILLS ─────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │   [ Upload CV ]    or    [ Enter manually ]   ← tab toggle  │   │
│  │                                                              │   │
│  │  ┌─ CV Upload (active tab) ─────────────────────────────┐   │   │
│  │  │                                                       │   │   │
│  │  │     ┌───────────────────────────────────┐             │   │   │
│  │  │     │                                   │             │   │   │
│  │  │     │    ↑  Drop PDF here               │             │   │   │
│  │  │     │       or click to browse           │             │   │   │
│  │  │     │       .pdf, max 5MB                │             │   │   │
│  │  │     │                                   │             │   │   │
│  │  │     └───────────────────────────────────┘             │   │   │
│  │  │                                                       │   │   │
│  │  └───────────────────────────────────────────────────────┘   │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│                                        [ Analyze My Skills  → ]    │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  footer                                                             │
└─────────────────────────────────────────────────────────────────────┘
```

### Manual Entry Tab (alternate view)

```
│  ┌─ Manual Entry (active tab) ────────────────────────────────┐   │
│  │                                                             │   │
│  │  Type skills separated by comma or press Enter              │   │
│  │  ┌──────────────────────────────────────────────────────┐   │   │
│  │  │  e.g. React, TypeScript, Node.js                     │   │   │
│  │  └──────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  ┌──────┐ ┌────────────┐ ┌─────────┐ ┌───┐                │   │
│  │  │React ×│ │TypeScript ×│ │Node.js ×│ │+ │                │   │
│  │  └──────┘ └────────────┘ └─────────┘ └───┘                │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
```

---

## 2. Page Layout (Mobile)

```
┌──────────────────────────────┐
│ CareerReady_        [≡]  🌐  │
├──────────────────────────────┤
│                              │
│ SKILL GAP ANALYZER           │
│ Paste a job description      │
│ and upload your CV.          │
│                              │
├──────────────────────────────┤
│                              │
│ ── JOB DESCRIPTION ──       │
│                              │
│ ┌──────────────────────────┐ │
│ │ Paste job description    │ │
│ │ here...                  │ │
│ │                          │ │
│ │                          │ │
│ │                          │ │
│ └──────────────────────────┘ │
│                              │
│ ── YOUR SKILLS ──           │
│                              │
│ [Upload CV] [Enter manually] │
│                              │
│ ┌──────────────────────────┐ │
│ │                          │ │
│ │   ↑ Drop PDF here       │ │
│ │   or click to browse     │ │
│ │   .pdf, max 5MB          │ │
│ │                          │ │
│ └──────────────────────────┘ │
│                              │
│ [   Analyze My Skills   → ] │
│                              │
├──────────────────────────────┤
│ footer                       │
└──────────────────────────────┘
```

---

## 3. Results State (Desktop)

After submission, the page scrolls to results below the form (form stays visible but collapsed).

```
┌─────────────────────────────────────────────────────────────────────┐
│  nav                                                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  SKILL GAP ANALYZER                                                │
│  Results for: Senior Frontend Developer @ Acme Corp                │
│                                                                     │
│  ┌─ collapsed form ── [Edit inputs ↓] ─────────────────────────┐   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ── SUMMARY ──                                                     │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  12          │  │   5          │  │   7          │             │
│  │  Total       │  │  Matched     │  │  Missing     │             │
│  │  skills      │  │  skills      │  │  skills      │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ── MATCHED SKILLS ──                                              │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ ✓  React           ································ strong  │   │
│  │ ✓  TypeScript       ························· strong        │   │
│  │ ✓  Tailwind CSS     ··················· moderate            │   │
│  │ ✓  Git              ································ strong  │   │
│  │ ✓  REST APIs        ························· strong        │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ── MISSING SKILLS ──                                              │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ ✗  GraphQL          priority: high                          │   │
│  │ ✗  Next.js          priority: high                          │   │
│  │ ✗  Testing (Vitest) priority: medium                        │   │
│  │ ✗  CI/CD            priority: medium                        │   │
│  │ ✗  Docker           priority: low                           │   │
│  │ ✗  AWS S3           priority: low                           │   │
│  │ ✗  Figma            priority: low                           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ── LEARNING ROADMAP ──                                            │
│                                                                     │
│  01_ HIGH PRIORITY                                                 │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  GraphQL                                                     │   │
│  │  "Learn GraphQL fundamentals and integration with React"    │   │
│  │  ┌────────────┐ ┌───────────────┐ ┌──────────────────┐      │   │
│  │  │ official   │ │ tutorial      │ │ project idea     │      │   │
│  │  │ docs ↗     │ │ course ↗      │ │ suggestion       │      │   │
│  │  └────────────┘ └───────────────┘ └──────────────────┘      │   │
│  │                                                              │   │
│  │  Next.js                                                     │   │
│  │  "Master Next.js App Router for production React apps"      │   │
│  │  ┌────────────┐ ┌───────────────┐ ┌──────────────────┐      │   │
│  │  │ official   │ │ tutorial      │ │ project idea     │      │   │
│  │  │ docs ↗     │ │ course ↗      │ │ suggestion       │      │   │
│  │  └────────────┘ └───────────────┘ └──────────────────┘      │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  02_ MEDIUM PRIORITY                                               │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Testing (Vitest) ...                                        │   │
│  │  CI/CD ...                                                   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  03_ LOW PRIORITY                                                  │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Docker ...                                                  │   │
│  │  AWS S3 ...                                                  │   │
│  │  Figma ...                                                   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────┐  ┌────────────────────────────────┐      │
│  │ Try Mock Interview → │  │ Start New Analysis             │      │
│  └──────────────────────┘  └────────────────────────────────┘      │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  footer                                                             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Loading State

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  SKILL GAP ANALYZER                                                │
│  Analyzing your skills...                                          │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░  (skeleton pulse)   │   │
│  │                                                              │   │
│  │   Parsing job description...                                 │   │
│  │   Extracting skills from CV...                               │   │
│  │   Running gap analysis...                                    │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

- Show a stepped progress log (monospace terminal feel)
- Each step gets a `✓` when done, current step has a pulsing `▸`
- Skeleton blocks pulse below for the results area

---

## 5. Error State

```
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  ✗  Analysis failed                                         │   │
│  │                                                              │   │
│  │  Could not parse the job description. Please check that     │   │
│  │  you've pasted a valid job posting.                         │   │
│  │                                                              │   │
│  │  [Try Again]                                                │   │
│  └──────────────────────────────────────────────────────────────┘   │
```

- Red-tinted border: `border-destructive`
- Error text: `text-destructive`
- Inline within the form area, not a toast/modal

---

## 6. Component Inventory

### 6.1 Page Header

```tsx
<section className="border-b border-border px-4 py-16 md:px-6 md:py-24">
  <div className="mx-auto max-w-5xl">
    <h1>  — text-3xl font-bold tracking-tight md:text-4xl
    <p>  — text-muted-foreground mt-2 text-sm
  </div>
</section>
```

### 6.2 JD Textarea

| Property       | Value                                                              |
|----------------|--------------------------------------------------------------------|
| Element        | `<textarea>`                                                       |
| Container      | `border border-border p-5`                                         |
| Label          | `text-xs font-bold text-muted-foreground uppercase tracking-wide`  |
| Textarea       | `bg-transparent w-full min-h-[200px] text-sm font-mono resize-y`  |
| Placeholder    | `text-muted-foreground/50`                                         |
| Focus          | `focus:outline-none focus:ring-1 focus:ring-ring`                  |
| Char count     | `text-[10px] text-muted-foreground text-right mt-1`               |

### 6.3 Skills Input — Tab Toggle

| Property       | Value                                                              |
|----------------|--------------------------------------------------------------------|
| Container      | `border border-border p-5`                                         |
| Tab bar        | `flex gap-0 border-b border-border mb-5`                           |
| Active tab     | `text-xs font-bold px-3 py-2 border-b-2 border-amber-400 text-amber-400` |
| Inactive tab   | `text-xs text-muted-foreground px-3 py-2 hover:text-foreground`   |

### 6.4 CV Upload Dropzone

| Property       | Value                                                              |
|----------------|--------------------------------------------------------------------|
| Container      | `border border-dashed border-border p-8 text-center`              |
| Hover          | `hover:border-amber-400 transition-colors`                         |
| Drag active    | `border-amber-400 bg-amber-400/10`                                 |
| Icon           | `<UploadSimple size={24} weight="bold" />` (Phosphor)             |
| Text           | `text-xs text-muted-foreground mt-2`                               |
| File hint      | `text-[10px] text-muted-foreground/60`                             |
| Uploaded state | Show filename + size + `<X size={12}>` remove button              |

### 6.5 Manual Skill Tags Input

| Property       | Value                                                              |
|----------------|--------------------------------------------------------------------|
| Input          | `bg-transparent border-b border-border text-sm py-2 w-full`       |
| Placeholder    | `"Type a skill and press Enter"`                                   |
| Tag            | `inline-flex items-center gap-1 border border-amber-400/50 px-2 py-0.5 text-[10px] text-amber-300` |
| Tag remove     | `<X size={10}> hover:text-foreground cursor-pointer`               |
| Tag container  | `flex flex-wrap gap-1.5 mt-3`                                      |

### 6.6 Submit Button

```tsx
<Button size="lg" className="gap-1.5">
  Analyze My Skills
  <ArrowRight size={14} weight="bold" />
</Button>
```

- Uses existing `buttonVariants({ size: "lg" })` — primary variant (amber-400 bg, stone-950 text)
- Disabled state when JD is empty OR no skills provided
- Loading state: replace text with `"Analyzing..."` + spinner

### 6.7 Summary Stat Cards (Results)

| Property       | Value                                                              |
|----------------|--------------------------------------------------------------------|
| Grid           | `grid grid-cols-3 gap-4`                                           |
| Card           | `border border-border p-5`                                         |
| Number         | `text-3xl font-bold text-amber-400`                                |
| Label          | `text-xs text-muted-foreground mt-1`                               |

### 6.8 Matched Skill Row

```
┌─────────────────────────────────────────────────────────┐
│  ✓  React         ·························· strong     │
└─────────────────────────────────────────────────────────┘
```

| Property       | Value                                                              |
|----------------|--------------------------------------------------------------------|
| Container      | `flex items-center gap-3 py-2.5 border-b border-border last:border-b-0` |
| Check icon     | `<Check size={14} weight="bold" className="text-amber-400" />`    |
| Skill name     | `text-sm font-bold flex-shrink-0 w-36`                             |
| Dot line       | `flex-1 border-b border-dotted border-border mx-2`                |
| Level badge    | `text-[10px] text-muted-foreground`                                |

### 6.9 Missing Skill Row

```
┌─────────────────────────────────────────────────────────┐
│  ✗  GraphQL       ·························· high       │
└─────────────────────────────────────────────────────────┘
```

| Property       | Value                                                              |
|----------------|--------------------------------------------------------------------|
| Container      | Same as matched skill row                                          |
| X icon         | `<X size={14} weight="bold" className="text-muted-foreground" />`  |
| Priority badge | high → `text-amber-400 font-bold`, medium → `text-muted-foreground`, low → `text-muted-foreground/60` |

### 6.10 Roadmap Section

| Property          | Value                                                           |
|-------------------|-----------------------------------------------------------------|
| Priority heading  | `text-xs text-amber-400 font-bold` with `01_` prefix           |
| Card              | `border border-border p-5 mb-4 hover:border-amber-400 transition-colors` |
| Skill title       | `text-sm font-bold`                                            |
| Description       | `text-xs text-foreground/70 mt-1 leading-relaxed`              |
| Resource links    | Row of small bordered chips: `border border-amber-400/50 px-2 py-1 text-[10px] text-amber-300 hover:border-amber-400` |
| External link     | Append `<ArrowSquareOut size={10} />` icon                     |

### 6.11 Bottom CTA Bar

```tsx
<div className="flex flex-wrap gap-2 justify-end">
  <Link to="/mock-interview" className={buttonVariants({ size: "lg" })}>
    Try Mock Interview →
  </Link>
  <Button variant="outline" size="lg" onClick={resetForm}>
    Start New Analysis
  </Button>
</div>
```

---

## 7. Interaction Flow

```
[1] User lands on /analyze
    → Empty state: header + form (JD textarea + skills input)
    → Submit button disabled

[2] User pastes JD text
    → Char counter updates
    → Submit still disabled (no skills yet)

[3] User chooses input method:
    [3a] Upload CV tab (default)
         → Drag & drop PDF or click to browse
         → On upload: show filename + size + remove button
         → Submit enabled

    [3b] Manual entry tab
         → Type skill + Enter to add tag
         → Tags appear below input
         → Click × to remove tag
         → Submit enabled when ≥1 tag

[4] User clicks "Analyze My Skills"
    → Button shows loading state
    → Form fades slightly (opacity-60)
    → Progress log appears below form
    → Steps tick off: parse JD → extract CV → gap analysis → generate roadmap

[5] Results appear
    → Form collapses to one-line summary with "Edit inputs" expand toggle
    → Summary stats slide in
    → Matched skills list
    → Missing skills list
    → Learning roadmap grouped by priority
    → Bottom CTA: Mock Interview / New Analysis

[6] Error handling
    → Inline error card replaces progress log
    → Form remains editable
    → "Try Again" button re-submits
```

---

## 8. Page States Summary

| State    | Visible Sections                                               |
|----------|----------------------------------------------------------------|
| Empty    | Header + JD textarea (empty) + Skills input (empty tab) + disabled submit |
| Filled   | Header + JD textarea (filled) + Skills (CV uploaded or tags) + enabled submit |
| Loading  | Header + faded form + progress log with step indicators        |
| Results  | Header + collapsed form + summary stats + matched + missing + roadmap + bottom CTA |
| Error    | Header + form (editable) + inline error card + "Try Again"     |

---

## 9. Responsive Breakpoints

| Element             | Mobile (`< md`)          | Desktop (`≥ md`)            |
|---------------------|--------------------------|-----------------------------|
| Container padding   | `px-4 py-16`             | `px-6 py-24`                |
| Page title          | `text-3xl`               | `text-4xl`                  |
| Summary stat grid   | `grid-cols-1 gap-3`      | `grid-cols-3 gap-4`         |
| Skill row layout    | Stack name + badge       | Inline with dot leader      |
| Roadmap resources   | Vertical stack           | Horizontal flex wrap        |
| Bottom CTA          | Full width, stacked      | Right-aligned, inline       |
| Tab bar             | Full width tabs          | Auto-width tabs             |

---

## 10. Tokens Reference

### Colors (dark + amber design system)

| Token                       | Resolves to              | Usage                                    |
|-----------------------------|--------------------------|------------------------------------------|
| `bg-background`             | stone-950                | Page background                          |
| `bg-card`                   | stone-900                | Card backgrounds, popovers               |
| `bg-muted`                  | stone-800                | Subtle section backgrounds               |
| `bg-primary`                | amber-400                | Primary buttons (text: stone-950)        |
| `bg-secondary`              | amber-400 at 10%         | Secondary button backgrounds             |
| `bg-amber-400/10`           | —                        | Drag-active dropzone, subtle highlights  |
| `text-foreground`           | stone-50                 | Primary text, headings                   |
| `text-foreground/70`        | —                        | Body text, descriptions                  |
| `text-muted-foreground`     | stone-400                | Labels, secondary text, placeholders     |
| `text-muted-foreground/60`  | —                        | Tertiary hints                           |
| `text-amber-400`            | —                        | Accent text: step numbers, icons, stats, active tabs |
| `text-amber-300`            | —                        | Tag text, resource link text             |
| `border-border`             | white at 10%             | Default borders, dividers                |
| `border-amber-400`          | —                        | Hover state borders (solid, no opacity)  |
| `border-amber-400/50`       | —                        | Tag borders, resource chip borders       |
| `border-destructive`        | —                        | Error state borders                      |
| `text-destructive`          | —                        | Error text                               |
| `ring-ring`                 | amber-400                | Focus ring                               |

### Typography

| Element           | Classes                                           |
|-------------------|---------------------------------------------------|
| Page title        | `text-3xl font-bold tracking-tight md:text-4xl`   |
| Section label     | `text-xs font-bold uppercase tracking-wide text-muted-foreground` |
| Body text         | `text-xs leading-relaxed text-foreground/70`       |
| Stat number       | `text-3xl font-bold`                               |
| Skill name        | `text-sm font-bold`                                |
| Tag text          | `text-[10px]`                                      |
| Char count / hint | `text-[10px] text-muted-foreground`                |

### Spacing

| Pattern              | Value              |
|----------------------|--------------------|
| Section padding      | `px-4 py-16 md:px-6 md:py-24` |
| Between sections     | `border-b border-border`       |
| Card padding         | `p-5`                          |
| Between cards        | `gap-4` or `space-y-4`         |
| Between form fields  | `mt-8` or `space-y-8`          |
| Container max-width  | `max-w-5xl mx-auto`            |

### Icons (Phosphor)

| Icon                | Usage                         |
|---------------------|-------------------------------|
| `UploadSimple`      | CV upload dropzone            |
| `ArrowRight`        | Submit button, CTA links      |
| `ArrowSquareOut`    | External resource links        |
| `Check`             | Matched skill indicator        |
| `X`                 | Missing skill / remove tag     |
| `Target`            | Page header (optional)         |
| `CircleNotch`       | Loading spinner (animate-spin) |
| `Warning`           | Error state icon               |
| `CaretDown/Up`      | Collapse/expand form toggle    |

---

## 11. Phosphor Icon Import Reference

```tsx
import {
  ArrowRight,
  ArrowSquareOut,
  CaretDown,
  CaretUp,
  Check,
  CircleNotch,
  Target,
  UploadSimple,
  Warning,
  X,
} from "@phosphor-icons/react"
```

---

## 12. Accessibility Notes

- All form fields need associated `<label>` elements
- Dropzone must be keyboard-accessible (`tabIndex={0}`, Enter/Space to trigger file dialog)
- Skill tags: each tag's remove button needs `aria-label="Remove {skill}"`
- Loading state: use `aria-live="polite"` on the progress log
- Error state: use `role="alert"` on the error container
- Tab toggle: use `role="tablist"` / `role="tab"` / `role="tabpanel"` pattern
- Summary stats: use `aria-label` on each stat for screen readers
