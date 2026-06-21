# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Deploy

This project uses a **dual-directory workflow** — edits happen in the source directory (here), but deployment requires a separate build directory at `C:\Users\ROG\buryad-build` because the path contains `!` which breaks Vercel CLI.

**Deploy sequence (PowerShell):**
```powershell
# 1. Sync source → build dir (exclude node_modules, .next, .git)
Copy-Item -Path "C:\Users\ROG\Documents\!projects\05_assorted\BuryadHelenApp\*" `
  -Destination "C:\Users\ROG\buryad-build" `
  -Recurse -Force `
  -Exclude @("node_modules", ".next", ".git")

# 2. Deploy from build dir
cd C:\Users\ROG\buryad-build
npx vercel --prod --yes
```

**Local dev:**
```powershell
npm run dev   # starts on http://localhost:3000
npm run build # verify no type errors before deploying
```

There are no tests and no lint script in package.json.

## Architecture

**Next.js 14 App Router** — all pages live under `app/`. Pages with state use `"use client"`, the home page (`app/page.tsx`) is a Server Component.

**Static content** lives in `content/*.json`:
- `phrasebook.json` — phrase categories with Buryat/Russian pairs
- `numbers.json`, `pronouns.json`, `verb-conjugations.json` — grammar reference data

**External API** — `https://burlang.ru/api/v1/` for vocabulary lookup:
- `/buryat-word/translate?q=WORD` — Buryat → Russian
- `/russian-word/translate?q=WORD` — Russian → Buryat
- `/buryat-word/search?q=QUERY` — search suggestions

**localStorage keys:**
- `buryad_favs` — favorite words (vocabulary page)
- `buryad_search_history` — recent searches (vocabulary page)

## Styling

**Tailwind CSS v4** — uses `@import "tailwindcss"` + `@theme {}` block in `app/globals.css`. Theme tokens (colors, fonts) are defined there as CSS custom properties, not in `tailwind.config.js`.

Custom CSS classes for animations (`page-enter`, `flip-card`, `card-reveal`, `flash-success`, `flash-error`, `btn-tap`, `spin-slow`) are defined in `globals.css` — use them via `className`, don't recreate inline.

**Fonts:** Nunito (body) + Playfair Display (headings) via `next/font/google` in `app/layout.tsx`. Apply display font with `style={{ fontFamily: '"Playfair Display", Georgia, serif' }}`.

**Flag SVGs:** Windows doesn't render flag emojis. `RussianFlag()` and `BuryatFlag()` are inline SVG components (defined in vocabulary page) — use them instead of 🇷🇺/🇷🇺 emojis.

## Key Files

- `app/layout.tsx` — root layout with fonts, PWA meta tags, `<BottomNav />`
- `components/BottomNav.tsx` — fixed bottom nav (6 items); active state by pathname
- `app/practice/page.tsx` — flashcard practice; 20 card sets in `CARD_SETS`; uses Pointer Events API for swipe + 2D card tilt; `"use client"`
- `app/topics/page.tsx` — themed vocabulary tabs (числа, цвета, животные, тело, еда, природа, дом, семья, профессии, прилагательные, глаголы)
- `app/vocabulary/page.tsx` — dictionary search with history, favorites, copy-to-clipboard
- `app/phrasebook/page.tsx` — accordion phrase list with search; `CopyButton` copies Buryat text
- `app/grammar/page.tsx` — grammar reference (pronouns, verb conjugations)
- `public/manifest.json` — PWA manifest with `scope: "/"` (required for iOS standalone mode)

## Patterns

**CopyButton component** — defined locally in each page file that needs it (phrasebook, vocabulary). Uses `navigator.clipboard.writeText()` with `e.stopPropagation()` to avoid triggering parent accordion toggles. Shows green checkmark for 1.5s.

**Practice card sets** — each entry in `CARD_SETS` has `{ id, title, subtitle, emoji, gradient, glow, group, cards[] }`. Groups are rendered as section headers. Card fronts are Buryat, backs are Russian.

**Content updates** — when adding new phrases or words, edit the relevant `content/*.json` or add data arrays directly in the page file (as done for verb sets in practice/topics). Verify words against the burlang.ru API before adding — some return 404.
