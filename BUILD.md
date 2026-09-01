# Build thread — start here

This file is the handoff from the strategy thread.

## Do first in the build conversation

1. Scaffold Next.js (App Router, TypeScript) in this repo. Do not fork weekend-atlas.
2. Holding page on `/` until the map is wired.
3. Separate Vercel project named `the-project-map` (not weekend-atlas).
4. Separate Supabase project (us-east-1 is fine). New tables, new keys.
5. Mapbox token lives in KeePass / Vercel env only. Never commit it.
6. Do not point theprojectmap.com at Vercel until the holding page is live and checked.

## Vercel project settings (required)

The first preview was a static file from `public-holding/`. That folder is retired.

- Framework Preset: **Next.js**
- Root Directory: **blank** (repository root). Not `public-holding`.
- Output Directory: **blank** (Next default)
- Install Command: `npm install`
- Build Command: `next build`
- Then **Deployments → Redeploy** the latest `main` commit.

## Locked product rules

- Map is the home page.
- Anonymous pin in localStorage. No account in v1.
- Tracker tone. No petitions, donate, or campaign chrome.
- Default filter: Darlington County, SC.
- Badges: official | verified | community | unverified.
- `/suggest` writes `review_queue` only. No auto-promote to published sites.
- Official source URL required before a site is published.

## First vertical slice

1. Holding page (done as soon as Next.js is in the repo).
2. Static GeoJSON seed of a few Darlington-area sites (Robinson Solar, known operating solar if parcel is public, Cheraw/Hartsville water as signals — only with public coordinates).
3. Map + site popup + `/site/[slug]` dossier shell.
4. `/week` fed by a hand-entered `events` table.
5. `/suggest` + queue.
6. Then scrape county agendas.

## What the owner cannot do yet

Do not wait on local npm, DNS, or Supabase dashboard clicks if GitHub + Vercel plugins can move the repo and preview URL forward.
Owner will add Mapbox + Supabase secrets when those accounts are ready.
