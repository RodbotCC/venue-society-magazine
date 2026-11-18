<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Source of truth & deploys (READ FIRST)

- **Code:** `github.com/rawdre/venue-society-magazine`, branch `main`. This is the ONLY repo for this site. Do not create forks/copies (e.g. under RodbotCC) or push elsewhere.
- **Live site:** https://www.venuesocietymagazine.com (apex 308 → www).
- **Hosting:** Vercel team `rawdres-projects` (login rawdre / rawandre@gmail.com), project `venue-society-magazine` (`prj_FQsCvA0JgpOcjyqzXOshrbbvJ9DW`). It auto-deploys on every push to `main` of the repo above. Domain + DNS (incl. Google Workspace email records) also live in `rawdres-projects` (moved from tech@ on 2026-11-18).
- **To change the site:** `git pull` → edit → commit → `git push origin main`. That's the whole deploy. No manual `vercel deploy`.
- **Vercel CLI for this project:** the default `vercel` login (rawdre) — no extra flags.
- There is NO other Venue Society Vercel project. Any copy under `tech-4536s-projects` (tech@) or a `RodbotCC/venue-society-magazine` repo is stale — don't ship to it.
