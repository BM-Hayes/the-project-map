# The Project Map

**Domain:** theprojectmap.com

Map-first public filings tracker for large energy and water-touching projects.
Not a news site. Not a campaign. Not Weekend Atlas.

Stack (planned): Next.js · Mapbox GL · Supabase · Vercel.
Separate GitHub repo, Vercel project, and Supabase project from `weekend-atlas`.

## What this is

Open the map. See solar farms, data centers, large-load sites, and water/PFAS context.
Tap a site. See stage, next public date, and links to official filings.

Default geography: Darlington County, South Carolina. County is a filter, not the brand.

## Routes

- `/` — map (home)
- `/site/[slug]` — project dossier
- `/week` — next 14 days, text/printable
- `/suggest` — anonymous tip into `review_queue`
- `/about` — scope, sources, what this is not

## Status — 2026-09-01

- Domain reserved: theprojectmap.com
- Repo created: this repository
- App: holding page only until the map path is scaffolded in the build thread
- Do not attach the custom domain until a holding page is live on Vercel

## Sister-site rule

Zero shared header, footer, domain, copy, or data tables with Weekend Atlas.
Same human, same general stack, different product.
