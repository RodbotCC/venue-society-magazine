<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Source of truth & deploys (READ FIRST)

Venue Society is a **Comeketo-owned** project. Everything lives on Comeketo accounts (moved 2026-11-18):

- **Code:** `github.com/RodbotCC/venue-society-magazine`, branch `main` (RodbotCC = Comeketo "Tech Support" GitHub, login tech@comeketocatering.com). This is the ONLY repo for this site. `rawdre` has write access to push. (An old Nov-12 upload repo was deleted 2026-11-18; there is no other copy.)
- **Live site:** https://www.venuesocietymagazine.com (apex 308 → www).
- **Hosting:** Vercel team `tech-4536s-projects` (login tech@comeketocatering.com), project `venue-society-magazine` (`prj_g71nb9VUcXHYKzHlKgunUpED6zAK`). Auto-deploys on every push to `main` of the repo above. Domain + DNS (incl. Google Workspace MX/SPF/DKIM/DMARC) also live in this team.
- **To change the site:** `git pull` → edit → commit → `git push origin main`. That's the whole deploy. No manual `vercel deploy`.
- **Vercel CLI for this project:** `vercel <cmd> --global-config ~/.vercel-accounts/tech` (default CLI login is rawdre, a personal account that must NOT host this).
- Never move this project, repo or domain to a personal account (rawdre / rawandre@gmail.com).
